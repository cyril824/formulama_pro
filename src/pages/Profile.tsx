import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Save, X, ChevronDown, Building2, Users, FileText, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useDocumentContext } from "@/context/DocumentContext";

// Interface pour les données entreprise
interface Etablissement {
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  telephone: string;
  email: string;
  type: string;
}

interface RepresentantLegal {
  civilite: string;
  nom: string;
  prenom: string;
  fonction: string;
  email: string;
  telephone: string;
  typeDocument: string;
  numeroDocument: string;
  dateExpiration: string;
}

interface UserData {
  // Informations Entreprise
  raisonSociale: string;
  siret: string;
  siren: string;
  numeroTVA: string;
  secteurActivite: string;
  formeJuridique: string;
  dateCreation: string;
  capitalSocial: string;
  
  // Sièges & Établissements
  etablissements: Etablissement[];
  
  // Contact Entreprise
  emailGeneral: string;
  telephoneGeneral: string;
  telephoneSecondaire: string;
  siteWeb: string;
  
  // Représentant Légal
  representantLegal: RepresentantLegal;
  
  // Données Bancaires Entreprise
  iban: string;
  bic: string;
  nomBanque: string;
  titulaireDuCompte: string;
  
  // Informations Fiscales
  numeroFiscal: string;
  regimeFiscal: string;
  chiffreAffairesAnnuel: string;
  tauxTVA: string;
  beneficeOuPerte: string;
  
  // Assurances Professionnelles
  rcProNumero: string;
  rcProAssureur: string;
  rcProDateExpiration: string;
  assuranceLocauxNumero: string;
  assuranceLocauxAssureur: string;
  assuranceLocauxDateExpiration: string;
  autresAssurances: string;
  
  // Documents Importants
  attestationImmatriculation: string;
  certificationNonRadiation: string;
  datesStatuts: string;
  
  // Contacts Supplémentaires
  referentComptable: string;
  emailComptable: string;
  telephoneComptable: string;
  avocat: string;
  emailAvocat: string;
  telephoneAvocat: string;
  contactUrgence: string;
  telephoneUrgence: string;
}

// Composant Section repliable pour mobile
interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection = ({ title, icon, children, defaultOpen = true }: SectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary">{icon}</div>}
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 py-4 border-t border-border bg-card">
          {children}
        </div>
      )}
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { documentChanged } = useDocumentContext();

  // État des données entreprise avec valeurs par défaut
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    // Infos Entreprise
    raisonSociale: "TechSolutions SARL",
    siret: "12345678901234",
    siren: "123456789",
    numeroTVA: "FR12345678901",
    secteurActivite: "Services Informatiques",
    formeJuridique: "SARL",
    dateCreation: "2015-06-20",
    capitalSocial: "50000",
    
    // Établissements
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
        nom: "Établissement Secondaire - Lyon",
        adresse: "456 Rue de la Paix",
        codePostal: "69000",
        ville: "Lyon",
        telephone: "+33 4 78 90 12 34",
        email: "lyon@techsolutions.fr",
        type: "Établissement secondaire"
      }
    ],
    
    // Contact Entreprise
    emailGeneral: "contact@techsolutions.fr",
    telephoneGeneral: "+33 1 23 45 67 89",
    telephoneSecondaire: "+33 1 98 76 54 32",
    siteWeb: "www.techsolutions.fr",
    
    // Représentant Légal
    representantLegal: {
      civilite: "M",
      nom: "Dupont",
      prenom: "Jean",
      fonction: "Gérant",
      email: "jean.dupont@techsolutions.fr",
      telephone: "+33 6 12 34 56 78",
      typeDocument: "Passeport",
      numeroDocument: "AB123456",
      dateExpiration: "2030-06-30"
    },
    
    // Données Bancaires
    iban: "FR1420041010050500013M02606",
    bic: "BNAGFRPP",
    nomBanque: "BNP Paribas",
    titulaireDuCompte: "TechSolutions SARL",
    
    // Fiscalité
    numeroFiscal: "12 345 678 901",
    regimeFiscal: "Réel",
    chiffreAffairesAnnuel: "250000",
    tauxTVA: "20",
    beneficeOuPerte: "45000",
    
    // Assurances Professionnelles
    rcProNumero: "RC2024001234",
    rcProAssureur: "AXA Assurances",
    rcProDateExpiration: "2025-12-31",
    assuranceLocauxNumero: "LOC2024005678",
    assuranceLocauxAssureur: "Allianz",
    assuranceLocauxDateExpiration: "2025-12-31",
    autresAssurances: "Assurance Cyber - XXL Assurances",
    
    // Documents
    attestationImmatriculation: "Disponible",
    certificationNonRadiation: "Disponible",
    datesStatuts: "20/06/2015",
    
    // Contacts Supplémentaires
    referentComptable: "Marie Bernard",
    emailComptable: "marie.bernard@expert-comptable.fr",
    telephoneComptable: "+33 6 98 76 54 32",
    avocat: "Maître Durand",
    emailAvocat: "contact@durand-avocat.fr",
    telephoneAvocat: "+33 1 56 78 90 12",
    contactUrgence: "Pierre Leclerc",
    telephoneUrgence: "+33 6 11 22 33 44"
  });

  const [editedData, setEditedData] = useState<UserData>(userData);
  
  // État pour détection mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Charger les données de sessionStorage au montage
  useEffect(() => {
    const savedData = sessionStorage.getItem("userProfileData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setUserData(parsedData);
      setEditedData(parsedData);
    }

    // Écouter les changements de taille d'écran
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gestion de l'édition du profil
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

  const handleRepresentantChange = (field: keyof RepresentantLegal, value: string) => {
    setEditedData({
      ...editedData,
      representantLegal: {
        ...editedData.representantLegal,
        [field]: value
      }
    });
  };

  const handleEtablissementChange = (index: number, field: keyof Etablissement, value: string) => {
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

      <main className="w-full px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-5xl mx-auto">
        {/* En-tête Principal Entreprise */}
        <Card className="p-4 sm:p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{userData.raisonSociale}</h2>
              <p className="text-sm text-muted-foreground mt-2">{userData.formeJuridique} • {userData.secteurActivite}</p>
              {userData.siteWeb && (
                <a href={`https://${userData.siteWeb}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-2">
                  🔗 {userData.siteWeb}
                </a>
              )}
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
                  <select value={editedData.formeJuridique} onChange={(e) => handleInputChange("formeJuridique", e.target.value)} className="w-full px-3 py-2 border rounded text-sm text-foreground bg-background dark:bg-background dark:text-foreground">
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
                  <Input value={editedData.siret} onChange={(e) => handleInputChange("siret", e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">SIREN</label>
                  <Input value={editedData.siren} onChange={(e) => handleInputChange("siren", e.target.value)} className="text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Numéro de TVA</label>
                  <Input value={editedData.numeroTVA} onChange={(e) => handleInputChange("numeroTVA", e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Secteur d'Activité</label>
                  <Input value={editedData.secteurActivite} onChange={(e) => handleInputChange("secteurActivite", e.target.value)} className="text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Date de Création</label>
                  <Input type="date" value={editedData.dateCreation} onChange={(e) => handleInputChange("dateCreation", e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Capital Social (€)</label>
                  <Input type="number" value={editedData.capitalSocial} onChange={(e) => handleInputChange("capitalSocial", e.target.value)} className="text-sm" />
                </div>
              </div>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          {/* Sièges & Établissements */}
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

          {/* Contact Entreprise */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Contact Entreprise
            </h3>

            {!isEditingProfile ? (
              <div className="space-y-2">
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Email Général</p><p className="text-foreground">{userData.emailGeneral}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Téléphone</p><p className="text-foreground">{userData.telephoneGeneral}</p></div>
                {userData.telephoneSecondaire && <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Téléphone Secondaire</p><p className="text-foreground">{userData.telephoneSecondaire}</p></div>}
                {userData.siteWeb && <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Site Web</p><p className="text-foreground">{userData.siteWeb}</p></div>}
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
              </div>
            )}
          </Card>

          {/* Représentant Légal */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Représentant Légal
            </h3>

            {!isEditingProfile ? (
              <div className="space-y-3 p-4 bg-secondary/20 rounded-lg border border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nom</p>
                    <p className="font-medium text-foreground">{userData.representantLegal.civilite} {userData.representantLegal.prenom} {userData.representantLegal.nom}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Fonction</p>
                    <p className="font-medium text-foreground">{userData.representantLegal.fonction}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-foreground text-sm">{userData.representantLegal.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Téléphone</p>
                    <p className="text-foreground text-sm">{userData.representantLegal.telephone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Document d'Identité</p>
                  <p className="text-foreground text-sm">{userData.representantLegal.typeDocument} - {userData.representantLegal.numeroDocument} (Expiration: {userData.representantLegal.dateExpiration})</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Civilité</label>
                    <select value={editedData.representantLegal.civilite} onChange={(e) => handleRepresentantChange("civilite", e.target.value)} className="w-full px-3 py-2 border rounded text-sm text-foreground bg-background">
                      <option value="M">M.</option>
                      <option value="Mme">Mme</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Prénom</label>
                    <Input value={editedData.representantLegal.prenom} onChange={(e) => handleRepresentantChange("prenom", e.target.value)} className="text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Nom</label>
                    <Input value={editedData.representantLegal.nom} onChange={(e) => handleRepresentantChange("nom", e.target.value)} className="text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Fonction</label>
                    <Input value={editedData.representantLegal.fonction} onChange={(e) => handleRepresentantChange("fonction", e.target.value)} className="text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
                    <Input type="email" value={editedData.representantLegal.email} onChange={(e) => handleRepresentantChange("email", e.target.value)} className="text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Téléphone</label>
                    <Input value={editedData.representantLegal.telephone} onChange={(e) => handleRepresentantChange("telephone", e.target.value)} className="text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Type de Document d'Identité</label>
                  <select value={editedData.representantLegal.typeDocument} onChange={(e) => handleRepresentantChange("typeDocument", e.target.value)} className="w-full px-3 py-2 border rounded text-sm text-foreground bg-background">
                    <option value="Passeport">Passeport</option>
                    <option value="Carte d'Identité">Carte d'Identité</option>
                    <option value="Titre de Séjour">Titre de Séjour</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Numéro</label>
                    <Input value={editedData.representantLegal.numeroDocument} onChange={(e) => handleRepresentantChange("numeroDocument", e.target.value)} className="text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Date d'Expiration</label>
                    <Input type="date" value={editedData.representantLegal.dateExpiration} onChange={(e) => handleRepresentantChange("dateExpiration", e.target.value)} className="text-sm" />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Informations Bancaires */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Informations Bancaires</h3>

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

          {/* Informations Fiscales */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Informations Fiscales
            </h3>

            {!isEditingProfile ? (
              <div className="space-y-2">
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Numéro Fiscal</p><p className="text-foreground">{userData.numeroFiscal}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Régime Fiscal</p><p className="text-foreground">{userData.regimeFiscal}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Chiffre d'Affaires Annuel</p><p className="text-foreground">{userData.chiffreAffairesAnnuel}€</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Taux de TVA</p><p className="text-foreground">{userData.tauxTVA}%</p></div>
                {userData.beneficeOuPerte && <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Bénéfice/Perte</p><p className="text-foreground">{userData.beneficeOuPerte}€</p></div>}
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
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Taux de TVA (%)</label>
                    <Input type="number" value={editedData.tauxTVA} onChange={(e) => handleInputChange("tauxTVA", e.target.value)} className="text-sm" step="0.1" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Bénéfice/Perte (€)</label>
                  <Input type="number" value={editedData.beneficeOuPerte} onChange={(e) => handleInputChange("beneficeOuPerte", e.target.value)} className="text-sm" />
                </div>
              </div>
            )}
          </Card>

          {/* Assurances Professionnelles */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Assurances Professionnelles</h3>

            {!isEditingProfile ? (
              <div className="space-y-3">
                <div className="p-4 bg-secondary/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-medium text-foreground mb-2">Responsabilité Civile Professionnelle</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Numéro:</span> {userData.rcProNumero}</p>
                    <p><span className="text-muted-foreground">Assureur:</span> {userData.rcProAssureur}</p>
                    <p><span className="text-muted-foreground">Expiration:</span> {userData.rcProDateExpiration}</p>
                  </div>
                </div>
                <div className="p-4 bg-secondary/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-medium text-foreground mb-2">Assurance Locaux</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Numéro:</span> {userData.assuranceLocauxNumero}</p>
                    <p><span className="text-muted-foreground">Assureur:</span> {userData.assuranceLocauxAssureur}</p>
                    <p><span className="text-muted-foreground">Expiration:</span> {userData.assuranceLocauxDateExpiration}</p>
                  </div>
                </div>
                {userData.autresAssurances && (
                  <div className="p-4 bg-secondary/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="font-medium text-foreground mb-2">Autres Assurances</p>
                    <p className="text-sm text-foreground">{userData.autresAssurances}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-secondary/10">
                  <h4 className="font-medium text-sm mb-3">RC Professionnelle</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Numéro</label>
                      <Input value={editedData.rcProNumero} onChange={(e) => handleInputChange("rcProNumero", e.target.value)} className="text-sm" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Assureur</label>
                        <Input value={editedData.rcProAssureur} onChange={(e) => handleInputChange("rcProAssureur", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Date d'Expiration</label>
                        <Input type="date" value={editedData.rcProDateExpiration} onChange={(e) => handleInputChange("rcProDateExpiration", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-secondary/10">
                  <h4 className="font-medium text-sm mb-3">Assurance Locaux</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Numéro</label>
                      <Input value={editedData.assuranceLocauxNumero} onChange={(e) => handleInputChange("assuranceLocauxNumero", e.target.value)} className="text-sm" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Assureur</label>
                        <Input value={editedData.assuranceLocauxAssureur} onChange={(e) => handleInputChange("assuranceLocauxAssureur", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Date d'Expiration</label>
                        <Input type="date" value={editedData.assuranceLocauxDateExpiration} onChange={(e) => handleInputChange("assuranceLocauxDateExpiration", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Autres Assurances</label>
                  <Input value={editedData.autresAssurances} onChange={(e) => handleInputChange("autresAssurances", e.target.value)} className="text-sm" placeholder="Ex: Assurance Cyber, etc." />
                </div>
              </div>
            )}
          </Card>

          {/* Documents Importants */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Documents Importants
            </h3>

            {!isEditingProfile ? (
              <div className="space-y-2">
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Attestation d'Immatriculation</p><p className="text-foreground">{userData.attestationImmatriculation}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Certification de Non-Radiation</p><p className="text-foreground">{userData.certificationNonRadiation}</p></div>
                <div className="p-3 bg-secondary/30 rounded"><p className="text-xs text-muted-foreground mb-1">Dates Statuts</p><p className="text-foreground">{userData.datesStatuts}</p></div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Attestation d'Immatriculation</label>
                  <Input value={editedData.attestationImmatriculation} onChange={(e) => handleInputChange("attestationImmatriculation", e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Certification de Non-Radiation</label>
                  <Input value={editedData.certificationNonRadiation} onChange={(e) => handleInputChange("certificationNonRadiation", e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Dates Statuts</label>
                  <Input value={editedData.datesStatuts} onChange={(e) => handleInputChange("datesStatuts", e.target.value)} className="text-sm" />
                </div>
              </div>
            )}
          </Card>

          {/* Contacts Supplémentaires */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Contacts Supplémentaires
            </h3>

            {!isEditingProfile ? (
              <div className="space-y-3">
                {userData.referentComptable && (
                  <div className="p-4 bg-secondary/20 rounded-lg border border-border">
                    <p className="font-medium text-foreground mb-2">Expert-Comptable</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-foreground">{userData.referentComptable}</p>
                      <p className="text-muted-foreground">📧 {userData.emailComptable}</p>
                      <p className="text-muted-foreground">📞 {userData.telephoneComptable}</p>
                    </div>
                  </div>
                )}
                {userData.avocat && (
                  <div className="p-4 bg-secondary/20 rounded-lg border border-border">
                    <p className="font-medium text-foreground mb-2">Avocat Conseil</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-foreground">{userData.avocat}</p>
                      <p className="text-muted-foreground">📧 {userData.emailAvocat}</p>
                      <p className="text-muted-foreground">📞 {userData.telephoneAvocat}</p>
                    </div>
                  </div>
                )}
                {userData.contactUrgence && (
                  <div className="p-4 bg-secondary/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="font-medium text-foreground mb-2">Contact d'Urgence</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-foreground">{userData.contactUrgence}</p>
                      <p className="text-muted-foreground">📞 {userData.telephoneUrgence}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-secondary/10">
                  <h4 className="font-medium text-sm mb-3">Expert-Comptable</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Nom</label>
                      <Input value={editedData.referentComptable} onChange={(e) => handleInputChange("referentComptable", e.target.value)} className="text-sm" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
                        <Input type="email" value={editedData.emailComptable} onChange={(e) => handleInputChange("emailComptable", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Téléphone</label>
                        <Input value={editedData.telephoneComptable} onChange={(e) => handleInputChange("telephoneComptable", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-secondary/10">
                  <h4 className="font-medium text-sm mb-3">Avocat Conseil</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Nom</label>
                      <Input value={editedData.avocat} onChange={(e) => handleInputChange("avocat", e.target.value)} className="text-sm" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
                        <Input type="email" value={editedData.emailAvocat} onChange={(e) => handleInputChange("emailAvocat", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Téléphone</label>
                        <Input value={editedData.telephoneAvocat} onChange={(e) => handleInputChange("telephoneAvocat", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-secondary/10">
                  <h4 className="font-medium text-sm mb-3">Contact d'Urgence</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Nom</label>
                      <Input value={editedData.contactUrgence} onChange={(e) => handleInputChange("contactUrgence", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Téléphone</label>
                      <Input value={editedData.telephoneUrgence} onChange={(e) => handleInputChange("telephoneUrgence", e.target.value)} className="text-sm" />
                    </div>
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
