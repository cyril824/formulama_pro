import sqlite3
import os
from gestion_db import DB_NAME

def migrate_documents():
    """
    Déplace tous les documents qui ne sont pas dans les deux catégories prédéfinies
    vers l'une des deux catégories existantes.
    Répartition: alterne entre "Documents supportés" et "Documents archivés"
    """
    conn = None
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        # Catégories valides
        valid_categories = ["Documents supportés", "Documents archivés"]
        
        # Récupérer tous les documents
        cursor.execute("SELECT id, nom_fichier, categorie FROM documents")
        all_documents = cursor.fetchall()
        
        if not all_documents:
            print("[INFO] Aucun document à migrer.")
            return
        
        # Filtrer les documents avec des catégories invalides
        invalid_docs = [doc for doc in all_documents if doc[2] not in valid_categories]
        
        if not invalid_docs:
            print("[INFO] Tous les documents sont déjà dans les bonnes catégories.")
            return
        
        print(f"[INFO] {len(invalid_docs)} document(s) à migrer...")
        
        # Répartir les documents
        for index, (doc_id, nom_fichier, old_category) in enumerate(invalid_docs):
            # Alterne entre les deux catégories
            new_category = valid_categories[index % 2]
            
            # Mettre à jour la catégorie
            cursor.execute(
                "UPDATE documents SET categorie = ? WHERE id = ?",
                (new_category, doc_id)
            )
            
            print(f"  ✓ '{nom_fichier}'")
            print(f"    {old_category} → {new_category}")
        
        conn.commit()
        print(f"\n[OK] {len(invalid_docs)} document(s) migrés avec succès !")
        
    except sqlite3.Error as e:
        print(f"[ERREUR] Erreur lors de la migration : {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Migration des documents")
    print("=" * 60)
    print()
    migrate_documents()
