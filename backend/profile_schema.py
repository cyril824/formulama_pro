# Schéma de champs disponibles pour le profil utilisateur
# Used for validation, suggestions, and field generation

AVAILABLE_FIELDS = {
    # --- INFORMATIONS CIVILES ---
    "civilite": {
        "label": "Civilité",
        "type": "select",
        "options": ["M", "Mme", "Mlle"],
        "category": "Informations civiles",
        "description": "Titre de civilité",
        "required": True,
        "placeholder": "Sélectionner",
    },
    "nom": {
        "label": "Nom de famille",
        "type": "text",
        "category": "Informations civiles",
        "description": "Votre nom de famille tel qu'il apparaît sur les documents officiels",
        "required": True,
        "placeholder": "Dupont",
    },
    "nomUsage": {
        "label": "Nom d'usage",
        "type": "text",
        "category": "Informations civiles",
        "description": "Votre nom d'usage si différent du nom de naissance",
        "required": False,
        "placeholder": "Dupont",
    },
    "nomNaissance": {
        "label": "Nom de naissance",
        "type": "text",
        "category": "Informations civiles",
        "description": "Votre nom à la naissance",
        "required": False,
        "placeholder": "Dupont",
    },
    "prenom": {
        "label": "Prénoms",
        "type": "text",
        "category": "Informations civiles",
        "description": "Tous vos prénoms séparés par des virgules",
        "required": True,
        "placeholder": "Jean, Michel, Fabrice",
    },
    "dateNaissance": {
        "label": "Date de naissance",
        "type": "date",
        "category": "Informations civiles",
        "description": "Votre date de naissance (JJ/MM/AAAA)",
        "required": True,
        "placeholder": "01/01/1980",
    },
    "lieuNaissance": {
        "label": "Lieu de naissance",
        "type": "text",
        "category": "Informations civiles",
        "description": "Commune de naissance",
        "required": False,
        "placeholder": "Paris",
    },
    "codePostalNaissance": {
        "label": "Code postal de naissance",
        "type": "text",
        "category": "Informations civiles",
        "description": "Code postal du lieu de naissance",
        "required": False,
        "placeholder": "75000",
    },
    "paysNaissance": {
        "label": "Pays de naissance",
        "type": "text",
        "category": "Informations civiles",
        "description": "Pays de naissance",
        "required": False,
        "placeholder": "France",
    },
    "nationalite": {
        "label": "Nationalité",
        "type": "text",
        "category": "Informations civiles",
        "description": "Votre nationalité",
        "required": False,
        "placeholder": "Française",
    },
    
    # --- PIÈCE D'IDENTITÉ ---
    "typeDocument": {
        "label": "Type de document",
        "type": "select",
        "options": ["Carte nationale d'identité", "Passeport", "Permis de conduire"],
        "category": "Pièce d'identité",
        "description": "Type de document d'identité",
        "required": False,
        "placeholder": "Sélectionner",
    },
    "numeroDocument": {
        "label": "Numéro de document",
        "type": "text",
        "category": "Pièce d'identité",
        "description": "Numéro de votre document d'identité",
        "required": False,
        "placeholder": "AB123456",
    },
    "dateExpiration": {
        "label": "Date d'expiration",
        "type": "date",
        "category": "Pièce d'identité",
        "description": "Date d'expiration du document",
        "required": False,
        "placeholder": "01/01/2030",
    },
    "cni": {
        "label": "Numéro CNI",
        "type": "text",
        "category": "Pièce d'identité",
        "description": "Numéro de carte nationale d'identité",
        "required": False,
        "placeholder": "1234567890",
    },
    "passeport": {
        "label": "Numéro de passeport",
        "type": "text",
        "category": "Pièce d'identité",
        "description": "Numéro de passeport",
        "required": False,
        "placeholder": "1234567890",
    },
    "numeroSecuriteSociale": {
        "label": "Numéro de sécurité sociale",
        "type": "text",
        "category": "Pièce d'identité",
        "description": "Votre numéro NIR",
        "required": False,
        "placeholder": "1 90 01 75 123 456 78",
    },
    
    # --- COORDONNÉES ---
    "email": {
        "label": "Adresse email",
        "type": "email",
        "category": "Coordonnées",
        "description": "Votre email principal",
        "required": False,
        "placeholder": "jean@example.com",
    },
    "telephone": {
        "label": "Téléphone principal",
        "type": "tel",
        "category": "Coordonnées",
        "description": "Votre numéro de téléphone",
        "required": False,
        "placeholder": "+33 6 12 34 56 78",
    },
    "telephoneSecondaire": {
        "label": "Téléphone secondaire",
        "type": "tel",
        "category": "Coordonnées",
        "description": "Un autre numéro de téléphone",
        "required": False,
        "placeholder": "+33 1 23 45 67 89",
    },
    
    # --- ADRESSE DOMICILE ---
    "numeroAdresse": {
        "label": "Numéro d'adresse",
        "type": "text",
        "category": "Adresse domicile",
        "description": "Numéro de rue ou de bâtiment",
        "required": False,
        "placeholder": "1",
    },
    "typeVoieAdresse": {
        "label": "Type de voie",
        "type": "select",
        "options": ["rue", "avenue", "boulevard", "place", "chemin", "impasse"],
        "category": "Adresse domicile",
        "description": "Type de voie",
        "required": False,
        "placeholder": "Sélectionner",
    },
    "nomVoieAdresse": {
        "label": "Nom de la voie",
        "type": "text",
        "category": "Adresse domicile",
        "description": "Nom de la rue/avenue/boulevard",
        "required": False,
        "placeholder": "Jean-Moulin",
    },
    "adresse": {
        "label": "Adresse complète",
        "type": "text",
        "category": "Adresse domicile",
        "description": "Votre adresse domicile complète",
        "required": False,
        "placeholder": "123 Rue de la Paix",
    },
    "codePostal": {
        "label": "Code postal",
        "type": "text",
        "category": "Adresse domicile",
        "description": "Code postal (5 chiffres)",
        "required": False,
        "placeholder": "44000",
    },
    "commune": {
        "label": "Commune",
        "type": "text",
        "category": "Adresse domicile",
        "description": "Commune de résidence",
        "required": False,
        "placeholder": "Nantes",
    },
    "ville": {
        "label": "Ville",
        "type": "text",
        "category": "Adresse domicile",
        "description": "Votre ville de résidence",
        "required": False,
        "placeholder": "Paris",
    },
    "pays": {
        "label": "Pays",
        "type": "text",
        "category": "Adresse domicile",
        "description": "Pays de résidence",
        "required": False,
        "placeholder": "France",
    },
    
    # --- SITUATION PERSONNELLE ---
    "majeur": {
        "label": "Majeur(e)",
        "type": "checkbox",
        "category": "Situation personnelle",
        "description": "Êtes-vous majeur(e) ?",
        "required": False,
    },
    "homme": {
        "label": "Homme",
        "type": "checkbox",
        "category": "Situation personnelle",
        "description": "Genre : homme",
        "required": False,
    },
    "femme": {
        "label": "Femme",
        "type": "checkbox",
        "category": "Situation personnelle",
        "description": "Genre : femme",
        "required": False,
    },
    "situation": {
        "label": "Situation familiale",
        "type": "select",
        "options": ["Célibataire", "Marié(e)", "Pacsé(e)", "Divorcé(e)", "Veuf(ve)"],
        "category": "Situation personnelle",
        "description": "Votre situation familiale",
        "required": False,
        "placeholder": "Sélectionner",
    },
    "nombreEnfants": {
        "label": "Nombre d'enfants",
        "type": "number",
        "category": "Situation personnelle",
        "description": "Nombre d'enfants à charge",
        "required": False,
        "placeholder": "0",
    },
    
    # --- DOCUMENTS PERDUS ---
    "perteIdentite": {
        "label": "Perte de carte identité",
        "type": "checkbox",
        "category": "Documents perdus",
        "description": "Avez-vous perdu votre carte d'identité ?",
        "required": False,
    },
    "pertePasseport": {
        "label": "Perte de passeport",
        "type": "checkbox",
        "category": "Documents perdus",
        "description": "Avez-vous perdu votre passeport ?",
        "required": False,
    },
    "datePerte": {
        "label": "Date de perte",
        "type": "date",
        "category": "Documents perdus",
        "description": "Date approximative de la perte",
        "required": False,
        "placeholder": "01/01/2024",
    },
    "lieuPerte": {
        "label": "Lieu de perte",
        "type": "text",
        "category": "Documents perdus",
        "description": "Lieu où le document a été perdu",
        "required": False,
        "placeholder": "Centre-ville",
    },
    "circonstancesPerte": {
        "label": "Circonstances",
        "type": "textarea",
        "category": "Documents perdus",
        "description": "Détails sur les circonstances de la perte",
        "required": False,
        "placeholder": "Décrivez les circonstances...",
    },
}


def get_field_schema():
    """Retourne le schéma complet des champs disponibles"""
    return AVAILABLE_FIELDS


def get_fields_by_category(category=None):
    """Retourne les champs organisés par catégorie"""
    if category:
        return {k: v for k, v in AVAILABLE_FIELDS.items() if v.get("category") == category}
    
    # Organiser par catégories
    categories = {}
    for key, field in AVAILABLE_FIELDS.items():
        cat = field.get("category", "Autre")
        if cat not in categories:
            categories[cat] = {}
        categories[cat][key] = field
    
    return categories


def validate_field_value(field_name, value):
    """Valide une valeur de champ"""
    if field_name not in AVAILABLE_FIELDS:
        return False, f"Champ inconnu: {field_name}"
    
    field_spec = AVAILABLE_FIELDS[field_name]
    field_type = field_spec.get("type")
    
    # Si la valeur est vide, vérifier si le champ est requis
    if value is None or (isinstance(value, str) and value.strip() == ""):
        if field_spec.get("required"):
            return False, f"{field_spec.get('label')} est requis"
        return True, "OK"
    
    # Validations spécifiques par type
    if field_type == "email" and value:
        import re
        if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', value):
            return False, "Email invalide"
    
    if field_type == "tel" and value:
        # Accepte différents formats de téléphone
        import re
        if not re.match(r'^[\d\s\+\-\(\)]+$', value):
            return False, "Téléphone invalide"
    
    if field_type == "date" and value:
        import re
        if not re.match(r'^\d{2}/\d{2}/\d{4}$', value):
            return False, "Format date invalide (JJ/MM/AAAA)"
    
    return True, "OK"


def suggest_fields(user_input):
    """Suggest matching field names based on user input"""
    suggestions = []
    input_lower = user_input.lower()
    
    for field_key, field_spec in AVAILABLE_FIELDS.items():
        label = field_spec.get("label", "").lower()
        description = field_spec.get("description", "").lower()
        
        # Match si l'input est dans le label ou la description
        if input_lower in label or input_lower in description:
            suggestions.append({
                "key": field_key,
                "label": field_spec.get("label"),
                "category": field_spec.get("category"),
                "description": field_spec.get("description"),
                "type": field_spec.get("type"),
            })
    
    return suggestions
