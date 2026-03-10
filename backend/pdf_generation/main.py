from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
import json
import os
import sys

try:
    # Vérifier que bdd.json existe
    if not os.path.exists('bdd.json'):
        print("ERREUR: bdd.json non trouvé", file=sys.stderr)
        sys.exit(1)
    
    with open('bdd.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Vérifier que cerfaimage.jpg existe
    if not os.path.exists('cerfaimage.jpg'):
        print("ERREUR: cerfaimage.jpg non trouvé", file=sys.stderr)
        sys.exit(1)
    
except json.JSONDecodeError as e:
    print(f"ERREUR JSON dans bdd.json: {e}", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(f"ERREUR lors du chargement des données: {e}", file=sys.stderr)
    sys.exit(1)

c = canvas.Canvas("cerfa_14011-02.pdf", pagesize=A4) #créer l'objet canvas avec son nom et sa taille

page_width, page_height = A4 #mets les valeurs du format A4 dans les deux variables pour les utiliser plus tard

c.drawImage(# image cerfa d'arrière plan
    "cerfaimage.jpg",#nom du fichier d'où vient l'arrière plan
    0, 0,#position de l'image, comme elle fait la taille de la page on la place à l'origine.
    width=page_width,#donne à la largeur de l'image la largeur de la page
    height=page_height#donne à la hauteur de l'image la hauteur de la page
)

#----------------------------------------------------------------------------------------------------------------------------------------------
#CHAMPS TEXTUELS
#----------------------------------------------------------------------------------------------------------------------------------------------

nom_valeur = data.get('nom', '') #récupère la valeur associé à la clé 'nom'
c.acroForm.textfield(#acroForm permet de créer des champs
    name="nom",#clé
    x=144,#position horizontale
    y=638, #position verticale
    width=150,#largeur du champ
    height=17,#hauteur du champ
    value=nom_valeur,#valeur
    borderStyle='underlined',#style de la bordure = souligné
    forceBorder=True # force l'affichage de la bordure du champ
)

nomUsage_valeur = data.get('nomUsage', '')
c.acroForm.textfield(
    name="nomUsage",
    x=135,
    y=610,
    width=150,
    height=17,
    value=nomUsage_valeur,
    borderStyle='underlined',
    forceBorder=True
)

prenom_valeur = data.get('prenom', '')
c.acroForm.textfield(
    name="prenom",
    x=124,
    y=585,
    width=300,
    height=17,
    value=prenom_valeur,
    borderStyle='underlined',
    forceBorder=True
)

dateNaissance_valeur = data.get('dateNaissance', '')
c.acroForm.textfield(
    name="dateNaissance",
    x=107,
    y=560,
    width=110,
    height=15,
    value=dateNaissance_valeur,
    borderStyle='underlined',
    forceBorder=True
)

communeNaissance_valeur = data.get('communeNaissance', '')
c.acroForm.textfield(
    name="communeNaissance",
    x=280,
    y=560,
    width=250,
    height=17,
    value=communeNaissance_valeur,
    borderStyle='underlined',
    forceBorder=True
)

codePostalNaissance_valeur = data.get('codePostalNaissance', '')
c.acroForm.textfield(
    name="codePostalNaissance",
    x=125,
    y=542,
    width=80,
    height=17,
    value=codePostalNaissance_valeur,
    borderStyle='underlined',
    forceBorder=True
)

paysNaissance_valeur = data.get('paysNaissance', '')
c.acroForm.textfield(
    name="paysNaissance",
    x=245,
    y=542,
    width=285,
    height=17,
    value=paysNaissance_valeur,
    borderStyle='underlined',
    forceBorder=True
)

numeroAdresse_valeur = data.get('numeroAdresse', '')
c.acroForm.textfield(
    name="numeroAdresse",
    x=115,
    y=500,
    width=75,
    height=17,
    value=numeroAdresse_valeur,
    borderStyle='underlined',
    forceBorder=True
)

typeVoieAdresse_valeur = data.get('typeVoieAdresse', '')
c.acroForm.textfield(
    name="typeVoieAdresse",
    x=200,
    y=500,
    width=75,
    height=17,
    value=typeVoieAdresse_valeur,
    borderStyle='underlined',
    forceBorder=True
)

nomVoieAdresse_valeur = data.get('nomVoieAdresse', '')
c.acroForm.textfield(
    name="nomVoieAdresse",
    x=300,
    y=500,
    width=220,
    height=17,
    value=nomVoieAdresse_valeur,
    borderStyle='underlined',
    forceBorder=True
)

codePostal_valeur = data.get('codePostal', '')
c.acroForm.textfield(
    name="codePostal",
    x=130,
    y=475,
    width=60,
    height=17,
    value=codePostal_valeur,
    borderStyle='underlined',
    forceBorder=True
)

commune_valeur = data.get('commune', '')
c.acroForm.textfield(
    name="commune",
    x=280,
    y=475,
    width=225,
    height=17,
    value=commune_valeur,
    borderStyle='underlined',
    forceBorder=True
)

pays_valeur = data.get('pays', '')
c.acroForm.textfield(
    name="pays",
    x=110,
    y=455,
    width=375,
    height=17,
    value=pays_valeur,
    borderStyle='underlined',
    forceBorder=True
)

cni_valeur = data.get('cni', '')
c.acroForm.textfield(
    name='cni',
    x=124,
    y=386,
    width=135,
    height=17,
    value=cni_valeur,
    borderStyle='underlined',
    forceBorder=True
)

passeport_valeur = data.get('passeport', '')
c.acroForm.textfield(
    name='passeport',
    x=124,
    y=386,
    width=135,
    height=17,
    value=passeport_valeur,
    borderStyle='underlined',
    forceBorder=True
)

#----------------------------------------------------------------------------------------------------------------------------------------------
#CHAMPS À COCHER
#----------------------------------------------------------------------------------------------------------------------------------------------

perteIdentite_valeur = (data.get('perteIdentite', 'false').lower() == 'true')
c.acroForm.checkbox(
    name="perteIdentite",
    x=340,
    y=774,
    size=13,
    checked=perteIdentite_valeur
)

pertePasseport_valeur = (data.get('pertePasseport', 'false').lower() == 'true')
c.acroForm.checkbox(
    name="pertePasseport",
    x=460,
    y=774,
    size=13,
    checked=pertePasseport_valeur
)

majeur_valeur = (data.get('majeur', 'false').lower() == 'true')
c.acroForm.checkbox(
    name="majeur",
    x=263.3,
    y=696.4,
    size=13,
    checked=majeur_valeur
)

# Sauvegarder le PDF
try:
    c.save()
    print("PDF sauvegardé avec succès: cerfa_14011-02.pdf")
except Exception as e:
    print(f"ERREUR lors de la sauvegarde du PDF: {e}", file=sys.stderr)
    sys.exit(1)

mineur_valeur = (data.get('majeur', 'false').lower() == 'false')
c.acroForm.checkbox(
    name="mineur",
    x=450.9,
    y=696.4,
    size=13,
    checked=mineur_valeur
)

homme_valeur = (data.get('homme', 'false').lower() == 'true')
c.acroForm.checkbox(
    name="homme",
    x=225.95,
    y=658.2,
    size=13,
    checked=homme_valeur
)

femme_valeur = (data.get('femme', 'false').lower() == 'true')
c.acroForm.checkbox(
    name="femme",
    x=305.95,
    y=658.2,
    size=13,
    checked=femme_valeur
)

c.save()#sauvegarde le pdf
