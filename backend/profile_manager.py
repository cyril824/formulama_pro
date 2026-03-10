import os
import json
from datetime import datetime
from pathlib import Path
from profile_schema import AVAILABLE_FIELDS, validate_field_value


class ProfileManager:
    """Gère le stockage et la récupération des profils utilisateur"""
    
    def __init__(self, base_path):
        """
        Initialise le gestionnaire de profils
        
        Args:
            base_path: Chemin vers le dossier public/temp
        """
        self.base_path = base_path
        # Créer le dossier s'il n'existe pas
        Path(self.base_path).mkdir(parents=True, exist_ok=True)
    
    def get_profile_path(self, user_id="default_user"):
        """Retourne le chemin du fichier profil pour un utilisateur"""
        return os.path.join(self.base_path, f"profile_{user_id}.json")
    
    def load_profile(self, user_id="default_user"):
        """Charge le profil d'un utilisateur"""
        profile_path = self.get_profile_path(user_id)
        
        if not os.path.exists(profile_path):
            return {}
        
        try:
            with open(profile_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Erreur lors du chargement du profil {user_id}: {e}")
            return {}
    
    def save_profile(self, profile_data, user_id="default_user"):
        """Sauvegarde le profil d'un utilisateur"""
        profile_path = self.get_profile_path(user_id)
        
        try:
            # Valider tous les champs
            errors = {}
            for field_name, value in profile_data.items():
                # Ignorer les champs non reconnus (pour Versioning futur)
                if field_name not in AVAILABLE_FIELDS:
                    continue
                
                valid, msg = validate_field_value(field_name, value)
                if not valid:
                    errors[field_name] = msg
            
            if errors:
                return False, {"errors": errors}
            
            # Ajouter métadonnées
            profile_to_save = {
                **profile_data,
                "_last_updated": datetime.now().isoformat(),
                "_user_id": user_id
            }
            
            with open(profile_path, 'w', encoding='utf-8') as f:
                json.dump(profile_to_save, f, indent=2, ensure_ascii=False)
            
            print(f"Profil sauvegardé: {profile_path}")
            return True, {"message": "Profil sauvegardé avec succès"}
        
        except Exception as e:
            print(f"Erreur lors de la sauvegarde du profil {user_id}: {e}")
            return False, {"error": str(e)}
    
    def update_profile(self, profile_updates, user_id="default_user"):
        """Met à jour partiellement le profil (merge avec existant)"""
        # Charger le profil existant
        profile = self.load_profile(user_id)
        
        # Fusionner les mises à jour
        profile.update(profile_updates)
        
        # Sauvegarder
        return self.save_profile(profile, user_id)
    
    def get_available_fields(self):
        """Retourne la liste des champs disponibles"""
        return AVAILABLE_FIELDS
    
    def delete_profile(self, user_id="default_user"):
        """Supprime le profil d'un utilisateur"""
        profile_path = self.get_profile_path(user_id)
        
        try:
            if os.path.exists(profile_path):
                os.remove(profile_path)
                print(f"Profil supprimé: {profile_path}")
                return True, {"message": "Profil supprimé"}
            return False, {"error": "Profil non trouvé"}
        except Exception as e:
            print(f"Erreur lors de la suppression du profil {user_id}: {e}")
            return False, {"error": str(e)}
    
    def export_to_cerfa_json(self, user_id="default_user"):
        """Exporte le profil au format JSON compatible pour main.py"""
        profile = self.load_profile(user_id)
        
        # Créer le mapping des champs Profile vers champs CERFA
        # Pour l'instant, c'est un mapping 1:1
        cerfa_data = {}
        
        for field_name, value in profile.items():
            # Ignorer les métadonnées
            if field_name.startswith("_"):
                continue
            
            # Mapper les champs vers le format CERFA
            cerfa_data[field_name] = value
        
        return cerfa_data
    
    def get_profile_stats(self, user_id="default_user"):
        """Retourne des stats sur le profil"""
        profile = self.load_profile(user_id)
        
        total_fields = len(AVAILABLE_FIELDS)
        filled_fields = len({k: v for k, v in profile.items() 
                            if not k.startswith("_") and v})
        
        return {
            "total_fields": total_fields,
            "filled_fields": filled_fields,
            "completion_percentage": (filled_fields / total_fields * 100) if total_fields > 0 else 0,
            "last_updated": profile.get("_last_updated"),
        }
