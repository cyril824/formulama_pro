import os
import json
import subprocess
import shutil
import sys
from pathlib import Path
from profile_manager import ProfileManager


class PDFGenerator:
    """Génère les PDFs en utilisant le script main.py"""
    
    def __init__(self, pdf_gen_path, project_root):
        """
        Initialise le générateur de PDF
        
        Args:
            pdf_gen_path: Chemin vers backend/pdf_generation/
            project_root: Chemin racine du projet
        """
        self.pdf_gen_path = pdf_gen_path
        self.project_root = project_root
        self.main_py_path = os.path.join(pdf_gen_path, "main.py")
        self.cerfaimage_path = os.path.join(pdf_gen_path, "cerfaimage.jpg")
        
        # Vérifier que les fichiers existent
        if not os.path.exists(self.main_py_path):
            raise FileNotFoundError(f"main.py non trouvé: {self.main_py_path}")
        
        if not os.path.exists(self.cerfaimage_path):
            raise FileNotFoundError(f"cerfaimage.jpg non trouvé: {self.cerfaimage_path}")
    
    def generate_pdf(self, profile_data, user_id="default_user", output_filename="cerfa_14011-02.pdf"):
        """
        Génère un PDF à partir des données du profil
        
        Args:
            profile_data: Dictionnaire des données du profil
            user_id: ID de l'utilisateur
            output_filename: Nom du fichier PDF de sortie
        
        Returns:
            Tuple (success, message/path)
        """
        try:
            # 1. Créer le dossier temporaire pour ce PDF
            temp_workdir = os.path.join(
                self.project_root, 
                "public", "temp", 
                f"pdf_gen_{user_id}"
            )
            Path(temp_workdir).mkdir(parents=True, exist_ok=True)
            
            # 2. Copier cerfaimage.jpg dans le dossier temporaire
            shutil.copy(
                self.cerfaimage_path,
                os.path.join(temp_workdir, "cerfaimage.jpg")
            )
            
            # 3. Créer bdd.json dans le dossier temporaire
            # Filtrer les métadonnées et convertir toutes les valeurs en strings
            clean_data = {}
            for k, v in profile_data.items():
                if not k.startswith('_'):  # Skip metadata
                    # Convert None to empty string, everything else to string
                    clean_data[k] = '' if v is None else str(v)
            
            bdd_json_path = os.path.join(temp_workdir, "bdd.json")
            with open(bdd_json_path, 'w', encoding='utf-8') as f:
                json.dump(clean_data, f, indent=2, ensure_ascii=False)
            
            print(f"[PDF] bdd.json créé: {bdd_json_path}")
            print(f"[PDF] Contenu de bdd.json: {json.dumps(clean_data, indent=2, ensure_ascii=False)[:500]}...")  # Log first 500 chars
            
            # 4. Exécuter main.py dans le dossier temporaire
            pdf_path = os.path.join(temp_workdir, output_filename)
            
            print(f"[PDF] Exécution de: {sys.executable} {self.main_py_path}")
            print(f"[PDF] Working directory: {temp_workdir}")
            
            result = subprocess.run(
                [sys.executable, self.main_py_path],
                cwd=temp_workdir,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            # Log subprocess output
            if result.stdout:
                print(f"[PDF STDOUT] {result.stdout}")
            if result.stderr:
                print(f"[PDF STDERR] {result.stderr}")
            print(f"[PDF] return code: {result.returncode}")
            
            # Vérifier si le PDF a été créé
            if not os.path.exists(pdf_path):
                error_msg = f"Erreur: {result.stderr}" if result.stderr else "PDF non généré"
                print(f"[PDF ERROR] {error_msg}")
                return False, error_msg
            
            print(f"[PDF] PDF généré: {pdf_path}")
            return True, pdf_path
        
        except subprocess.TimeoutExpired:
            error = "Timeout lors de la génération du PDF (> 30s)"
            print(f"[PDF ERROR] {error}")
            return False, error
        
        except Exception as e:
            error = f"Erreur lors de la génération du PDF: {str(e)}"
            print(f"[PDF ERROR] {error}")
            return False, error
    
    def cleanup_temp_pdf_folder(self, user_id="default_user"):
        """Nettoie le dossier temporaire après utilisation"""
        try:
            temp_workdir = os.path.join(
                self.project_root, 
                "public", "temp", 
                f"pdf_gen_{user_id}"
            )
            if os.path.exists(temp_workdir):
                shutil.rmtree(temp_workdir)
                print(f"[PDF] Dossier temporaire nettoyé: {temp_workdir}")
        except Exception as e:
            print(f"[PDF WARNING] Erreur lors du nettoyage: {e}")
