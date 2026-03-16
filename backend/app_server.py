import flask
from flask import Flask, request, jsonify, send_from_directory, abort, send_file
from flask_cors import CORS
import os 
from werkzeug.utils import secure_filename 
import urllib.parse
import base64 
import ssl

# Importe toutes les fonctions nécessaires
from gestion_db import ajouter_document, recuperer_documents_par_categorie, supprimer_document, initialiser_base_de_donnees, recuperer_4_derniers_documents, diagnostiquer_fichiers_locaux, recuperer_tous_documents, recuperer_document_par_id, marquer_document_signe, marquer_document_rempli, recuperer_toutes_categories, recuperer_stats

# Importe les modules de gestion de profils et PDF
from profile_manager import ProfileManager
from pdf_generator import PDFGenerator
from profile_schema import get_field_schema, suggest_fields 

# 1. Configuration de l'application Flask
app = Flask(__name__)
CORS(app) 

# --- DÉFINITION DU CHEMIN DU DOSSIER DE DONNÉES ---
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_FOLDER_PATH = os.path.join(PROJECT_ROOT, 'dist')
DATA_FOLDER_PATH = os.path.join(PROJECT_ROOT, 'data')
SIGNATURES_FOLDER_PATH = os.path.join(DATA_FOLDER_PATH, 'signatures')
TEMP_FOLDER_PATH = os.path.join(PROJECT_ROOT, 'public', 'temp')
PDF_GEN_PATH = os.path.join(PROJECT_ROOT, 'backend', 'pdf_generation')

# Créer les dossiers s'ils n'existent pas
os.makedirs(SIGNATURES_FOLDER_PATH, exist_ok=True)
os.makedirs(TEMP_FOLDER_PATH, exist_ok=True)

print(f"[DEBUG] PROJECT_ROOT: {PROJECT_ROOT}")
print(f"[DEBUG] DIST_FOLDER_PATH: {DIST_FOLDER_PATH}")
print(f"[DEBUG] DIST exists: {os.path.exists(DIST_FOLDER_PATH)}")
print(f"[DEBUG] index.html exists: {os.path.exists(os.path.join(DIST_FOLDER_PATH, 'index.html'))}")

# --- INITIALISATION DES GESTIONNAIRES ---
try:
    profile_manager = ProfileManager(TEMP_FOLDER_PATH)
    pdf_generator = PDFGenerator(PDF_GEN_PATH, PROJECT_ROOT)
    print("[INFO] Gestionnaires de profil et PDF initialisés avec succès")
except Exception as e:
    print(f"[WARNING] Erreur lors de l'initialisation des gestionnaires: {e}")
    profile_manager = None
    pdf_generator = None
# ----------------------------------------------------

# --- FONCTION UTILITAIRE POUR LE MIME TYPE ---
def get_mimetype(filename):
    """Détermine le MIME type basé sur l'extension du fichier."""
    if filename.lower().endswith('.pdf'):
        return 'application/pdf'
    elif filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
        return 'image/' + filename.split('.')[-1]
    else:
        return 'application/octet-stream'


# --- FONCTION POUR SAUVEGARDER LA SIGNATURE ---
def save_signature(doc_id, signature_base64):
    """Sauvegarde la signature (base64 PNG) sur le disque."""
    try:
        # Supprimer le préfixe data:image/png;base64, si présent
        if 'base64,' in signature_base64:
            signature_base64 = signature_base64.split('base64,')[1]
        
        # Décoder et sauvegarder
        signature_binary = base64.b64decode(signature_base64)
        signature_path = os.path.join(SIGNATURES_FOLDER_PATH, f'{doc_id}.png')
        
        with open(signature_path, 'wb') as f:
            f.write(signature_binary)
        
        print(f"Signature sauvegardée: {signature_path}")
        return True
    except Exception as e:
        print(f"Erreur lors de la sauvegarde de la signature: {e}")
        return False


# 3. Endpoint pour ajouter un document (Méthode POST) - GÈRE L'UPLOAD DU FICHIER
@app.route('/api/documents/ajouter', methods=['POST'])
def api_ajouter_document():
    if 'file' not in request.files:
        return jsonify({"error": "Aucun fichier n'a été envoyé."}), 400
        
    f = request.files['file']
    categorie = request.form.get('categorie')
    
    if not categorie:
        return jsonify({"error": "Catégorie manquante."}), 400
    
    # Sécurisation du nom de fichier
    filename = secure_filename(f.filename)

    # 1. Sauvegarde physique du fichier dans le dossier /data
    file_path = os.path.join(DATA_FOLDER_PATH, filename)
    
    try:
        if not os.path.exists(DATA_FOLDER_PATH):
            os.makedirs(DATA_FOLDER_PATH) 
            
        f.save(file_path) 
        print(f"[OK] Fichier sauvegardé physiquement à: {file_path}")
        
    except Exception as e:
        print(f"[ERROR] Erreur de sauvegarde du fichier: {e}")
        return jsonify({"error": f"Échec de la sauvegarde physique du fichier sur le serveur: {e}"}), 500

    # 2. Enregistrement dans la base de données
    simulated_path = f"//localhost/data/{filename}" 
    try:
        doc_id = ajouter_document(filename, simulated_path, categorie)
        
        if doc_id:
            return jsonify({"message": "Document et BDD mis à jour avec succès", "id": doc_id}), 201 
        else:
            return jsonify({"error": "Erreur lors de l'insertion dans la base de données"}), 500
    except Exception as e:
        print(f"[ERROR] Erreur lors de l'ajout du document en BDD: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Erreur lors de l'insertion en BDD: {str(e)}"}), 500

# ============================================
# ENDPOINTS POUR LES CATÉGORIES
# ============================================

# Endpoint pour récupérer toutes les catégories
@app.route('/api/categories', methods=['GET'])
def api_recuperer_categories():
    try:
        categories = recuperer_toutes_categories()
        # Retourner juste les noms des catégories pour le dropdown
        category_names = [cat['nom'] for cat in categories]
        return jsonify(category_names), 200
    except Exception as e:
        print(f"Erreur lors de la récupération des catégories: {e}")
        return jsonify({"error": "Erreur interne du serveur"}), 500

# Endpoint pour récupérer les statistiques des documents
@app.route('/api/stats', methods=['GET'])
def api_recuperer_stats():
    try:
        stats = recuperer_stats()
        return jsonify(stats), 200
    except Exception as e:
        print(f"Erreur lors de la récupération des statistiques: {e}")
        return jsonify({"error": "Erreur interne du serveur"}), 500

# ============================================
# ENDPOINTS POUR LES DOCUMENTS
# ============================================

# 4. Endpoint pour récupérer les documents par catégorie (Méthode GET)
@app.route('/api/documents/<categorie>', methods=['GET'])
def api_recuperer_documents(categorie):
    documents = recuperer_documents_par_categorie(categorie)
    return jsonify(documents), 200

# Endpoint pour récupérer TOUS les documents
@app.route('/api/documents/all', methods=['GET'])
def api_recuperer_tous_documents():
    try:
        documents = recuperer_tous_documents()
        return jsonify(documents), 200
    except Exception as e:
        print(f"Erreur lors de la récupération de tous les documents: {e}")
        return jsonify({"error": "Erreur interne du serveur"}), 500

# Endpoint pour récupérer les 4 documents récents
@app.route('/api/documents/recents', methods=['GET'])
def api_recuperer_documents_recents():
    try:
        documents = recuperer_4_derniers_documents()
        return jsonify(documents), 200
    except Exception as e:
        print(f"Erreur lors de la récupération des documents récents: {e}")
        return jsonify({"error": "Erreur interne du serveur lors de la récupération des documents récents"}), 500

# Endpoint de diagnostic
@app.route('/api/documents/diagnostiquer-fichiers', methods=['GET'])
def api_diagnostiquer_fichiers():
    diagnostic_result = diagnostiquer_fichiers_locaux(DATA_FOLDER_PATH)
    return jsonify(diagnostic_result), 200

# --- ENDPOINT FINAL POUR CONSULTER LE FICHIER (CORRIGÉ POUR SÉCURITÉ) ---
@app.route('/api/documents/ouvrir/<filename>', methods=['GET'])
def api_ouvrir_document(filename):
    """
    Sert le fichier statique demandé à partir du dossier de données.
    """
    try:
        # Décodage de l'URL pour gérer les espaces (%20)
        decoded_filename = urllib.parse.unquote(filename)
        
        full_path = os.path.join(DATA_FOLDER_PATH, decoded_filename)
        
        print(f"\n--- DEBUG D'OUVERTURE ---")
        print(f"Fichier demandé (décodé) : {decoded_filename}")
        
        if not os.path.exists(full_path):
            print(f"ERREUR PHYSIQUE: Fichier introuvable à : {full_path}")
            abort(404) 

        print(f"Fichier trouvé : Tentative d'envoi.")
        
        # Utilise send_from_directory pour servir le fichier
        response = send_from_directory(
            directory=DATA_FOLDER_PATH,
            path=decoded_filename, # Utilise le nom décodé
            as_attachment=False,
            mimetype=get_mimetype(decoded_filename)
        )
        
        # 🚨 CORRECTION CRITIQUE : Supprime les en-têtes de sécurité qui bloquent l'iFrame
        # Les en-têtes sont ajoutés à l'objet 'response' retourné par send_from_directory
        response.headers['X-Frame-Options'] = 'ALLOWALL'
        response.headers['Content-Security-Policy'] = "frame-ancestors 'self' http://localhost:* https://localhost:*;"
        
        print(f"-------------------------\n")
        return response
    
    except Exception as e:
        # Gère les erreurs internes
        print(f"Erreur générale lors de l'ouverture du document {filename}: {e}")
        return jsonify({"error": f"Erreur interne du serveur lors de l'ouverture: {e}"}), 500


# 5. Endpoint pour marquer un document comme signé (Méthode PUT)
@app.route('/api/documents/<int:doc_id>/sign', methods=['PUT'])
def api_marquer_document_signe(doc_id):
    try:
        data = request.get_json() or {}
        signature_data = data.get('signatureData')
        
        # Marquer le document comme signé
        if marquer_document_signe(doc_id):
            # Sauvegarder la signature si fournie
            if signature_data:
                save_signature(doc_id, signature_data)
            return jsonify({"message": f"Document ID {doc_id} marqué comme signé."}), 200
        else:
            return jsonify({"error": f"Impossible de mettre à jour le document ID {doc_id}."}), 404
    except Exception as e:
        print(f"Erreur lors de la signature du document: {e}")
        return jsonify({"error": "Erreur interne du serveur"}), 500

# 5.1 Endpoint pour marquer un document comme rempli (Méthode PUT)
@app.route('/api/documents/<int:doc_id>/fill', methods=['PUT'])
def api_marquer_document_rempli(doc_id):
    try:
        # Récupérer les données envoyées
        data = request.get_json() or {}
        user_id = data.get('user_id', 'default_user')
        
        # Le profil peut être envoyé directement dans la requête
        # Sinon, on essaie de le charger depuis le stockage
        profile = data.get('profile', None)
        
        if not profile:
            # 1. Récupérer le profil de l'utilisateur depuis le stockage
            if not profile_manager:
                return jsonify({"error": "Gestionnaire de profils non disponible"}), 500
            
            profile = profile_manager.load_profile(user_id)
            
            if not profile:
                return jsonify({"error": "Profil utilisateur vide. Veuillez remplir votre profil d'abord."}), 400
        
        # 2. Générer le PDF
        if not pdf_generator:
            return jsonify({"error": "Gestionnaire PDF non disponible"}), 500
        
        success, result = pdf_generator.generate_pdf(profile, user_id)
        
        if not success:
            return jsonify({"error": f"Erreur de génération PDF: {result}"}), 500
        
        pdf_path = result
        
        # 3. Marquer le document comme rempli dans la BDD
        if marquer_document_rempli(doc_id):
            # 4. Retourner le PDF généré au client pour téléchargement
            return send_file(pdf_path, as_attachment=True, download_name="cerfa_14011-02.pdf")
        else:
            return jsonify({"error": f"Impossible de mettre à jour le document ID {doc_id}."}), 404
    
    except Exception as e:
        print(f"Erreur lors du remplissage du document: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Erreur interne du serveur: {str(e)}"}), 500

# Endpoint pour récupérer la signature d'un document
@app.route('/api/documents/<int:doc_id>/signature', methods=['GET'])
def api_get_signature(doc_id):
    try:
        signature_path = os.path.join(SIGNATURES_FOLDER_PATH, f'{doc_id}.png')
        if os.path.exists(signature_path):
            return send_file(signature_path, mimetype='image/png')
        else:
            return jsonify({"error": "Signature not found"}), 404
    except Exception as e:
        print(f"Erreur lors de la récupération de la signature: {e}")
        return jsonify({"error": "Erreur interne du serveur"}), 500

# 6. Endpoint pour supprimer un document (Méthode DELETE)
@app.route('/api/documents/<int:doc_id>', methods=['DELETE'])
def api_supprimer_document(doc_id):
    if supprimer_document(doc_id):
        return jsonify({"message": f"Document ID {doc_id} supprimé."}), 200
    else:
        return jsonify({"error": f"Impossible de supprimer le document ID {doc_id}. Introuvable ou erreur interne."}), 404

# 7. Endpoint pour supprimer tous les documents (Méthode DELETE)
@app.route('/api/documents', methods=['DELETE'])
def api_supprimer_tous_documents():
    try:
        # Récupérer tous les documents
        from gestion_db import recuperer_tous_documents, supprimer_document
        documents = recuperer_tous_documents()
        
        # Supprimer chaque fichier du dossier /data
        for doc in documents:
            file_path = os.path.join(DATA_FOLDER_PATH, doc.get('nom_fichier'))
            if os.path.exists(file_path):
                os.remove(file_path)
            # Supprimer de la base de données
            supprimer_document(doc.get('id'))
        
        return jsonify({"message": "Tous les documents ont été supprimés"}), 200
    except Exception as e:
        print(f"Erreur lors de la suppression de tous les documents: {e}")
        return jsonify({"error": f"Erreur lors de la suppression: {e}"}), 500

# 8. Endpoint pour prévisualiser un document
@app.route('/api/documents/preview/<int:doc_id>')
def api_preview_document(doc_id):
    """Retourne le fichier du document pour prévisualisation"""
    try:
        from gestion_db import recuperer_document_par_id
        
        # Récupérer le document depuis la base de données
        document = recuperer_document_par_id(doc_id)
        
        if not document or not document.get('nom_fichier'):
            return jsonify({"error": "Document non trouvé"}), 404
        
        # Utiliser le chemin absolu dans le dossier data
        filename = document.get('nom_fichier')
        file_path = os.path.join(DATA_FOLDER_PATH, filename)
        
        # Vérifier que le fichier existe
        if not os.path.exists(file_path):
            print(f"Fichier non trouvé à: {file_path}")
            return jsonify({"error": "Fichier non trouvé"}), 404
        
        # Déterminer le MIME type
        mimetype = get_mimetype(filename)
        
        print(f"Servant le document: {file_path} (MIME: {mimetype})")
        
        # Retourner le fichier avec les bons headers CORS
        response = send_from_directory(
            DATA_FOLDER_PATH, 
            filename,
            mimetype=mimetype
        )
        
        # Ajouter les headers CORS pour que react-pdf puisse charger
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Range'
        response.headers['Accept-Ranges'] = 'bytes'
        
        return response
    except Exception as e:
        print(f"Erreur lors de la récupération du document: {e}")
        return jsonify({"error": str(e)}), 500

# 9. Endpoint pour servir directement les fichiers du dossier data
@app.route('/api/documents/file/<filename>')
def serve_document_file(filename):
    """Sert les fichiers du dossier data"""
    try:
        return send_from_directory(DATA_FOLDER_PATH, filename)
    except Exception as e:
        print(f"Erreur lors de la lecture du fichier: {e}")
        return jsonify({"error": "Fichier non trouvé"}), 404

# ============================================
# ENDPOINTS POUR LA GESTION DES PROFILS
# ============================================

# Endpoint pour récupérer le schéma des champs disponibles
@app.route('/api/profile/fields-schema', methods=['GET'])
def api_get_fields_schema():
    """Retourne la liste des champs disponibles"""
    try:
        schema = get_field_schema()
        return jsonify(schema), 200
    except Exception as e:
        print(f"Erreur lors de la récupération du schéma: {e}")
        return jsonify({"error": "Erreur interne du serveur"}), 500


# Endpoint pour obtenir des suggestions de champs
@app.route('/api/profile/suggest-fields', methods=['POST'])
def api_suggest_fields():
    """Suggère des champs basés sur une entrée utilisateur"""
    try:
        data = request.get_json() or {}
        user_input = data.get('input', '').strip()
        
        if not user_input:
            return jsonify({"error": "Entrée vide"}), 400
        
        suggestions = suggest_fields(user_input)
        return jsonify({"suggestions": suggestions}), 200
    except Exception as e:
        print(f"Erreur lors de la suggestion de champs: {e}")
        return jsonify({"error": "Erreur interne du serveur"}), 500


# Endpoint pour récupérer le profil de l'utilisateur
@app.route('/api/profile/<user_id>', methods=['GET'])
def api_get_profile(user_id):
    """Récupère le profil de l'utilisateur"""
    try:
        if not profile_manager:
            return jsonify({"error": "Gestionnaire de profils non disponible"}), 500
        
        profile = profile_manager.load_profile(user_id)
        stats = profile_manager.get_profile_stats(user_id)
        
        return jsonify({
            "profile": profile,
            "stats": stats
        }), 200
    except Exception as e:
        print(f"Erreur lors de la récupération du profil: {e}")
        return jsonify({"error": "Erreur interne du serveur"}), 500


# Endpoint pour sauvegarder/mettre à jour le profil
@app.route('/api/profile/<user_id>', methods=['POST', 'PUT'])
def api_save_profile(user_id):
    """Sauvegarde ou met à jour le profil de l'utilisateur"""
    try:
        data = request.get_json() or {}
        
        if not profile_manager:
            return jsonify({"error": "Gestionnaire de profils non disponible"}), 500
        
        # Faire une mise à jour partielle si c'est un PUT
        if request.method == 'PUT':
            success, response = profile_manager.update_profile(data, user_id)
        else:
            # POST: remplacer complètement
            success, response = profile_manager.save_profile(data, user_id)
        
        if success:
            return jsonify(response), 200
        else:
            return jsonify(response), 400
    
    except Exception as e:
        print(f"Erreur lors de la sauvegarde du profil: {e}")
        return jsonify({"error": f"Erreur interne du serveur: {str(e)}"}), 500


# Endpoint pour supprimer le profil
@app.route('/api/profile/<user_id>', methods=['DELETE'])
def api_delete_profile(user_id):
    """Supprime le profil de l'utilisateur"""
    try:
        if not profile_manager:
            return jsonify({"error": "Gestionnaire de profils non disponible"}), 500
        
        success, response = profile_manager.delete_profile(user_id)
        
        if success:
            return jsonify(response), 200
        else:
            return jsonify(response), 404
    except Exception as e:
        print(f"Erreur lors de la suppression du profil: {e}")
        return jsonify({"error": "Erreur interne du serveur"}), 500


# Endpoint dédié pour générer un PDF
@app.route('/api/generate-pdf', methods=['POST'])
def api_generate_pdf():
    """Génère un PDF à partir des données envoyées"""
    try:
        data = request.get_json() or {}
        profile_data = data.get('profile', {})
        user_id = data.get('user_id', 'default_user')
        
        if not profile_data:
            return jsonify({"error": "Données de profil vides"}), 400
        
        if not pdf_generator:
            return jsonify({"error": "Gestionnaire PDF non disponible"}), 500
        
        success, result = pdf_generator.generate_pdf(profile_data, user_id)
        
        if not success:
            return jsonify({"error": f"Erreur de génération PDF: {result}"}), 500
        
        pdf_path = result
        # Retourner le PDF comme fichier à télécharger
        return send_file(pdf_path, as_attachment=True, download_name="cerfa_14011-02.pdf")
    
    except Exception as e:
        print(f"Erreur lors de la génération du PDF: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Erreur interne du serveur: {str(e)}"}), 500

# ============================================
# ROUTES POUR SERVIR L'INTERFACE FRONTEND
# ============================================

# Les routes spécifiques DOIVENT être avant le wildcard route
# Sinon Flask va matcher le wildcard d'abord

@app.route('/assets/<path:path>')
def serve_assets(path):
    """Sert les assets compilés"""
    try:
        assets_path = os.path.join(DIST_FOLDER_PATH, 'assets')
        return send_from_directory(assets_path, path)
    except Exception as e:
        print(f"Asset not found: {path}")
        return jsonify({"error": "Asset not found"}), 404

@app.route('/index.html')
@app.route('/')
def serve_index():
    """Affiche l'interface principale"""
    try:
        index_path = os.path.join(DIST_FOLDER_PATH, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(DIST_FOLDER_PATH, 'index.html')
        else:
            return jsonify({"error": "index.html not found"}), 500
    except Exception as e:
        print(f"Erreur serve_index: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/<path:path>')
def serve_spa(path):
    """Fallback pour les routes SPA - sert index.html pour React Router"""
    # NE PAS servir index.html pour les routes API
    if path.startswith('api/'):
        return jsonify({"error": "Not found"}), 404
    
    try:
        # D'abord, vérifier si le fichier existe dans dist/
        full_path = os.path.join(DIST_FOLDER_PATH, path)
        if os.path.isfile(full_path):
            return send_from_directory(DIST_FOLDER_PATH, path)
        
        # Pour tout autre chemin, servir index.html (React Router gère la navigation)
        index_path = os.path.join(DIST_FOLDER_PATH, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(DIST_FOLDER_PATH, 'index.html')
    except Exception as e:
        print(f"Erreur serve_spa: {e}")
    
    return jsonify({"error": "Not found"}), 404

# 7. Lancement du serveur
if __name__ == '__main__':
    initialiser_base_de_donnees()
    print(f"\n[INFO] Dossier de documents configuré : {DATA_FOLDER_PATH}\n")
    # Lancement du serveur Flask sur le port 5001 avec waitress (compatible Windows)
    from waitress import serve
    print("[OK] Serveur PRO démarré sur http://0.0.0.0:5001")
    serve(app, host='0.0.0.0', port=5001, threads=4)