"""
Point d'entrée principal du serveur Flask pour Formulama Pro
Lance le serveur avec: python app.py
"""

import sys
import os

# Ajouter le répertoire backend au chemin Python
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Importer et lancer l'application depuis app_server.py
from app_server import app, initialiser_base_de_donnees, DATA_FOLDER_PATH

if __name__ == '__main__':
    # Initialiser la base de données au démarrage
    initialiser_base_de_donnees()
    print(f"\n[INFO] Dossier de documents configuré : {DATA_FOLDER_PATH}\n")
    
    # Lancer le serveur Flask
    app.run(debug=False, use_reloader=False, host="0.0.0.0", port=5000)
