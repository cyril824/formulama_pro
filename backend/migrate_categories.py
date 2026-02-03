#!/usr/bin/env python3
"""
Script pour migrer tous les documents vers "Non signé"
"""

import sqlite3
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DB_NAME = os.path.join(PROJECT_ROOT, 'data', 'documents.db')

def migrate_categories():
    """Migre tous les documents vers 'Non signé'"""
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        # Mettre à jour tous les documents vers "Non signé"
        update_query = """
        UPDATE documents 
        SET categorie = 'Non signé'
        """
        
        cursor.execute(update_query)
        conn.commit()
        
        # Vérifier le nombre de lignes mises à jour
        affected_rows = cursor.rowcount
        print(f"✅ Migration réussie! {affected_rows} document(s) mis à jour vers 'Non signé'")
        
        # Afficher les documents après migration
        cursor.execute("SELECT id, nom_fichier, categorie FROM documents")
        documents = cursor.fetchall()
        print(f"\n📋 Statut actuel des documents:")
        for doc in documents:
            print(f"  - ID {doc[0]}: {doc[1]} (Catégorie: {doc[2]})")
        
        conn.close()
        return True
        
    except sqlite3.Error as e:
        print(f"❌ Erreur lors de la migration: {e}")
        return False

if __name__ == "__main__":
    print(f"📂 Base de données: {DB_NAME}")
    migrate_categories()

