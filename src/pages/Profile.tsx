import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Save, X, ChevronDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useDocumentContext } from "@/context/DocumentContext";

// Interface pour les donnÃ©es utilisateur
interface UserData {
  // Informations civiles
  civilite: string;
  nom: string;
  nomUsage: string;
  nomNaissance: string;
  prenom: string;
  dateNaissance: string;
  communeNaissance: string;
  codePostalNaissance: string;
  paysNaissance: string;
  nationalite: string;
  situation: string;
  nombreEnfants: string;
  
  // PiÃ¨ce d'identitÃ©
  typeDocument: string;
  numeroDocument: string;
  dateExpiration: string;
  numeroSecuriteSociale: string;
  
  // CoordonnÃ©es
  email: string;
  telephone: string;
  telephoneSecondaire: string;
  
  // Adresse
  numeroAdresse: string;
  typeVoieAdresse: string;
  nomVoieAdresse: string;
  codePostal: string;
  commune: string;
  pays: string;
  
  // Adresse secondaire (domicile ou travail)
  numeroAdresseSecondaire: string;
  typeVoieAdresseSecondaire: string;
  nomVoieAdresseSecondaire: string;
  codePostalSecondaire: string;
  communeSecondaire: string;
  
  // Permis de conduire
  typePermis: string;
  numeroPermis: string;
  dateValiditePermis: string;
  
  // VÃ©hicules (tableau pour plusieurs vÃ©hicules)
  vehicules: Array<{
    marque: string;
    modele: string;
    immatriculation: string;
    chevaux: string;
    annee: string;
    carburant: string;
  }>;
  
  // Professionnels
  profession: string;
  entreprise: string;
  numeroSiret: string;
  poste: string;
  dateEmbauche: string;
  salaire: string;
  typeContrat: string;
  
  // CoordonnÃ©es professionnelles
  adresseProfessionnelle: string;
  telephoneProfessionnel: string;
  emailProfessionnel: string;
  
  // Informations bancaires
  iban: string;
  bic: string;
  nomBanque: string;
  
  // FiscalitÃ© (pour les entreprises)
  numeroFiscal: string;
  numeroTVA: string;
  revenuAnnuel: string;
  
  // Revenus fiscaux du foyer
  revenuFiscalFoyer: string;
  quotientFamilial: string;
  
  // SantÃ©
  numeroMutuelle: string;
  mutuelle: string;
  groupeSanguin: string;
  allergies: string;
  
  // Assurances
  numeroAssuranceVehicule: string;
  assuranceVehicule: string;
  numeroAssuranceHabitation: string;
  assuranceHabitation: string;
  numeroAssuranceResponsabilite: string;
  
  // RQTH
  rqthStatut: string; // "oui" ou "non"
  rqthNumero: string;
  rqthDateRenouvellement: string;
  rqthOrganisme: string;
  
  // Ã‰ducation
  diplomeNiveau: string;
  diplomeSpecialite: string;
  etablissementEtudes: string;
  dateObtention: string;
  
  // Contact d'urgence
  nomUrgence: string;
  telephoneUrgence: string;
  relationUrgence: string;
}

// Types pour la visibilitÃ© des blocs
type BlockKey = 'civiles' | 'identite' | 'coordonnees' | 'adresse' | 'adresseSecondaire' | 'permis' | 'vehicules' | 'professionnels' | 'coordProf' | 'bancaires' | 'fiscalite' | 'revenus' | 'sante' | 'assurances' | 'rqth' | 'education' | 'urgence';

interface BlockVisibility {
  [key: string]: boolean;
}

// Composant Section repliable pour mobile
interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isEditing?: boolean;
  blockKey?: BlockKey;
  onRemove?: (blockKey: BlockKey) => void;
}

const CollapsibleSection = ({ title, children, defaultOpen = true, isEditing = false, blockKey, onRemove }: SectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors"
      >
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          {isEditing && onRemove && blockKey && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(blockKey);
              }}
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
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

  // Ã‰tat des donnÃ©es utilisateur avec valeurs par dÃ©faut
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    // Civiles
    civilite: "M",
    nom: "Dupont",
    nomUsage: "Dupont",
    nomNaissance: "Dupont",
    prenom: "Jean",
    dateNaissance: "1990-01-15",
    communeNaissance: "Paris",
    codePostalNaissance: "75000",
    paysNaissance: "France",
    nationalite: "FranÃ§aise",
    situation: "MariÃ©(e)",
    nombreEnfants: "2",
    
    // IdentitÃ©
    typeDocument: "Passeport",
    numeroDocument: "AB123456",
    dateExpiration: "2030-06-30",
    numeroSecuriteSociale: "1 90 01 75 123 456 78",
    
    // CoordonnÃ©es
    email: "jean.dupont@example.com",
    telephone: "+33 6 12 34 56 78",
    telephoneSecondaire: "",
    
    // Adresse
    numeroAdresse: "123",
    typeVoieAdresse: "Rue",
    nomVoieAdresse: "de la Paix",
    codePostal: "75000",
    commune: "Paris",
    pays: "France",
    
    // Adresse secondaire
    numeroAdresseSecondaire: "",
    typeVoieAdresseSecondaire: "",
    nomVoieAdresseSecondaire: "",
    codePostalSecondaire: "",
    communeSecondaire: "",
    
    // Permis
    typePermis: "B",
    numeroPermis: "123456789012",
    dateValiditePermis: "2030-01-15",
    
    // VÃ©hicules
    vehicules: [
      {
        marque: "Peugeot",
        modele: "308",
        immatriculation: "AB-123-CD",
        chevaux: "110",
        annee: "2020",
        carburant: "Essence"
      }
    ],
    
    // Professionnels
    profession: "IngÃ©nieur",
    entreprise: "TechCorp",
    numeroSiret: "12345678901234",
    poste: "IngÃ©nieur Senior",
    dateEmbauche: "2015-03-20",
    salaire: "50000",
    typeContrat: "CDI",
    
    // CoordonnÃ©es pro
    adresseProfessionnelle: "456 Avenue de la Tech, 75008 Paris",
    telephoneProfessionnel: "+33 1 23 45 67 89",
    emailProfessionnel: "jean.dupont@techcorp.com",
    
    // Bancaires
    iban: "FR1420041010050500013M02606",
    bic: "BNAGFRPP",
    nomBanque: "BNP Paribas",
    
    // FiscalitÃ©
    numeroFiscal: "1 90 01 75 123 456",
    numeroTVA: "FR12345678901",
    revenuAnnuel: "50000",
    
    // Revenus fiscaux du foyer
    revenuFiscalFoyer: "75000",
    quotientFamilial: "2.5",
    
    // SantÃ©
    numeroMutuelle: "12345678",
    mutuelle: "Axa Assurances",
    groupeSanguin: "O+",
    allergies: "Aucune",
    
    // Assurances
    numeroAssuranceVehicule: "VE123456789",
    assuranceVehicule: "MAAF",
    numeroAssuranceHabitation: "HA123456789",
    assuranceHabitation: "Allianz",
    numeroAssuranceResponsabilite: "RC123456789",
    
    // RQTH
    rqthStatut: "non",
    rqthNumero: "",
    rqthDateRenouvellement: "",
    rqthOrganisme: "",
    
    // Ã‰ducation
    diplomeNiveau: "Master",
    diplomeSpecialite: "Informatique",
    etablissementEtudes: "UniversitÃ© Paris-Saclay",
    dateObtention: "2012",
    
    // Contact urgence
    nomUrgence: "Marie Dupont",
    telephoneUrgence: "+33 6 98 76 54 32",
    relationUrgence: "Ã‰pouse",
    
  });

  const [editedData, setEditedData] = useState<UserData>(userData);
  
  // Ã‰tat pour la visibilitÃ© des blocs
  const [visibleBlocks, setVisibleBlocks] = useState<BlockVisibility>({
    civiles: true,
    identite: true,
    coordonnees: true,
    adresse: true,
    numeroAdresseSecondaire: true,
    permis: true,
    vehicules: true,
    professionnels: true,
    coordProf: true,
    bancaires: true,
    fiscalite: true,
    revenus: true,
    sante: true,
    assurances: true,
    rqth: true,
    education: true,
    urgence: true,
  });

  // Ã‰tat pour dÃ©tection mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // API URL
  const API_BASE_URL = '';

  // Charger les donnÃ©es de sessionStorage au montage
  useEffect(() => {
    const savedData = sessionStorage.getItem("userProfileData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setUserData(parsedData);
      setEditedData(parsedData);
    }

    // Ã‰couter les changements de taille d'Ã©cran
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gestion de l'Ã©dition du profil
  const handleEditProfile = () => {
    setEditedData(userData);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setUserData(editedData);
    // Sauvegarder dans sessionStorage
    sessionStorage.setItem("userProfileData", JSON.stringify(editedData));
    setIsEditingProfile(false);
    
    // Afficher un message de confirmation
    toast({
      title: "Enregistrement rÃ©ussi",
      description: "Vos modifications ont Ã©tÃ© sauvegardÃ©es avec succÃ¨s.",
      className: "bg-green-500 text-white border-0 fixed top-4 left-1/2 -translate-x-1/2 rounded-lg shadow-lg max-w-xs px-4 py-2 text-sm animate-fade-in-out",
      duration: 3000,
    });
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setEditedData({
      ...editedData,
      [field]: value,
    });
  };

  // Fonction pour basculer la visibilitÃ© d'un bloc
  const toggleBlock = (blockKey: BlockKey) => {
    setVisibleBlocks({
      ...visibleBlocks,
      [blockKey]: !visibleBlocks[blockKey]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent">
      {/* Header avec bouton retour */}
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
          <h1 className="text-lg sm:text-xl font-bold text-foreground">Mon Profil</h1>
        </div>
      </header>

      <main className="w-full px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Section Informations Personnelles */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                Informations Personnelles
              </h2>
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

            {isEditingProfile ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Section Informations Civiles */}
                {visibleBlocks.civiles && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex-1">Informations Civiles</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleBlock('civiles')}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">CivilitÃ©</label>
                        <select value={editedData.civilite} onChange={(e) => handleInputChange("civilite", e.target.value)} className="w-full px-3 py-2 border rounded text-sm text-foreground bg-background dark:bg-background dark:text-foreground">
                          <option value="M">M.</option>
                          <option value="Mme">Mme</option>
                          <option value="Mlle">Mlle</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">PrÃ©nom</label>
                        <Input value={editedData.prenom} onChange={(e) => handleInputChange("prenom", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Nom</label>
                        <Input value={editedData.nom} onChange={(e) => handleInputChange("nom", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Nom d'usage</label>
                        <Input value={editedData.nomUsage} onChange={(e) => handleInputChange("nomUsage", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Nom de naissance</label>
                        <Input value={editedData.nomNaissance} onChange={(e) => handleInputChange("nomNaissance", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Date de naissance</label>
                        <Input type="date" value={editedData.dateNaissance} onChange={(e) => handleInputChange("dateNaissance", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Ville et Code postal de naissance</label>
                        <select 
                          value={editedData.communeNaissance && editedData.codePostalNaissance ? `${editedData.communeNaissance}|${editedData.codePostalNaissance}` : ""} 
                          onChange={(e) => {
                            const selected = e.target.value;
                            if (selected) {
                              const [cityName, postalCode] = selected.split('|');
                              setEditedData({
                                ...editedData,
                                communeNaissance: cityName,
                                codePostalNaissance: postalCode
                              });
                            } else {
                              setEditedData({
                                ...editedData,
                                communeNaissance: "",
                                codePostalNaissance: ""
                              });
                            }
                          }} 
                          className="w-full px-3 py-2 border rounded text-sm text-foreground bg-background dark:bg-background dark:text-foreground"
                        >
                          <option value="">SÃ©lectionner une ville...</option>
                          <option value="Paris|75000">Paris (75000)</option>
                          <option value="Marseille|13000">Marseille (13000)</option>
                          <option value="Lyon|69000">Lyon (69000)</option>
                          <option value="Toulouse|31000">Toulouse (31000)</option>
                          <option value="Nice|06000">Nice (06000)</option>
                          <option value="Nantes|44000">Nantes (44000)</option>
                          <option value="Strasbourg|67000">Strasbourg (67000)</option>
                          <option value="Montpellier|34000">Montpellier (34000)</option>
                          <option value="Bordeaux|33000">Bordeaux (33000)</option>
                          <option value="Lille|59000">Lille (59000)</option>
                          <option value="Rennes|35000">Rennes (35000)</option>
                          <option value="Reims|51100">Reims (51100)</option>
                          <option value="Le Havre|76600">Le Havre (76600)</option>
                          <option value="Saint-Ã‰tienne|42000">Saint-Ã‰tienne (42000)</option>
                          <option value="Toulon|83000">Toulon (83000)</option>
                          <option value="Grenoble|38000">Grenoble (38000)</option>
                          <option value="Angers|49000">Angers (49000)</option>
                          <option value="Dijon|21000">Dijon (21000)</option>
                          <option value="NÃ®mes|30000">NÃ®mes (30000)</option>
                          <option value="Aix-en-Provence|13100">Aix-en-Provence (13100)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Ou saisir manuellement</label>
                        <Input value={editedData.communeNaissance} onChange={(e) => handleInputChange("communeNaissance", e.target.value)} className="text-sm" placeholder="Lieu de naissance" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">NationalitÃ©</label>
                        <Input value={editedData.nationalite} onChange={(e) => handleInputChange("nationalite", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Situation familiale</label>
                        <select value={editedData.situation} onChange={(e) => handleInputChange("situation", e.target.value)} className="w-full px-3 py-2 border rounded text-sm text-foreground bg-background dark:bg-background dark:text-foreground">
                          <option value="CÃ©libataire">CÃ©libataire</option>
                          <option value="MariÃ©(e)">MariÃ©(e)</option>
                          <option value="PacsÃ©(e)">PacsÃ©(e)</option>
                          <option value="DivorcÃ©(e)">DivorcÃ©(e)</option>
                          <option value="Veuf(ve)">Veuf(ve)</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Nombre d'enfants</label>
                        <Input type="number" value={editedData.nombreEnfants} onChange={(e) => handleInputChange("nombreEnfants", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Document d'IdentitÃ© */}
                {visibleBlocks.identite && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex-1">PiÃ¨ce d'IdentitÃ©</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleBlock('identite')}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Type de document</label>
                        <select value={editedData.typeDocument} onChange={(e) => handleInputChange("typeDocument", e.target.value)} className="w-full px-3 py-2 border rounded text-sm text-foreground bg-background dark:bg-background dark:text-foreground">
                          <option value="Passeport">Passeport</option>
                          <option value="Carte nationale">Carte nationale</option>
                          <option value="Permis de conduire">Permis de conduire</option>
                          <option value="Titre de sÃ©jour">Titre de sÃ©jour</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">NumÃ©ro</label>
                        <p className="text-xs text-foreground mb-2 italic">NumÃ©ro attribuÃ© au document sÃ©lectionnÃ©</p>
                        <Input value={editedData.numeroDocument} onChange={(e) => handleInputChange("numeroDocument", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Date d'expiration</label>
                        <Input type="date" value={editedData.dateExpiration} onChange={(e) => handleInputChange("dateExpiration", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">NumÃ©ro de SÃ©curitÃ© Sociale</label>
                        <Input value={editedData.numeroSecuriteSociale} onChange={(e) => handleInputChange("numeroSecuriteSociale", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Section CoordonnÃ©es */}
                {visibleBlocks.coordonnees && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex-1">CoordonnÃ©es</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleBlock('coordonnees')}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Email</label>
                        <Input type="email" value={editedData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">TÃ©lÃ©phone</label>
                        <Input value={editedData.telephone} onChange={(e) => handleInputChange("telephone", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">TÃ©lÃ©phone secondaire</label>
                      <Input value={editedData.telephoneSecondaire} onChange={(e) => handleInputChange("telephoneSecondaire", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                )}

                {/* Section Adresse */}
                {visibleBlocks.adresse && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex-1">Adresse</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleBlock('adresse')}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Numéro</label>
                          <Input value={editedData.numeroAdresse} onChange={(e) => handleInputChange("numeroAdresse", e.target.value)} className="text-sm" />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Type de voie</label>
                          <Input value={editedData.typeVoieAdresse} onChange={(e) => handleInputChange("typeVoieAdresse", e.target.value)} className="text-sm" placeholder="Rue, Avenue, Boulevard..." />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Nom de la voie</label>
                          <Input value={editedData.nomVoieAdresse} onChange={(e) => handleInputChange("nomVoieAdresse", e.target.value)} className="text-sm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Code Postal</label>
                          <Input value={editedData.codePostal} onChange={(e) => handleInputChange("codePostal", e.target.value)} className="text-sm" />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Commune</label>
                          <Input value={editedData.commune} onChange={(e) => handleInputChange("commune", e.target.value)} className="text-sm" />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Pays</label>
                          <Input value={editedData.pays} onChange={(e) => handleInputChange("pays", e.target.value)} className="text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Adresse Secondaire */}
                {visibleBlocks.adresseSecondaire && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex-1">Adresse Secondaire</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleBlock('adresseSecondaire')}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Adresse</label>
                        <Input value={editedData.numeroAdresseSecondaire} onChange={(e) => handleInputChange("numeroAdresseSecondaire", e.target.value)} className="text-sm" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Code Postal</label>
                          <Input value={editedData.codePostalSecondaire} onChange={(e) => handleInputChange("codePostalSecondaire", e.target.value)} className="text-sm" />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Ville</label>
                          <Input value={editedData.communeSecondaire} onChange={(e) => handleInputChange("communeSecondaire", e.target.value)} className="text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Permis de Conduire */}
                {visibleBlocks.permis && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex-1">Permis de Conduire</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleBlock('permis')}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Type de permis</label>
                        <Input value={editedData.typePermis} onChange={(e) => handleInputChange("typePermis", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">NumÃ©ro de permis</label>
                        <Input value={editedData.numeroPermis} onChange={(e) => handleInputChange("numeroPermis", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Date de validitÃ©</label>
                      <Input type="date" value={editedData.dateValiditePermis} onChange={(e) => handleInputChange("dateValiditePermis", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                )}

                {/* Section VÃ©hicules */}
                {visibleBlocks.vehicules && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex-1">VÃ©hicules</h3>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newVehicule = { marque: "", modele: "", immatriculation: "", chevaux: "", annee: "", carburant: "" };
                            setEditedData({
                              ...editedData,
                              vehicules: [...editedData.vehicules, newVehicule]
                            });
                          }}
                          className="text-xs"
                        >
                          + Ajouter un vÃ©hicule
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleBlock('vehicules')}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {editedData.vehicules.map((vehicule, index) => (
                      <div key={index} className="border rounded-lg p-3 mb-3 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-muted-foreground">VÃ©hicule {index + 1}</span>
                          {editedData.vehicules.length > 1 && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditedData({
                                  ...editedData,
                                  vehicules: editedData.vehicules.filter((_, i) => i !== index)
                                });
                              }}
                              className="text-xs text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Marque</label>
                            <Input 
                              value={vehicule.marque}
                              onChange={(e) => {
                                const newVehicules = [...editedData.vehicules];
                                newVehicules[index].marque = e.target.value;
                                setEditedData({ ...editedData, vehicules: newVehicules });
                              }}
                              className="text-sm"
                              placeholder="Ex: Peugeot"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">ModÃ¨le</label>
                            <Input 
                              value={vehicule.modele}
                              onChange={(e) => {
                                const newVehicules = [...editedData.vehicules];
                                newVehicules[index].modele = e.target.value;
                                setEditedData({ ...editedData, vehicules: newVehicules });
                              }}
                              className="text-sm"
                              placeholder="Ex: 308"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Plaque d'immatriculation</label>
                            <Input 
                              value={vehicule.immatriculation}
                              onChange={(e) => {
                                const newVehicules = [...editedData.vehicules];
                                newVehicules[index].immatriculation = e.target.value;
                                setEditedData({ ...editedData, vehicules: newVehicules });
                              }}
                              className="text-sm"
                              placeholder="Ex: AB-123-CD"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Chevaux fiscaux</label>
                            <Input 
                              value={vehicule.chevaux}
                              onChange={(e) => {
                                const newVehicules = [...editedData.vehicules];
                                newVehicules[index].chevaux = e.target.value;
                                setEditedData({ ...editedData, vehicules: newVehicules });
                              }}
                              className="text-sm"
                              placeholder="Ex: 110"
                              type="number"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">AnnÃ©e</label>
                            <Input 
                              value={vehicule.annee}
                              onChange={(e) => {
                                const newVehicules = [...editedData.vehicules];
                                newVehicules[index].annee = e.target.value;
                                setEditedData({ ...editedData, vehicules: newVehicules });
                              }}
                              className="text-sm"
                              placeholder="Ex: 2020"
                              type="number"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Carburant</label>
                            <select
                              value={vehicule.carburant}
                              onChange={(e) => {
                                const newVehicules = [...editedData.vehicules];
                                newVehicules[index].carburant = e.target.value;
                                setEditedData({ ...editedData, vehicules: newVehicules });
                              }}
                              className="w-full px-3 py-2 border rounded text-sm text-foreground bg-background dark:bg-background dark:text-foreground"
                            >
                              <option value="">SÃ©lectionnez...</option>
                              <option value="Essence">Essence</option>
                              <option value="Diesel">Diesel</option>
                              <option value="Ã‰lectrique">Ã‰lectrique</option>
                              <option value="Hybride">Hybride</option>
                              <option value="Gaz">Gaz</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Section Professionnels */}
                {visibleBlocks.professionnels && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex-1">Informations Professionnelles</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleBlock('professionnels')}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Profession</label>
                        <Input value={editedData.profession} onChange={(e) => handleInputChange("profession", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Entreprise</label>
                        <Input value={editedData.entreprise} onChange={(e) => handleInputChange("entreprise", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">NumÃ©ro SIRET</label>
                        <Input value={editedData.numeroSiret} onChange={(e) => handleInputChange("numeroSiret", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Poste</label>
                        <Input value={editedData.poste} onChange={(e) => handleInputChange("poste", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Date d'embauche</label>
                        <Input type="date" value={editedData.dateEmbauche} onChange={(e) => handleInputChange("dateEmbauche", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Salaire annuel</label>
                        <Input type="number" value={editedData.salaire} onChange={(e) => handleInputChange("salaire", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Type de contrat</label>
                        <select value={editedData.typeContrat} onChange={(e) => handleInputChange("typeContrat", e.target.value)} className="w-full px-3 py-2 border rounded text-sm text-foreground bg-background dark:bg-background dark:text-foreground">
                          <option value="CDI">CDI</option>
                          <option value="CDD">CDD</option>
                          <option value="Stage">Stage</option>
                          <option value="Alternance">Alternance</option>
                          <option value="IndÃ©pendant">IndÃ©pendant</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section CoordonnÃ©es Professionnelles */}
                {visibleBlocks.coordProf && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex-1">CoordonnÃ©es Professionnelles</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleBlock('coordProf')}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Adresse professionnelle</label>
                        <Input value={editedData.adresseProfessionnelle} onChange={(e) => handleInputChange("adresseProfessionnelle", e.target.value)} className="text-sm" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">TÃ©lÃ©phone professionnel</label>
                          <Input value={editedData.telephoneProfessionnel} onChange={(e) => handleInputChange("telephoneProfessionnel", e.target.value)} className="text-sm" />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Email professionnel</label>
                          <Input type="email" value={editedData.emailProfessionnel} onChange={(e) => handleInputChange("emailProfessionnel", e.target.value)} className="text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Informations Bancaires */}
                {visibleBlocks.bancaires && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex-1">Informations Bancaires</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleBlock('bancaires')}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">IBAN</label>
                        <Input value={editedData.iban} onChange={(e) => handleInputChange("iban", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">BIC</label>
                        <Input value={editedData.bic} onChange={(e) => handleInputChange("bic", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Nom de la banque</label>
                      <Input value={editedData.nomBanque} onChange={(e) => handleInputChange("nomBanque", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                )}

                {/* Section FiscalitÃ© */}
                {visibleBlocks.fiscalite && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex-1">FiscalitÃ© <span className="text-xs text-gray-500">(pour les entreprises)</span></h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleBlock('fiscalite')}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">NumÃ©ro fiscal</label>
                        <Input value={editedData.numeroFiscal} onChange={(e) => handleInputChange("numeroFiscal", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">NumÃ©ro de TVA</label>
                        <Input value={editedData.numeroTVA} onChange={(e) => handleInputChange("numeroTVA", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Revenu annuel</label>
                      <Input type="number" value={editedData.revenuAnnuel} onChange={(e) => handleInputChange("revenuAnnuel", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                )}

                {/* Section Revenus Fiscaux du Foyer */}
                {visibleBlocks.revenus && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex-1">Revenus Fiscaux du Foyer</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleBlock('revenus')}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Revenu fiscal du foyer</label>
                        <Input type="number" value={editedData.revenuFiscalFoyer} onChange={(e) => handleInputChange("revenuFiscalFoyer", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Quotient familial</label>
                        <Input type="number" step="0.1" value={editedData.quotientFamilial} onChange={(e) => handleInputChange("quotientFamilial", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Section SantÃ© */}
                {visibleBlocks.sante && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex-1">SantÃ©</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleBlock('sante')}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">NumÃ©ro de mutuelle</label>
                        <Input value={editedData.numeroMutuelle} onChange={(e) => handleInputChange("numeroMutuelle", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Nom de la mutuelle</label>
                        <Input value={editedData.mutuelle} onChange={(e) => handleInputChange("mutuelle", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Groupe sanguin</label>
                        <select value={editedData.groupeSanguin} onChange={(e) => handleInputChange("groupeSanguin", e.target.value)} className="w-full px-3 py-2 border rounded text-sm text-foreground bg-background dark:bg-background dark:text-foreground">
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Allergies</label>
                        <Input value={editedData.allergies} onChange={(e) => handleInputChange("allergies", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Assurances */}
                {visibleBlocks.assurances && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex-1">Assurances</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleBlock('assurances')}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">NÂ° Assurance VÃ©hicule</label>
                        <Input value={editedData.numeroAssuranceVehicule} onChange={(e) => handleInputChange("numeroAssuranceVehicule", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Assurance VÃ©hicule</label>
                        <Input value={editedData.assuranceVehicule} onChange={(e) => handleInputChange("assuranceVehicule", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">NÂ° Assurance Habitation</label>
                        <Input value={editedData.numeroAssuranceHabitation} onChange={(e) => handleInputChange("numeroAssuranceHabitation", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Assurance Habitation</label>
                        <Input value={editedData.assuranceHabitation} onChange={(e) => handleInputChange("assuranceHabitation", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">NÂ° Assurance ResponsabilitÃ© Civile</label>
                      <Input value={editedData.numeroAssuranceResponsabilite} onChange={(e) => handleInputChange("numeroAssuranceResponsabilite", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                )}

                {/* Section RQTH */}
                {visibleBlocks.rqth && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex-1">RQTH (Reconnaissance de la QualitÃ© de Travailleur HandicapÃ©)</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleBlock('rqth')}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="mb-4">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">ÃŠtes-vous RQTH ?</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="rqth"
                            value="oui"
                            checked={editedData.rqthStatut === "oui"}
                            onChange={(e) => handleInputChange("rqthStatut", e.target.value)}
                            className="cursor-pointer"
                          />
                          <span className="text-sm">Oui</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="rqth"
                            value="non"
                            checked={editedData.rqthStatut === "non"}
                            onChange={(e) => handleInputChange("rqthStatut", e.target.value)}
                            className="cursor-pointer"
                          />
                          <span className="text-sm">Non</span>
                        </label>
                      </div>
                    </div>

                    {editedData.rqthStatut === "oui" && (
                      <div className="space-y-3 mt-4 p-3 bg-secondary/30 rounded-lg border border-secondary">
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">NumÃ©ro RQTH</label>
                          <Input value={editedData.rqthNumero} onChange={(e) => handleInputChange("rqthNumero", e.target.value)} className="text-sm" placeholder="Ex: RQTH0123456789" />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Date de renouvellement</label>
                          <Input type="date" value={editedData.rqthDateRenouvellement} onChange={(e) => handleInputChange("rqthDateRenouvellement", e.target.value)} className="text-sm" />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Organisme de reconnaissance</label>
                          <Input value={editedData.rqthOrganisme} onChange={(e) => handleInputChange("rqthOrganisme", e.target.value)} className="text-sm" placeholder="Ex: MDPH" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Section Ã‰ducation */}
                {visibleBlocks.education && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex-1">Ã‰ducation</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleBlock('education')}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Niveau de diplÃ´me</label>
                        <Input value={editedData.diplomeNiveau} onChange={(e) => handleInputChange("diplomeNiveau", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">SpÃ©cialitÃ©</label>
                        <Input value={editedData.diplomeSpecialite} onChange={(e) => handleInputChange("diplomeSpecialite", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Ã‰tablissement d'Ã©tudes</label>
                        <Input value={editedData.etablissementEtudes} onChange={(e) => handleInputChange("etablissementEtudes", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">AnnÃ©e d'obtention</label>
                        <Input type="number" value={editedData.dateObtention} onChange={(e) => handleInputChange("dateObtention", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Contact d'Urgence */}
                {visibleBlocks.urgence && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex-1">Contact d'Urgence</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleBlock('urgence')}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Nom</label>
                        <Input value={editedData.nomUrgence} onChange={(e) => handleInputChange("nomUrgence", e.target.value)} className="text-sm" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">TÃ©lÃ©phone</label>
                        <Input value={editedData.telephoneUrgence} onChange={(e) => handleInputChange("telephoneUrgence", e.target.value)} className="text-sm" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">Relation</label>
                      <Input value={editedData.relationUrgence} onChange={(e) => handleInputChange("relationUrgence", e.target.value)} className="text-sm" />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSaveProfile} className="gap-2 flex-1 sm:flex-none">
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" className="gap-2 flex-1 sm:flex-none">
                    <X className="w-4 h-4" />
                    Annuler
                  </Button>
                </div>
              </div>
            ) : isMobile ? (
              // AFFICHAGE MOBILE - avec accordÃ©ons repliables
              <div className="space-y-3">
                {/* Infos principales */}
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-foreground">
                        {userData.prenom} {userData.nom}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({userData.dateNaissance ? new Date(userData.dateNaissance).getFullYear() : '?'})
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Email:</span> {userData.email}</p>
                      <p><span className="text-muted-foreground">TÃ©lÃ©phone:</span> {userData.telephone}</p>
                      <p><span className="text-muted-foreground">Adresse:</span> {userData.numeroAdresse ? `${userData.numeroAdresse} ${userData.typeVoieAdresse} ${userData.nomVoieAdresse}` : ''}, {userData.codePostal} {userData.commune}</p>
                    </div>
                  </div>
                </Card>

                {visibleBlocks.civiles && (
                  <CollapsibleSection title="Informations Civiles" defaultOpen={false} blockKey="civiles" onRemove={toggleBlock}>
                    <div className="space-y-2">
                      <div><p className="text-xs text-muted-foreground">CivilitÃ©</p><p className="text-sm font-medium">{userData.civilite}</p></div>
                      <div><p className="text-xs text-muted-foreground">Nom de naissance</p><p className="text-sm font-medium">{userData.nomNaissance}</p></div>
                      <div><p className="text-xs text-muted-foreground">NationalitÃ©</p><p className="text-sm font-medium">{userData.nationalite}</p></div>
                      <div><p className="text-xs text-muted-foreground">Situation familiale</p><p className="text-sm font-medium">{userData.situation}</p></div>
                    </div>
                  </CollapsibleSection>
                )}

                {visibleBlocks.identite && (
                  <CollapsibleSection title="PiÃ¨ce d'IdentitÃ©" defaultOpen={false} blockKey="identite" onRemove={toggleBlock}>
                    <div className="space-y-2">
                      <div><p className="text-xs text-muted-foreground">Type</p><p className="text-sm font-medium">{userData.typeDocument}</p></div>
                      <div><p className="text-xs text-muted-foreground">NumÃ©ro</p><p className="text-sm font-medium">{userData.numeroDocument}</p></div>
                      <div><p className="text-xs text-muted-foreground">Expiration</p><p className="text-sm font-medium">{userData.dateExpiration}</p></div>
                    </div>
                  </CollapsibleSection>
                )}

                {visibleBlocks.professionnels && userData.profession && (
                  <CollapsibleSection title="Professionnelles" defaultOpen={false} blockKey="professionnels" onRemove={toggleBlock}>
                    <div className="space-y-2">
                      <div><p className="text-xs text-muted-foreground">Profession</p><p className="text-sm font-medium">{userData.profession}</p></div>
                      <div><p className="text-xs text-muted-foreground">Entreprise</p><p className="text-sm font-medium">{userData.entreprise}</p></div>
                      <div><p className="text-xs text-muted-foreground">Poste</p><p className="text-sm font-medium">{userData.poste}</p></div>
                      {userData.typeContrat && <div><p className="text-xs text-muted-foreground">Contrat</p><p className="text-sm font-medium">{userData.typeContrat}</p></div>}
                    </div>
                  </CollapsibleSection>
                )}

                {visibleBlocks.sante && (
                  <CollapsibleSection title="Informations de SantÃ©" defaultOpen={false} blockKey="sante" onRemove={toggleBlock}>
                    <div className="space-y-2">
                      <div><p className="text-xs text-muted-foreground">Groupe sanguin</p><p className="text-sm font-medium">{userData.groupeSanguin}</p></div>
                      <div><p className="text-xs text-muted-foreground">Allergies</p><p className="text-sm font-medium">{userData.allergies}</p></div>
                      {userData.mutuelle && <div><p className="text-xs text-muted-foreground">Mutuelle</p><p className="text-sm font-medium">{userData.mutuelle}</p></div>}
                    </div>
                  </CollapsibleSection>
                )}

                {visibleBlocks.assurances && (userData.assuranceVehicule || userData.assuranceHabitation) && (
                  <CollapsibleSection title="Assurances" defaultOpen={false} blockKey="assurances" onRemove={toggleBlock}>
                    <div className="space-y-2">
                      {userData.assuranceVehicule && <div><p className="text-xs text-muted-foreground">VÃ©hicule</p><p className="text-sm font-medium">{userData.assuranceVehicule}</p></div>}
                      {userData.assuranceHabitation && <div><p className="text-xs text-muted-foreground">Habitation</p><p className="text-sm font-medium">{userData.assuranceHabitation}</p></div>}
                    </div>
                  </CollapsibleSection>
                )}

                {visibleBlocks.urgence && userData.nomUrgence && (
                  <CollapsibleSection title="Contact d'Urgence" defaultOpen={false} blockKey="urgence" onRemove={toggleBlock}>
                    <div className="space-y-2">
                      <div><p className="text-xs text-muted-foreground">Nom</p><p className="text-sm font-medium">{userData.nomUrgence}</p></div>
                      <div><p className="text-xs text-muted-foreground">TÃ©lÃ©phone</p><p className="text-sm font-medium">{userData.telephoneUrgence}</p></div>
                    </div>
                  </CollapsibleSection>
                )}

                {visibleBlocks.adresseSecondaire && (userData.numeroAdresseSecondaire || userData.codePostalSecondaire || userData.communeSecondaire) && (
                  <CollapsibleSection title="Adresses Secondaires" defaultOpen={false} blockKey="adresseSecondaire" onRemove={toggleBlock}>
                    <div className="space-y-2">
                      {userData.numeroAdresseSecondaire && <div><p className="text-xs text-muted-foreground">Adresse</p><p className="text-sm font-medium">{userData.numeroAdresseSecondaire}</p></div>}
                      {userData.codePostalSecondaire && <div><p className="text-xs text-muted-foreground">Code postal</p><p className="text-sm font-medium">{userData.codePostalSecondaire}</p></div>}
                      {userData.communeSecondaire && <div><p className="text-xs text-muted-foreground">Ville</p><p className="text-sm font-medium">{userData.communeSecondaire}</p></div>}
                    </div>
                  </CollapsibleSection>
                )}

                {visibleBlocks.permis && (userData.typePermis || userData.numeroPermis || userData.dateValiditePermis) && (
                  <CollapsibleSection title="Permis de Conduire" defaultOpen={false} blockKey="permis" onRemove={toggleBlock}>
                    <div className="space-y-2">
                      {userData.typePermis && <div><p className="text-xs text-muted-foreground">Type</p><p className="text-sm font-medium">{userData.typePermis}</p></div>}
                      {userData.numeroPermis && <div><p className="text-xs text-muted-foreground">NumÃ©ro</p><p className="text-sm font-medium">{userData.numeroPermis}</p></div>}
                      {userData.dateValiditePermis && <div><p className="text-xs text-muted-foreground">ValiditÃ©</p><p className="text-sm font-medium">{userData.dateValiditePermis}</p></div>}
                    </div>
                  </CollapsibleSection>
                )}

                {visibleBlocks.vehicules && userData.vehicules && userData.vehicules.length > 0 && (
                  <CollapsibleSection title="VÃ©hicules" defaultOpen={false} blockKey="vehicules" onRemove={toggleBlock}>
                    <div className="space-y-3">
                      {userData.vehicules.map((v, i) => (
                        <div key={i} className="p-3 border border-border rounded bg-secondary/20">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">VÃ©hicule {i + 1}</p>
                          <div className="space-y-1 text-xs">
                            {v.marque && <p><span className="text-muted-foreground">Marque:</span> {v.marque}</p>}
                            {v.modele && <p><span className="text-muted-foreground">ModÃ¨le:</span> {v.modele}</p>}
                            {v.immatriculation && <p><span className="text-muted-foreground">Immatriculation:</span> {v.immatriculation}</p>}
                            {v.chevaux && <p><span className="text-muted-foreground">Chevaux:</span> {v.chevaux}</p>}
                            {v.annee && <p><span className="text-muted-foreground">AnnÃ©e:</span> {v.annee}</p>}
                            {v.carburant && <p><span className="text-muted-foreground">Carburant:</span> {v.carburant}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                )}

                {visibleBlocks.coordProf && (userData.adresseProfessionnelle || userData.telephoneProfessionnel || userData.emailProfessionnel) && (
                  <CollapsibleSection title="CoordonnÃ©es Professionnelles" defaultOpen={false} blockKey="coordProf" onRemove={toggleBlock}>
                    <div className="space-y-2">
                      {userData.adresseProfessionnelle && <div><p className="text-xs text-muted-foreground">Adresse</p><p className="text-sm font-medium">{userData.adresseProfessionnelle}</p></div>}
                      {userData.telephoneProfessionnel && <div><p className="text-xs text-muted-foreground">TÃ©lÃ©phone</p><p className="text-sm font-medium">{userData.telephoneProfessionnel}</p></div>}
                      {userData.emailProfessionnel && <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium">{userData.emailProfessionnel}</p></div>}
                    </div>
                  </CollapsibleSection>
                )}

                {visibleBlocks.bancaires && (userData.iban || userData.bic || userData.nomBanque) && (
                  <CollapsibleSection title="Informations Bancaires" defaultOpen={false} blockKey="bancaires" onRemove={toggleBlock}>
                    <div className="space-y-2">
                      {userData.nomBanque && <div><p className="text-xs text-muted-foreground">Banque</p><p className="text-sm font-medium">{userData.nomBanque}</p></div>}
                      {userData.iban && <div><p className="text-xs text-muted-foreground">IBAN</p><p className="text-sm font-medium">{userData.iban}</p></div>}
                      {userData.bic && <div><p className="text-xs text-muted-foreground">BIC</p><p className="text-sm font-medium">{userData.bic}</p></div>}
                    </div>
                  </CollapsibleSection>
                )}

                {visibleBlocks.fiscalite && (userData.numeroFiscal || userData.numeroTVA || userData.revenuAnnuel) && (
                  <CollapsibleSection title="FiscalitÃ©" defaultOpen={false} blockKey="fiscalite" onRemove={toggleBlock}>
                    <div className="space-y-2">
                      {userData.numeroFiscal && <div><p className="text-xs text-muted-foreground">NumÃ©ro fiscal</p><p className="text-sm font-medium">{userData.numeroFiscal}</p></div>}
                      {userData.numeroTVA && <div><p className="text-xs text-muted-foreground">NumÃ©ro TVA</p><p className="text-sm font-medium">{userData.numeroTVA}</p></div>}
                      {userData.revenuAnnuel && <div><p className="text-xs text-muted-foreground">Revenu annuel</p><p className="text-sm font-medium">{userData.revenuAnnuel}â‚¬</p></div>}
                    </div>
                  </CollapsibleSection>
                )}

                {visibleBlocks.revenus && (userData.revenuFiscalFoyer || userData.quotientFamilial) && (
                  <CollapsibleSection title="Revenus du Foyer" defaultOpen={false} blockKey="revenus" onRemove={toggleBlock}>
                    <div className="space-y-2">
                      {userData.revenuFiscalFoyer && <div><p className="text-xs text-muted-foreground">Revenu fiscal</p><p className="text-sm font-medium">{userData.revenuFiscalFoyer}â‚¬</p></div>}
                      {userData.quotientFamilial && <div><p className="text-xs text-muted-foreground">Quotient familial</p><p className="text-sm font-medium">{userData.quotientFamilial}</p></div>}
                    </div>
                  </CollapsibleSection>
                )}

                {visibleBlocks.rqth && userData.rqthStatut && (
                  <CollapsibleSection title="RQTH" defaultOpen={false} blockKey="rqth" onRemove={toggleBlock}>
                    <div className="space-y-2">
                      <div><p className="text-xs text-muted-foreground">Statut</p><p className="text-sm font-medium">{userData.rqthStatut === "oui" ? "Oui" : "Non"}</p></div>
                      {userData.rqthStatut === "oui" && (
                        <>
                          {userData.rqthNumero && <div><p className="text-xs text-muted-foreground">NumÃ©ro</p><p className="text-sm font-medium">{userData.rqthNumero}</p></div>}
                          {userData.rqthDateRenouvellement && <div><p className="text-xs text-muted-foreground">Renouvellement</p><p className="text-sm font-medium">{userData.rqthDateRenouvellement}</p></div>}
                          {userData.rqthOrganisme && <div><p className="text-xs text-muted-foreground">Organisme</p><p className="text-sm font-medium">{userData.rqthOrganisme}</p></div>}
                        </>
                      )}
                    </div>
                  </CollapsibleSection>
                )}

                {visibleBlocks.education && (userData.diplomeNiveau || userData.diplomeSpecialite || userData.etablissementEtudes || userData.dateObtention) && (
                  <CollapsibleSection title="Ã‰ducation" defaultOpen={false} blockKey="education" onRemove={toggleBlock}>
                    <div className="space-y-2">
                      {userData.diplomeNiveau && <div><p className="text-xs text-muted-foreground">Niveau</p><p className="text-sm font-medium">{userData.diplomeNiveau}</p></div>}
                      {userData.diplomeSpecialite && <div><p className="text-xs text-muted-foreground">SpÃ©cialitÃ©</p><p className="text-sm font-medium">{userData.diplomeSpecialite}</p></div>}
                      {userData.etablissementEtudes && <div><p className="text-xs text-muted-foreground">Ã‰tablissement</p><p className="text-sm font-medium">{userData.etablissementEtudes}</p></div>}
                      {userData.dateObtention && <div><p className="text-xs text-muted-foreground">AnnÃ©e</p><p className="text-sm font-medium">{userData.dateObtention}</p></div>}
                    </div>
                  </CollapsibleSection>
                )}
              </div>
            ) : (
              // AFFICHAGE DESKTOP - complet
              <div className="space-y-6">
                {/* Section Informations Civiles */}
                {visibleBlocks.civiles && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Informations Civiles</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">CivilitÃ©</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.civilite}</p></div>
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">PrÃ©nom</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.prenom}</p></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      {userData.nomUsage && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Nom d'usage</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.nomUsage}</p></div>
                      )}
                      {userData.nomNaissance && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Nom de naissance</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.nomNaissance}</p></div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Date de naissance</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.dateNaissance}</p></div>
                      {userData.codePostalNaissance && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Lieu de naissance avec code postal</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.communeNaissance} ({userData.codePostalNaissance})</p></div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">NationalitÃ©</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.nationalite}</p></div>
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Situation familiale</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.situation}</p></div>
                    </div>
                    <div className="mt-3">
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Nombre d'enfants</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.nombreEnfants}</p></div>
                    </div>
                  </div>
                )}

                {/* Section Document d'IdentitÃ© */}
                {visibleBlocks.identite && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">PiÃ¨ce d'IdentitÃ©</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Type de document</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.typeDocument}</p></div>
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">NumÃ©ro</p><p className="text-xs text-foreground mb-2 italic">NumÃ©ro attribuÃ© au document sÃ©lectionnÃ©</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroDocument}</p></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Date d'expiration</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.dateExpiration}</p></div>
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">NumÃ©ro de SÃ©curitÃ© Sociale</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroSecuriteSociale}</p></div>
                    </div>
                  </div>
                )}

                {/* Section CoordonnÃ©es */}
                {visibleBlocks.coordonnees && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">CoordonnÃ©es</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Email</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.email}</p></div>
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">TÃ©lÃ©phone</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.telephone}</p></div>
                    </div>
                    {userData.telephoneSecondaire && (
                      <div className="mt-3 p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">TÃ©lÃ©phone secondaire</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.telephoneSecondaire}</p></div>
                    )}
                  </div>
                )}

                {/* Section Adresse */}
                {visibleBlocks.adresse && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Adresse</h3>
                    <div className="space-y-3">
                      {userData.numeroAdresse && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Adresse</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroAdresse} {userData.typeVoieAdresse} {userData.nomVoieAdresse}</p></div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Code Postal</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.codePostal}</p></div>
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Commune</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.commune}</p></div>
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Pays</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.pays}</p></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Adresse Secondaire */}
                {visibleBlocks.adresseSecondaire && (userData.numeroAdresseSecondaire || userData.codePostalSecondaire || userData.communeSecondaire) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Adresse Secondaire</h3>
                    <div className="space-y-3">
                      {userData.numeroAdresseSecondaire && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Adresse</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroAdresseSecondaire}</p></div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {userData.codePostalSecondaire && (
                          <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Code Postal</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.codePostalSecondaire}</p></div>
                        )}
                        {userData.communeSecondaire && (
                          <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Ville</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.communeSecondaire}</p></div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Permis de Conduire */}
                {visibleBlocks.permis && (userData.typePermis || userData.numeroPermis || userData.dateValiditePermis) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Permis de Conduire</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {userData.typePermis && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Type de permis</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.typePermis}</p></div>
                      )}
                      {userData.numeroPermis && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">NumÃ©ro de permis</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroPermis}</p></div>
                      )}
                    </div>
                    {userData.dateValiditePermis && (
                      <div className="mt-3 p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Date de validitÃ©</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.dateValiditePermis}</p></div>
                    )}
                  </div>
                )}

                {/* Section VÃ©hicules */}
                {visibleBlocks.vehicules && userData.vehicules && userData.vehicules.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">VÃ©hicules</h3>
                    <div className="space-y-3">
                      {userData.vehicules.map((vehicule, index) => (
                        <div key={index} className="p-3 sm:p-4 bg-secondary/50 rounded-lg border border-secondary">
                          <p className="text-xs font-medium text-muted-foreground mb-3">VÃ©hicule {index + 1}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {vehicule.marque && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Marque</p>
                                <p className="font-medium text-foreground text-sm">{vehicule.marque}</p>
                              </div>
                            )}
                            {vehicule.modele && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">ModÃ¨le</p>
                                <p className="font-medium text-foreground text-sm">{vehicule.modele}</p>
                              </div>
                            )}
                            {vehicule.immatriculation && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Plaque d'immatriculation</p>
                                <p className="font-medium text-foreground text-sm">{vehicule.immatriculation}</p>
                              </div>
                            )}
                            {vehicule.chevaux && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Chevaux fiscaux</p>
                                <p className="font-medium text-foreground text-sm">{vehicule.chevaux}</p>
                              </div>
                            )}
                            {vehicule.annee && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">AnnÃ©e</p>
                                <p className="font-medium text-foreground text-sm">{vehicule.annee}</p>
                              </div>
                            )}
                            {vehicule.carburant && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Carburant</p>
                                <p className="font-medium text-foreground text-sm">{vehicule.carburant}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section Professionnels */}
                {visibleBlocks.professionnels && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Informations Professionnelles</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Profession</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.profession}</p></div>
                      <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Entreprise</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.entreprise}</p></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      {userData.numeroSiret && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">NumÃ©ro SIRET</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroSiret}</p></div>
                      )}
                      {userData.poste && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Poste</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.poste}</p></div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3">
                      {userData.dateEmbauche && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Date d'embauche</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.dateEmbauche}</p></div>
                      )}
                      {userData.salaire && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Salaire annuel</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.salaire}â‚¬</p></div>
                      )}
                      {userData.typeContrat && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Type de contrat</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.typeContrat}</p></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Section CoordonnÃ©es Professionnelles */}
                {visibleBlocks.coordProf && (userData.adresseProfessionnelle || userData.telephoneProfessionnel || userData.emailProfessionnel) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">CoordonnÃ©es Professionnelles</h3>
                    <div className="space-y-3">
                      {userData.adresseProfessionnelle && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Adresse professionnelle</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.adresseProfessionnelle}</p></div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {userData.telephoneProfessionnel && (
                          <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">TÃ©lÃ©phone professionnel</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.telephoneProfessionnel}</p></div>
                        )}
                        {userData.emailProfessionnel && (
                          <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Email professionnel</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.emailProfessionnel}</p></div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Informations Bancaires */}
                {visibleBlocks.bancaires && (userData.iban || userData.bic || userData.nomBanque) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Informations Bancaires</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {userData.iban && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">IBAN</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.iban}</p></div>
                      )}
                      {userData.bic && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">BIC</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.bic}</p></div>
                      )}
                    </div>
                    {userData.nomBanque && (
                      <div className="mt-3 p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Nom de la banque</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.nomBanque}</p></div>
                    )}
                  </div>
                )}

                {/* Section FiscalitÃ© */}
                {visibleBlocks.fiscalite && (userData.numeroFiscal || userData.numeroTVA || userData.revenuAnnuel) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">FiscalitÃ© <span className="text-xs text-gray-500">(pour les entreprises)</span></h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {userData.numeroFiscal && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">NumÃ©ro fiscal</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroFiscal}</p></div>
                      )}
                      {userData.numeroTVA && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">NumÃ©ro de TVA</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroTVA}</p></div>
                      )}
                    </div>
                    {userData.revenuAnnuel && (
                      <div className="mt-3 p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Revenu annuel</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.revenuAnnuel}â‚¬</p></div>
                    )}
                  </div>
                )}

                {/* Section Revenus Fiscaux du Foyer */}
                {visibleBlocks.revenus && (userData.revenuFiscalFoyer || userData.quotientFamilial) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Revenus Fiscaux du Foyer</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {userData.revenuFiscalFoyer && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Revenu fiscal du foyer</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.revenuFiscalFoyer}â‚¬</p></div>
                      )}
                      {userData.quotientFamilial && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Quotient familial</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.quotientFamilial}</p></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Section SantÃ© */}
                {visibleBlocks.sante && (userData.numeroMutuelle || userData.mutuelle || userData.groupeSanguin || userData.allergies) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">SantÃ©</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {userData.numeroMutuelle && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">NumÃ©ro de mutuelle</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroMutuelle}</p></div>
                      )}
                      {userData.mutuelle && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Nom de la mutuelle</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.mutuelle}</p></div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      {userData.groupeSanguin && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Groupe sanguin</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.groupeSanguin}</p></div>
                      )}
                      {userData.allergies && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Allergies</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.allergies}</p></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Section Assurances */}
                {visibleBlocks.assurances && (userData.numeroAssuranceVehicule || userData.assuranceVehicule || userData.numeroAssuranceHabitation || userData.assuranceHabitation || userData.numeroAssuranceResponsabilite) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Assurances</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {userData.numeroAssuranceVehicule && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">NÂ° Assurance VÃ©hicule</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroAssuranceVehicule}</p></div>
                      )}
                      {userData.assuranceVehicule && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Assurance VÃ©hicule</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.assuranceVehicule}</p></div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      {userData.numeroAssuranceHabitation && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">NÂ° Assurance Habitation</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroAssuranceHabitation}</p></div>
                      )}
                      {userData.assuranceHabitation && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Assurance Habitation</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.assuranceHabitation}</p></div>
                      )}
                    </div>
                    {userData.numeroAssuranceResponsabilite && (
                      <div className="mt-3 p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">NÂ° Assurance ResponsabilitÃ© Civile</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.numeroAssuranceResponsabilite}</p></div>
                    )}
                  </div>
                )}

                {/* Section RQTH */}
                {visibleBlocks.rqth && userData.rqthStatut && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">RQTH (Reconnaissance de la QualitÃ© de Travailleur HandicapÃ©)</h3>
                    <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg mb-3">
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">Statut RQTH</p>
                      <p className="font-medium text-foreground text-sm sm:text-base capitalize">{userData.rqthStatut === "oui" ? "Oui" : "Non"}</p>
                    </div>
                    {userData.rqthStatut === "oui" && (
                      <div className="space-y-3 p-3 sm:p-4 bg-secondary/30 rounded-lg border border-secondary">
                        {userData.rqthNumero && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">NumÃ©ro RQTH</p>
                            <p className="font-medium text-foreground text-sm">{userData.rqthNumero}</p>
                          </div>
                        )}
                        {userData.rqthDateRenouvellement && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Date de renouvellement</p>
                            <p className="font-medium text-foreground text-sm">{userData.rqthDateRenouvellement}</p>
                          </div>
                        )}
                        {userData.rqthOrganisme && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Organisme de reconnaissance</p>
                            <p className="font-medium text-foreground text-sm">{userData.rqthOrganisme}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Section Ã‰ducation */}
                {visibleBlocks.education && (userData.diplomeNiveau || userData.diplomeSpecialite || userData.etablissementEtudes || userData.dateObtention) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Ã‰ducation</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {userData.diplomeNiveau && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Niveau de diplÃ´me</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.diplomeNiveau}</p></div>
                      )}
                      {userData.diplomeSpecialite && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">SpÃ©cialitÃ©</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.diplomeSpecialite}</p></div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                      {userData.etablissementEtudes && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Ã‰tablissement d'Ã©tudes</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.etablissementEtudes}</p></div>
                      )}
                      {userData.dateObtention && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">AnnÃ©e d'obtention</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.dateObtention}</p></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Section Contact d'Urgence */}
                {visibleBlocks.urgence && (userData.nomUrgence || userData.telephoneUrgence || userData.relationUrgence) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 border-b pb-2">Contact d'Urgence</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {userData.nomUrgence && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Nom</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.nomUrgence}</p></div>
                      )}
                      {userData.telephoneUrgence && (
                        <div className="p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">TÃ©lÃ©phone</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.telephoneUrgence}</p></div>
                      )}
                    </div>
                    {userData.relationUrgence && (
                      <div className="mt-3 p-3 sm:p-4 bg-secondary/50 rounded-lg"><p className="text-xs sm:text-sm text-muted-foreground mb-1">Relation</p><p className="font-medium text-foreground text-sm sm:text-base">{userData.relationUrgence}</p></div>
                    )}
                  </div>
                )}

              </div>
            )}
          </Card>

        </div>
      </main>
    </div>
  );
};

export default Profile;




