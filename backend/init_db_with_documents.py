#!/usr/bin/env python3
"""
Script pour initialiser la base de données avec les documents existants du dossier /data
"""

import sqlite3
import os
import sys
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DB_NAME = os.path.join(PROJECT_ROOT, 'data', 'pro.db')
DATA_FOLDER = os.path.join(PROJECT_ROOT, 'data')

def init_database():
    """Initialise la base de données et ajoute les documents existants"""
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        # Créer la table si elle n'existe pas
        creation_table_query = """
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom_fichier TEXT NOT NULL,
            chemin_local TEXT NOT NULL,
            categorie TEXT NOT NULL,
            date_ajout DATETIME,
            is_signed BOOLEAN DEFAULT 0,
            is_filled BOOLEAN DEFAULT 0
        );
        """
        cursor.execute(creation_table_query)
        
        # Ajouter les colonnes manquantes si elles n'existent pas
        cursor.execute("PRAGMA table_info(documents)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'is_signed' not in columns:
            cursor.execute("ALTER TABLE documents ADD COLUMN is_signed BOOLEAN DEFAULT 0")
            print("[OK] Colonne 'is_signed' ajoutée.")
        
        if 'is_filled' not in columns:
            cursor.execute("ALTER TABLE documents ADD COLUMN is_filled BOOLEAN DEFAULT 0")
            print("[OK] Colonne 'is_filled' ajoutée.")
        
        conn.commit()
        
        # Lister les fichiers PDF et documents existants
        pdf_files = []
        if os.path.exists(DATA_FOLDER):
            for filename in os.listdir(DATA_FOLDER):
                filepath = os.path.join(DATA_FOLDER, filename)
                # Inclure les fichiers PDF et autres documents, exclure les .db et dossiers
                if (os.path.isfile(filepath) and not filename.startswith('.') 
                    and not filename.endswith('.db') and not filename.endswith('.sqlite3')):
                    pdf_files.append(filename)
        
        if not pdf_files:
            print("⚠️  Aucun document trouvé dans le dossier /data")
            conn.close()
            return False
        
        print(f"📋 Documents trouvés: {pdf_files}")
        
        # Vérifier les documents déjà en BD
        cursor.execute("SELECT nom_fichier FROM documents")
        existing_docs = {row[0] for row in cursor.fetchall()}
        
        # Ajouter les documents manquants à la BD
        added_count = 0
        for filename in pdf_files:
            if filename not in existing_docs:
                # Déterminer la catégorie basée sur le nom du fichier
                if 'contrat' in filename.lower() or 'apprentissage' in filename.lower():
                    categorie = 'Contrats'
                elif 'certificat' in filename.lower() or 'medical' in filename.lower():
                    categorie = 'Certificats'
                else:
                    categorie = 'Autres documents'
                
                chemin_local = f"/data/{filename}"
                date_ajout = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                
                insert_query = """
                INSERT INTO documents (nom_fichier, chemin_local, categorie, date_ajout)
                VALUES (?, ?, ?, ?)
                """
                cursor.execute(insert_query, (filename, chemin_local, categorie, date_ajout))
                added_count += 1
                print(f"  ✅ Ajouté: {filename} (Catégorie: {categorie})")
        
        conn.commit()
        
        # Afficher le statut final
        cursor.execute("SELECT COUNT(*) FROM documents")
        total_docs = cursor.fetchone()[0]
        
        print(f"\n✅ Base de données initialisée avec succès!")
        print(f"   - Fichiers ajoutés: {added_count}")
        print(f"   - Total de documents en BD: {total_docs}")
        
        # Lister tous les documents
        cursor.execute("SELECT id, nom_fichier, categorie FROM documents")
        docs = cursor.fetchall()
        print(f"\n📚 Liste des documents en BD:")
        for doc_id, nom_fichier, categorie in docs:
            print(f"  - ID {doc_id}: {nom_fichier} ({categorie})")
        
        conn.close()
        return True
        
    except sqlite3.Error as e:
        print(f"❌ Erreur SQLite: {e}")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

if __name__ == "__main__":
    print(f"📂 Base de données: {DB_NAME}")
    print(f"📂 Dossier de documents: {DATA_FOLDER}\n")
    init_database()
