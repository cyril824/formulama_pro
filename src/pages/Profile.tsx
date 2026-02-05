import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Save, X, ChevronDown, Building2, FileText, MapPin, Phone, DollarSign, Shield, Users, Globe, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useDocumentContext } from "@/context/DocumentContext";

// Interface pour les établissements
interface Etablissement {
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  telephone: string;
  email: string;
  type: string;
}

// Interface pour les certifications
interface Certification {
  nom: string;
  dateObtention: string;
  dateExpiration: string;
  numero: string;
}

// Interface pour les données entreprise
interface UserData {
  // ==== IDENTIFICATION ENTREPRISE ====
  raisonSociale: string;
  siret: string;
  siren: string;
  numeroTVA: string;
  codeAPE: string;
  secteurActivite: string;
  formeJuridique: string;
  dateCreation: string;
  capitalSocial: string;
  
  // ==== IMMATRICULATION & DOCUMENTS LÉGAUX ====
  numeroImmatriculationRCS: string;
  numeroKbis: string;
  dateKbis: string;
  numeroImmatriculationRM: string;
  
  // ==== ADRESSES & ÉTABLISSEMENTS ====
  etablissements: Etablissement[];
  
  // ==== CONTACTS GÉNÉRAUX ====
  emailGeneral: string;
  telephoneGeneral: string;
  telephoneSecondaire: string;
  siteWeb: string;
  reseauxSociaux: string;
  
  // ==== DONNÉES BANCAIRES ====
  iban: string;
  bic: string;
  nomBanque: string;
  titulaireDuCompte: string;
  
  // ==== FISCALITÉ ====
  numeroFiscal: string;
  regimeFiscal: string;
  chiffreAffairesAnnuel: string;
  beneficeOuPerte: string;
  tauxTVA: string;
  centreGestionAgree: string;
  numeroCentreGestion: string;
  
  // ==== ORGANISMES SOCIAUX ====
  affiliationURSSAF: string;
  numeroCompteURSSAF: string;
  caisseretraite: string;
  
  // ==== ASSURANCES PROFESSIONNELLES ====
  rcProNumero: string;
  rcProAssureur: string;
  rcProDateExpiration: string;
  assuranceLocauxNumero: string;
  assuranceLocauxAssureur: string;
  assuranceLocauxDateExpiration: string;
  assuranceAutoNumero: string;
  assuranceAutoAssureur: string;
  assuranceAutoDateExpiration: string;
  assuranceCyberNumero: string;
  assuranceCyberAssureur: string;
  assuranceCyberDateExpiration: string;
  
  // ==== CONFORMITÉ & NORMES ====
  certifications: Certification[];
  agrementParticulier: string;
  
  // ==== DONNÉES COMMERCIALES ====
  effectifTotal: string;
  zoneGeographique: string;
  codificationSecteur: string;
  
  // ==== PROPRIÉTÉ INTELLECTUELLE ====
  marquesDeposees: string;
  brevets: string;
  droitsAuteur: string;
  
  // ==== CONFORMITÉ ENVIRONNEMENTALE & LÉGALE ====
  numeroICPE: string;
  classificationEnvironnementale: string;
  conformiteRGPD: string;
  registreTraitementDonnees: string;
  
  // ==== INFORMATIONS COMMERCIALES ====
  delaiMoyenPaiement: string;
  modalitesFacturation: string;
  conditionsReglement: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { documentChanged } = useDocumentContext();

  // État des données entreprise
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    // IDENTIFICATION
    raisonSociale: "TechSolutions SARL",
    siret: "12345678901234",
    siren: "123456789",
    numeroTVA: "FR12345678901",
    codeAPE: "6201Z",
    secteurActivite: "Services Informatiques",
    formeJuridique: "SARL",
    dateCreation: "2015-06-20",
    capitalSocial: "50000",
    
    // IMMATRICULATION
    numeroImmatriculationRCS: "123456789",
    numeroKbis: "123456789001",
    dateKbis: "2024-01-15",
    numeroImmatriculationRM: "",
    
    // ÉTABLISSEMENTS
    etablissements: [
      {
        nom: "Siège Social",
        adresse: "123 Avenue de la République",
        codePostal: "75000",
        ville: "Paris",
        telephone: "+33 1 23 45 67 89",
        email: "contact@techsolutions.fr",
        type: "Siège"
      },
      {
        nom: "Établissement Secondaire",
        adresse: "456 Rue de la Paix",
        codePostal: "69000",
        ville: "Lyon",
        telephone: "+33 4 78 90 12 34",
        email: "lyon@techsolutions.fr",
        type: "Établissement secondaire"
      }
    ],
    
    // CONTACTS
    emailGeneral: "contact@techsolutions.fr",
    telephoneGeneral: "+33 1 23 45 67 89",
    telephoneSecondaire: "+33 1 98 76 54 32",
    siteWeb: "www.techsolutions.fr",
    reseauxSociaux: "LinkedIn: /techsolutions | Twitter: @techsol",
    
    // DONNÉES BANCAIRES
    iban: "FR1420041010050500013M02606",
    bic: "BNAGFRPP",
    nomBanque: "BNP Paribas",
    titulaireDuCompte: "TechSolutions SARL",
    
    // FISCALITÉ
    numeroFiscal: "12 345 678 901",
    regimeFiscal: "Réel",
    chiffreAffairesAnnuel: "250000",
    beneficeOuPerte: "45000",
    tauxTVA: "20",
    centreGestionAgree: "CGA Nord Paris",
    numeroCentreGestion: "75123456",
    
    // ORGANISMES SOCIAUX
    affiliationURSSAF: "Île-de-France",
    numeroCompteURSSAF: "751234567890",
    caisseretraite: "CARSAT Île-de-France",
    
    // ASSURANCES
    rcProNumero: "RC2024001234",
    rcProAssureur: "AXA Assurances",
    rcProDateExpiration: "2025-12-31",
    assuranceLocauxNumero: "LOC2024005678",
    assuranceLocauxAssureur: "Allianz",
    assuranceLocauxDateExpiration: "2025-12-31",
    assuranceAutoNumero: "AUTO2024001234",
    assuranceAutoAssureur: "MAAF",
    assuranceAutoDateExpiration: "2025-06-30",
    assuranceCyberNumero: "CYBER2024001234",
    assuranceCyberAssureur: "XXL Assurances",
    assuranceCyberDateExpiration: "2025-12-31",
    
    // CONFORMITÉ & NORMES
    certifications: [
      {
        nom: "ISO 27001",
        dateObtention: "2020-03-15",
        dateExpiration: "2026-03-15",
        numero: "CERT-ISO27001-2020"
      }
    ],
    agrementParticulier: "Agrément travaux de développement informatique",
    
    // DONNÉES COMMERCIALES
    effectifTotal: "12",
    zoneGeographique: "Île-de-France, Rhône-Alpes",
    codificationSecteur: "Services informatiques et de conseil",
    
    // PROPRIÉTÉ INTELLECTUELLE
    marquesDeposees: "TechSolutions® (INPI - 2015)",
    brevets: "",
    droitsAuteur: "Logiciels propriétaires deposés",
    
    // CONFORMITÉ ENVIRONNEMENTALE
    numeroICPE: "",
    classificationEnvironnementale: "Non classée",
    conformiteRGPD: "Oui",
    registreTraitementDonnees: "Mis à jour le 2024-01-20",
    
    // INFORMATIONS COMMERCIALES
    delaiMoyenPaiement: "30 jours",
    modalitesFacturation: "Électronique avec signature",
    conditionsReglement: "Virement bancaire ou carte bancaire"
  });

  const [editedData, setEditedData] = useState<UserData>(userData);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const savedData = sessionStorage.getItem("userProfileData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setUserData(parsedData);
      setEditedData(parsedData);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEditProfile = () => {
    setEditedData(userData);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setUserData(editedData);
    sessionStorage.setItem("userProfileData", JSON.stringify(editedData));
    setIsEditingProfile(false);
    
    toast({
      title: "Enregistrement réussi",
      description: "Vos modifications ont été sauvegardées avec succès.",
      className: "bg-green-500 text-white border-0 fixed top-4 left-1/2 -translate-x-1/2 rounded-lg shadow-lg max-w-xs px-4 py-2 text-sm animate-fade-in-out",
      duration: 3000,
    });
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
  };

  const handleInputChange = (field: keyof UserData, value: any) => {
    setEditedData({
      ...editedData,
      [field]: value,
    });
  };

  const handleEtablissementChange = (index: number, field: string, value: string) => {
    const newEtablissements = [...editedData.etablissements];
    newEtablissements[index] = {
      ...newEtablissements[index],
      [field]: value
    };
    setEditedData({
      ...editedData,
      etablissements: newEtablissements
    });
  };

  const addEtablissement = () => {
    setEditedData({
      ...editedData,
      etablissements: [...editedData.etablissements, {
        nom: "",
        adresse: "",
        codePostal: "",
        ville: "",
        telephone: "",
        email: "",
        type: "Établissement secondaire"
      }]
    });
  };

  const removeEtablissement = (index: number) => {
    setEditedData({
      ...editedData,
      etablissements: editedData.etablissements.filter((_, i) => i !== index)
    });
  };

  const addCertification = () => {
    setEditedData({
      ...editedData,
      certifications: [...editedData.certifications, {
        nom: "",
        dateObtention: "",
        dateExpiration: "",
        numero: ""
      }]
    });
  };

  const removeCertification = (index: number) => {
    setEditedData({
      ...editedData,
      certifications: editedData.certifications.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-[var(--shadow-soft)]">
        <div className="w-full px-3 sm:px-4 h-14 sm:h-16 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground">Profil Entreprise</h1>
          </div>
        </div>
      </header>

      <main className="w-full px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-6xl mx-auto">
        {/* En-tête Principal */}
        <Card className="p-4 sm:p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{userData.raisonSociale}</h2>
              <p className="text-sm text-muted-foreground mt-2">{userData.formeJuridique} • {userData.secteurActivite}</p>
              <p className="text-xs text-muted-foreground mt-1">Créée le {userData.dateCreation}</p>
            </div>
            {!isEditingProfile && (
              <Button
                onClick={handleEditProfile}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Modifier
              </Button>
            )}
          </div>

          {!isEditingProfile ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">SIRET</p>
                <p className="font-medium text-sm text-foreground">{userData.siret}</p>
              </div>
              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">SIREN</p>
                <p className="font-medium text-sm text-foreground">{userData.siren}</p>
              </div>
              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">TVA</p>
                <p className="font-medium text-sm text-foreground">{userData.numeroTVA}</p>
              </div>
              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Capital</p>
                <p className="font-medium text-sm text-foreground">{userData.capitalSocial}€</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground border-b pb-2">Informations Générales</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Raison Sociale</label>
                  <Input value={editedData.raisonSociale} onChange={(e) => handleInputChange("raisonSociale", e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Forme Juridique</label>
                  <select value={editedData.formeJuridique} onChange={(e) => handleInputChange("formeJuridique", e.target.value)} className="w-full px-3 py-2 border rounded text-sm text-foreground bg-background">
                    <option value="SARL">SARL</option>
                    <option value="SAS">SAS</option>
                    <option value="EIRL">EIRL</option>
                    <option value="Auto-entrepreneur">Auto-entrepreneur</option>
                    <option value="SASU">SASU</option>
                    <option value="Micro-entreprise">Micro-entreprise</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">SIRET</label>
                  <Input value={editedData.siret} onChange={(e) => handleInputChange("siret", e.target.value)} className="text-sm" placeholder="14 chiffres" />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">SIREN</label>
                  <Input value={editedData.siren} onChange={(e) => handleInputChange("siren", e.target.value)} className="text-sm" placeholder="9 chiffres" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Numéro de TVA</label>
                  <Input value={editedData.numeroTVA} onChange={(e) => handleInputChange("numeroTVA", e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Code APE</label>
                  <Input value={editedData.codeAPE} onChange={(e) => handleInputChange("codeAPE", e.target.value)} className="text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Secteur d'Activité</label>
                  <Input value={editedData.secteurActivite} onChange={(e) => handleInputChange("secteurActivite", e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Date de Création</label>
                  <Input type="date" value={editedData.dateCreation} onChange={(e) => handleInputChange("dateCreation", e.target.value)} className="text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Capital Social (€)</label>
                <Input type="number" value={editedData.capitalSocial} onChange={(e) => handleInputChange("capitalSocial", e.target.value)} className="text-sm" />
              </div>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          {/* IMMATRICULATION & DOCUMENTS LÉGAUX */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Immatriculation & Documents Légaux
            </h3>

            {!isEditingProfile ? (
              <div className="space-y-2">
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">N° Immatriculation RCS/RM</p><p className="text-foreground">{userData.numeroImmatriculationRCS}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">N° Kbis</p><p className="text-foreground">{userData.numeroKbis} (Date: {userData.dateKbis})</p></div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">N° Immatriculation RCS/RM</label>
                  <Input value={editedData.numeroImmatriculationRCS} onChange={(e) => handleInputChange("numeroImmatriculationRCS", e.target.value)} className="text-sm" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">N° Kbis</label>
                    <Input value={editedData.numeroKbis} onChange={(e) => handleInputChange("numeroKbis", e.target.value)} className="text-sm" />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Date Kbis</label>
                    <Input type="date" value={editedData.dateKbis} onChange={(e) => handleInputChange("dateKbis", e.target.value)} className="text-sm" />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* ADRESSES & ÉTABLISSEMENTS */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Sièges & Établissements
              </h3>
            </div>

            {!isEditingProfile ? (
              <div className="space-y-3">
                {userData.etablissements.map((etab, index) => (
                  <div key={index} className="p-4 bg-secondary/30 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground">{etab.nom}</p>
                        <p className="text-xs text-muted-foreground mt-1">{etab.type}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-foreground">{etab.adresse}</p>
                      <p className="text-foreground">{etab.codePostal} {etab.ville}</p>
                      <p className="text-primary">📞 {etab.telephone}</p>
                      <p className="text-primary">📧 {etab.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {editedData.etablissements.map((etab, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-secondary/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Établissement {index + 1}</h4>
                      {editedData.etablissements.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEtablissement(index)}
                          className="text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Nom</label>
                        <Input value={etab.nom} onChange={(e) => handleEtablissementChange(index, "nom", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
                        <select value={etab.type} onChange={(e) => handleEtablissementChange(index, "type", e.target.value)} className="w-full px-3 py-2 border rounded text-sm text-foreground bg-background">
                          <option value="Siège">Siège</option>
                          <option value="Établissement secondaire">Établissement secondaire</option>
                          <option value="Domiciliation">Domiciliation</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Adresse</label>
                      <Input value={etab.adresse} onChange={(e) => handleEtablissementChange(index, "adresse", e.target.value)} className="text-sm" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Code Postal</label>
                        <Input value={etab.codePostal} onChange={(e) => handleEtablissementChange(index, "codePostal", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Ville</label>
                        <Input value={etab.ville} onChange={(e) => handleEtablissementChange(index, "ville", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Téléphone</label>
                        <Input value={etab.telephone} onChange={(e) => handleEtablissementChange(index, "telephone", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
                        <Input type="email" value={etab.email} onChange={(e) => handleEtablissementChange(index, "email", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addEtablissement} className="w-full text-sm">
                  + Ajouter un établissement
                </Button>
              </div>
            )}
          </Card>

          {/* CONTACTS */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Contacts Généraux
            </h3>

            {!isEditingProfile ? (
              <div className="space-y-2">
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Email Général</p><p className="text-foreground">{userData.emailGeneral}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Téléphone</p><p className="text-foreground">{userData.telephoneGeneral}</p></div>
                {userData.telephoneSecondaire && <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Téléphone Secondaire</p><p className="text-foreground">{userData.telephoneSecondaire}</p></div>}
                {userData.siteWeb && <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Site Web</p><p className="text-foreground">{userData.siteWeb}</p></div>}
                {userData.reseauxSociaux && <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Réseaux Sociaux</p><p className="text-foreground text-sm">{userData.reseauxSociaux}</p></div>}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Email Général</label>
                  <Input type="email" value={editedData.emailGeneral} onChange={(e) => handleInputChange("emailGeneral", e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Téléphone</label>
                  <Input value={editedData.telephoneGeneral} onChange={(e) => handleInputChange("telephoneGeneral", e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Téléphone Secondaire</label>
                  <Input value={editedData.telephoneSecondaire} onChange={(e) => handleInputChange("telephoneSecondaire", e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Site Web</label>
                  <Input value={editedData.siteWeb} onChange={(e) => handleInputChange("siteWeb", e.target.value)} className="text-sm" placeholder="www.example.fr" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Réseaux Sociaux</label>
                  <Input value={editedData.reseauxSociaux} onChange={(e) => handleInputChange("reseauxSociaux", e.target.value)} className="text-sm" placeholder="LinkedIn, Twitter, etc." />
                </div>
              </div>
            )}
          </Card>

          {/* DONNÉES BANCAIRES */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Données Bancaires
            </h3>

            {!isEditingProfile ? (
              <div className="space-y-2">
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Titulaire du Compte</p><p className="text-foreground">{userData.titulaireDuCompte}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">IBAN</p><p className="text-foreground font-mono text-sm">{userData.iban}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">BIC</p><p className="text-foreground">{userData.bic}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Banque</p><p className="text-foreground">{userData.nomBanque}</p></div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Titulaire du Compte</label>
                  <Input value={editedData.titulaireDuCompte} onChange={(e) => handleInputChange("titulaireDuCompte", e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">IBAN</label>
                  <Input value={editedData.iban} onChange={(e) => handleInputChange("iban", e.target.value)} className="text-sm" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">BIC</label>
                    <Input value={editedData.bic} onChange={(e) => handleInputChange("bic", e.target.value)} className="text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Banque</label>
                    <Input value={editedData.nomBanque} onChange={(e) => handleInputChange("nomBanque", e.target.value)} className="text-sm" />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* FISCALITÉ */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Fiscalité
            </h3>

            {!isEditingProfile ? (
              <div className="space-y-2">
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Numéro Fiscal</p><p className="text-foreground">{userData.numeroFiscal}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Régime Fiscal</p><p className="text-foreground">{userData.regimeFiscal}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Chiffre d'Affaires Annuel</p><p className="text-foreground">{userData.chiffreAffairesAnnuel}€</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Bénéfice/Perte</p><p className="text-foreground">{userData.beneficeOuPerte}€</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Taux TVA</p><p className="text-foreground">{userData.tauxTVA}%</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Centre de Gestion Agréé</p><p className="text-foreground">{userData.centreGestionAgree}</p></div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Numéro Fiscal</label>
                    <Input value={editedData.numeroFiscal} onChange={(e) => handleInputChange("numeroFiscal", e.target.value)} className="text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Régime Fiscal</label>
                    <select value={editedData.regimeFiscal} onChange={(e) => handleInputChange("regimeFiscal", e.target.value)} className="w-full px-3 py-2 border rounded text-sm text-foreground bg-background">
                      <option value="Micro-entreprise">Micro-entreprise</option>
                      <option value="Réel">Réel</option>
                      <option value="Simplifié">Simplifié</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Chiffre d'Affaires Annuel (€)</label>
                    <Input type="number" value={editedData.chiffreAffairesAnnuel} onChange={(e) => handleInputChange("chiffreAffairesAnnuel", e.target.value)} className="text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Bénéfice/Perte (€)</label>
                    <Input type="number" value={editedData.beneficeOuPerte} onChange={(e) => handleInputChange("beneficeOuPerte", e.target.value)} className="text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Taux TVA (%)</label>
                    <Input type="number" value={editedData.tauxTVA} onChange={(e) => handleInputChange("tauxTVA", e.target.value)} className="text-sm" step="0.1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Centre de Gestion Agréé</label>
                    <Input value={editedData.centreGestionAgree} onChange={(e) => handleInputChange("centreGestionAgree", e.target.value)} className="text-sm" />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* ORGANISMES SOCIAUX */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Organismes Sociaux
            </h3>

            {!isEditingProfile ? (
              <div className="space-y-2">
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Affiliation URSSAF</p><p className="text-foreground">{userData.affiliationURSSAF}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">N° Compte URSSAF</p><p className="text-foreground">{userData.numeroCompteURSSAF}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Caisse de Retraite</p><p className="text-foreground">{userData.caisseretraite}</p></div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Affiliation URSSAF</label>
                  <Input value={editedData.affiliationURSSAF} onChange={(e) => handleInputChange("affiliationURSSAF", e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">N° Compte URSSAF</label>
                  <Input value={editedData.numeroCompteURSSAF} onChange={(e) => handleInputChange("numeroCompteURSSAF", e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Caisse de Retraite</label>
                  <Input value={editedData.caisseretraite} onChange={(e) => handleInputChange("caisseretraite", e.target.value)} className="text-sm" />
                </div>
              </div>
            )}
          </Card>

          {/* ASSURANCES PROFESSIONNELLES */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Assurances Professionnelles
            </h3>

            {!isEditingProfile ? (
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-medium text-foreground mb-2">Responsabilité Civile Professionnelle</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">N°:</span> {userData.rcProNumero}</p>
                    <p><span className="text-muted-foreground">Assureur:</span> {userData.rcProAssureur}</p>
                    <p><span className="text-muted-foreground">Expiration:</span> {userData.rcProDateExpiration}</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-medium text-foreground mb-2">Assurance Locaux</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">N°:</span> {userData.assuranceLocauxNumero}</p>
                    <p><span className="text-muted-foreground">Assureur:</span> {userData.assuranceLocauxAssureur}</p>
                    <p><span className="text-muted-foreground">Expiration:</span> {userData.assuranceLocauxDateExpiration}</p>
                  </div>
                </div>
                {userData.assuranceAutoNumero && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="font-medium text-foreground mb-2">Assurance Automobile</p>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">N°:</span> {userData.assuranceAutoNumero}</p>
                      <p><span className="text-muted-foreground">Assureur:</span> {userData.assuranceAutoAssureur}</p>
                      <p><span className="text-muted-foreground">Expiration:</span> {userData.assuranceAutoDateExpiration}</p>
                    </div>
                  </div>
                )}
                {userData.assuranceCyberNumero && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="font-medium text-foreground mb-2">Assurance Cyber</p>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">N°:</span> {userData.assuranceCyberNumero}</p>
                      <p><span className="text-muted-foreground">Assureur:</span> {userData.assuranceCyberAssureur}</p>
                      <p><span className="text-muted-foreground">Expiration:</span> {userData.assuranceCyberDateExpiration}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { key: "rcPro", label: "RC Professionnelle", num: "rcProNumero", ass: "rcProAssureur", exp: "rcProDateExpiration" },
                  { key: "locaux", label: "Assurance Locaux", num: "assuranceLocauxNumero", ass: "assuranceLocauxAssureur", exp: "assuranceLocauxDateExpiration" },
                  { key: "auto", label: "Assurance Automobile", num: "assuranceAutoNumero", ass: "assuranceAutoAssureur", exp: "assuranceAutoDateExpiration" },
                  { key: "cyber", label: "Assurance Cyber", num: "assuranceCyberNumero", ass: "assuranceCyberAssureur", exp: "assuranceCyberDateExpiration" }
                ].map((ins) => (
                  <div key={ins.key} className="p-4 border rounded-lg bg-secondary/10">
                    <h4 className="font-medium text-sm mb-3">{ins.label}</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Numéro</label>
                        <Input value={editedData[ins.num as keyof UserData] as string} onChange={(e) => handleInputChange(ins.num as keyof UserData, e.target.value)} className="text-sm" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Assureur</label>
                          <Input value={editedData[ins.ass as keyof UserData] as string} onChange={(e) => handleInputChange(ins.ass as keyof UserData, e.target.value)} className="text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Expiration</label>
                          <Input type="date" value={editedData[ins.exp as keyof UserData] as string} onChange={(e) => handleInputChange(ins.exp as keyof UserData, e.target.value)} className="text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* CONFORMITÉ & CERTIFICATIONS */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Conformité & Certifications
            </h3>

            {!isEditingProfile ? (
              <div className="space-y-3">
                {userData.certifications.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Certifications</p>
                    {userData.certifications.map((cert, index) => (
                      <div key={index} className="p-3 bg-secondary/30 rounded mb-2">
                        <p className="font-medium text-sm">{cert.nom}</p>
                        <p className="text-xs text-muted-foreground">N°: {cert.numero}</p>
                        <p className="text-xs text-muted-foreground">Valide jusqu'au {cert.dateExpiration}</p>
                      </div>
                    ))}
                  </div>
                )}
                {userData.agrementParticulier && <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Agrément Particulier</p><p className="text-foreground">{userData.agrementParticulier}</p></div>}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Certifications</p>
                  {editedData.certifications.map((cert, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-secondary/10 mb-3">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-sm">Certification {index + 1}</h4>
                        {editedData.certifications.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCertification(index)}
                            className="text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Nom</label>
                          <Input value={cert.nom} onChange={(e) => {
                            const newCerts = [...editedData.certifications];
                            newCerts[index].nom = e.target.value;
                            handleInputChange("certifications", newCerts);
                          }} className="text-sm" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Numéro</label>
                            <Input value={cert.numero} onChange={(e) => {
                              const newCerts = [...editedData.certifications];
                              newCerts[index].numero = e.target.value;
                              handleInputChange("certifications", newCerts);
                            }} className="text-sm" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Date Obtention</label>
                            <Input type="date" value={cert.dateObtention} onChange={(e) => {
                              const newCerts = [...editedData.certifications];
                              newCerts[index].dateObtention = e.target.value;
                              handleInputChange("certifications", newCerts);
                            }} className="text-sm" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Date Expiration</label>
                          <Input type="date" value={cert.dateExpiration} onChange={(e) => {
                            const newCerts = [...editedData.certifications];
                            newCerts[index].dateExpiration = e.target.value;
                            handleInputChange("certifications", newCerts);
                          }} className="text-sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addCertification} className="w-full text-sm">
                    + Ajouter une certification
                  </Button>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Agrément Particulier</label>
                  <Input value={editedData.agrementParticulier} onChange={(e) => handleInputChange("agrementParticulier", e.target.value)} className="text-sm" placeholder="Ex: Agrément travaux, certification ISO, etc." />
                </div>
              </div>
            )}
          </Card>

          {/* DONNÉES COMMERCIALES */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Données Commerciales
            </h3>

            {!isEditingProfile ? (
              <div className="space-y-2">
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Effectif Total</p><p className="text-foreground">{userData.effectifTotal} employés</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Zone Géographique de Couverture</p><p className="text-foreground">{userData.zoneGeographique}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Codification Secteur</p><p className="text-foreground">{userData.codificationSecteur}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Délai Moyen de Paiement</p><p className="text-foreground">{userData.delaiMoyenPaiement}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Modalités de Facturation</p><p className="text-foreground">{userData.modalitesFacturation}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Conditions de Règlement</p><p className="text-foreground">{userData.conditionsReglement}</p></div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Effectif Total</label>
                  <Input value={editedData.effectifTotal} onChange={(e) => handleInputChange("effectifTotal", e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Zone Géographique de Couverture</label>
                  <Input value={editedData.zoneGeographique} onChange={(e) => handleInputChange("zoneGeographique", e.target.value)} className="text-sm" placeholder="Ex: Île-de-France, Rhône-Alpes, etc." />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Codification Secteur</label>
                  <Input value={editedData.codificationSecteur} onChange={(e) => handleInputChange("codificationSecteur", e.target.value)} className="text-sm" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Délai Moyen de Paiement</label>
                    <Input value={editedData.delaiMoyenPaiement} onChange={(e) => handleInputChange("delaiMoyenPaiement", e.target.value)} className="text-sm" placeholder="Ex: 30 jours" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Modalités de Facturation</label>
                    <Input value={editedData.modalitesFacturation} onChange={(e) => handleInputChange("modalitesFacturation", e.target.value)} className="text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Conditions de Règlement</label>
                  <Input value={editedData.conditionsReglement} onChange={(e) => handleInputChange("conditionsReglement", e.target.value)} className="text-sm" placeholder="Ex: Virement, carte bancaire, etc." />
                </div>
              </div>
            )}
          </Card>

          {/* PROPRIÉTÉ INTELLECTUELLE */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Propriété Intellectuelle
            </h3>

            {!isEditingProfile ? (
              <div className="space-y-2">
                {userData.marquesDeposees && <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Marques Déposées</p><p className="text-foreground">{userData.marquesDeposees}</p></div>}
                {userData.brevets && <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Brevets</p><p className="text-foreground">{userData.brevets}</p></div>}
                {userData.droitsAuteur && <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Droits d'Auteur</p><p className="text-foreground">{userData.droitsAuteur}</p></div>}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Marques Déposées</label>
                  <Input value={editedData.marquesDeposees} onChange={(e) => handleInputChange("marquesDeposees", e.target.value)} className="text-sm" placeholder="Ex: Marque® (INPI - 2020)" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Brevets</label>
                  <Input value={editedData.brevets} onChange={(e) => handleInputChange("brevets", e.target.value)} className="text-sm" placeholder="Numéros de brevets, if any" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Droits d'Auteur</label>
                  <Input value={editedData.droitsAuteur} onChange={(e) => handleInputChange("droitsAuteur", e.target.value)} className="text-sm" />
                </div>
              </div>
            )}
          </Card>

          {/* CONFORMITÉ ENVIRONNEMENTALE & LÉGALE */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Conformité Environnementale & Légale
            </h3>

            {!isEditingProfile ? (
              <div className="space-y-2">
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Numéro ICPE</p><p className="text-foreground">{userData.numeroICPE || "Non applicable"}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Classification Environnementale</p><p className="text-foreground">{userData.classificationEnvironnementale}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Conformité RGPD</p><p className="text-foreground">{userData.conformiteRGPD}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Registre de Traitement des Données</p><p className="text-foreground">{userData.registreTraitementDonnees}</p></div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Numéro ICPE</label>
                  <Input value={editedData.numeroICPE} onChange={(e) => handleInputChange("numeroICPE", e.target.value)} className="text-sm" placeholder="Si établissement classé" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Classification Environnementale</label>
                  <Input value={editedData.classificationEnvironnementale} onChange={(e) => handleInputChange("classificationEnvironnementale", e.target.value)} className="text-sm" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Conformité RGPD</label>
                    <select value={editedData.conformiteRGPD} onChange={(e) => handleInputChange("conformiteRGPD", e.target.value)} className="w-full px-3 py-2 border rounded text-sm text-foreground bg-background">
                      <option value="Oui">Oui</option>
                      <option value="Non">Non</option>
                      <option value="En cours">En cours</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Registre de Traitement des Données</label>
                    <Input value={editedData.registreTraitementDonnees} onChange={(e) => handleInputChange("registreTraitementDonnees", e.target.value)} className="text-sm" placeholder="Date de dernière mise à jour" />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Boutons d'action */}
          {isEditingProfile && (
            <div className="flex gap-3 sticky bottom-4">
              <Button onClick={handleSaveProfile} className="gap-2 flex-1 sm:flex-none">
                <Save className="w-4 h-4" />
                Enregistrer
              </Button>
              <Button onClick={handleCancelEdit} variant="outline" className="gap-2 flex-1 sm:flex-none">
                <X className="w-4 h-4" />
                Annuler
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
