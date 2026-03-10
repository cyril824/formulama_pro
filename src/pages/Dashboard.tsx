import { useState, useEffect, useCallback } from "react";
// Importez les icônes nécessaires pour la navigation
import { Menu, FileText, CheckCircle2, XCircle, Archive, LifeBuoy, Home, HelpCircle, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// CORRECTION D'IMPORTATION : Chemins explicites pour la résolution
import DocumentUpload from "../components/DocumentUpload.tsx";
import DocumentViewer from "../components/DocumentViewer.tsx"; // Import du visualiseur
import NavigationMenu from "@/components/NavigationMenu";
import SignaturePad from "@/components/SignaturePad"; 

// Importez les hooks nécessaires pour le routage et la navigation
import { useSearchParams, Link, useNavigate } from "react-router-dom"; 

// CORRECTION D'IMPORTATION : Chemin explicite pour la résolution
import DocumentsPage from "./Documents.tsx";
import Profile from "./Profile.tsx";
import SettingsPage from "./Settings.tsx"; 

// --- INTERFACE MISE À JOUR POUR CORRESPONDRE À LA DB SQLITE ---
interface Document {
  id: number; // L'ID de la DB est un nombre
  nom_fichier: string; // Nom du fichier
  chemin_local: string;
  categorie: string; // Utilisé pour afficher si c'est "archivé" ou autre
  date_ajout: string; // La date au format chaîne (ex: "2025-11-27 10:30:00")
  is_signed?: boolean | number; // Peut être true/false ou 0/1 de SQLite
  is_filled?: boolean | number; // Peut être true/false ou 0/1 de SQLite
}

// Interface pour les catégories
interface Category {
  name: string;
  icon: any;
  url: string;
}

// CORRECTION CRITIQUE : Utilisation stricte de localhost pour éviter les blocages inter-IP
const API_BASE_URL = '';

// --- COMPOSANT : Contenu de la Page d'Accueil DYNAMIQUE ---
const HomeContent = ({ refreshKey, onDocumentClick }: { refreshKey: number, onDocumentClick: (doc: Document) => void }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<{ fileName: string; fileUrl: string; documentId: number } | null>(null);

  // Fonction pour charger les documents récents
  const fetchRecentDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Appel au nouvel endpoint que nous avons créé dans app_server.py
      const response = await fetch(`${API_BASE_URL}/api/documents/recents`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      console.error("Erreur de chargement des documents récents:", err);
      setError("Impossible de charger les documents récents. Vérifiez le serveur API.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Exécute la fonction de chargement au montage et lorsque refreshKey change
  useEffect(() => {
    fetchRecentDocuments();
  }, [fetchRecentDocuments, refreshKey]);

  // Fonction utilitaire pour le formatage de la date (simple)
  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Formatage simple pour l'affichage (ex: "15 Nov 2025")
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateString.split(' ')[0] || 'Date inconnue'; // Retourne juste la partie date en cas d'erreur
    }
  };

  // Logique pour vérifier si un document est signé
  const isSigned = (doc: Document) => doc.is_signed === true || doc.is_signed === 1;

  // Logique pour vérifier si un document est rempli
  const isFilled = (doc: Document) => doc.is_filled === true || doc.is_filled === 1; 
  
  const handleSignDocument = async () => {
    if (!selectedDoc) return;
    setShowContextMenu(false);
    setShowSignaturePad(true);
  };

  const handleSignatureComplete = async (signatureData: string) => {
    if (!selectedDoc) return;
    try {
      // Appeler l'API pour marquer le document comme signé et sauvegarder la signature
      const response = await fetch(`${API_BASE_URL}/api/documents/${selectedDoc.id}/sign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ signatureData }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du document');
      }

      console.log('Signature complétée et sauvegardée');
      alert(`Document "${selectedDoc.nom_fichier}" a été signé avec succès!`);
      setShowSignaturePad(false);
      setSelectedDoc(null);
      // Rafraîchir la liste
      fetchRecentDocuments();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la signature du document');
    }
  };

  const handleViewDocument = () => {
    if (selectedDoc) {
      setViewingDocument({
        fileName: selectedDoc.nom_fichier,
        fileUrl: `${API_BASE_URL}/api/documents/preview/${selectedDoc.id}`,
        documentId: selectedDoc.id
      });
      setShowContextMenu(false);
      setSelectedDoc(null);
    }
  };

  const handleFillDocument = async () => {
    if (!selectedDoc) return;
    try {
      // Récupérer les données du profil depuis sessionStorage
      const profileData = sessionStorage.getItem("userProfileData");
      if (!profileData) {
        alert("Veuillez d'abord remplir votre profil avant de remplir un document");
        return;
      }

      const userProfile = JSON.parse(profileData);

      // Appeler l'API pour marquer le document comme rempli
      const response = await fetch(`${API_BASE_URL}/api/documents/${selectedDoc.id}/fill`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'default_user',
          profile: userProfile
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du document');
      }

      console.log('Document marqué comme rempli');
      alert(`Document "${selectedDoc.nom_fichier}" a été marqué comme rempli!`);
      setShowContextMenu(false);
      setSelectedDoc(null);
      // Rafraîchir la liste
      fetchRecentDocuments();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du remplissage du document');
    }
  };

  const handleDelete = async (docId: number, docName: string) => {
    if (!window.confirm(`Confirmation de suppression pour ${docName}.`)) {
      console.log("Suppression annulée par l'utilisateur.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${docId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log(`Document ${docId} supprimé avec succès.`);
        alert(`Document "${docName}" a été supprimé avec succès!`);
        // Rafraîchir la liste
        fetchRecentDocuments();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
        throw new Error(`Échec de la suppression sur le serveur: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert('Erreur lors de la suppression du document');
    }
  };

  const handleCloseViewer = () => {
    setViewingDocument(null);
  };
  
  // Affichage de l'état de chargement
  if (isLoading) {
    return <div className="p-8 text-center text-primary/70">Chargement des documents récents...</div>;
  }
  
  // Affichage des erreurs
  if (error) {
    return <div className="p-8 text-center text-destructive">🛑 Erreur: {error}</div>;
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Aperçu et Documents en Cours</h2>
        <span className="text-sm text-muted-foreground">
          {documents.length} document{documents.length !== 1 ? "s" : ""}
        </span>
      </div>
      
      <div className="grid gap-3">
        {documents.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground border border-dashed border-indigo-500/30 rounded-lg bg-gradient-to-br from-indigo-950/30 to-slate-900/20">
            Aucun document trouvé. Déposez-en un pour commencer !
          </div>
        ) : (
          documents.map((doc, index) => {
            return (
              <div
                key={doc.id}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setMenuPosition({
                    x: rect.right - 200,
                    y: rect.top + 10
                  });
                  setSelectedDoc(doc);
                  setShowContextMenu(true);
                }}
                className="bg-card dark:bg-gradient-to-r dark:from-slate-800 dark:via-indigo-900/20 dark:to-slate-800 rounded-xl p-4 shadow-[var(--shadow-soft)] dark:shadow-lg dark:shadow-indigo-900/20 hover:shadow-[var(--shadow-medium)] dark:hover:shadow-indigo-900/30 transition-all duration-300 animate-in slide-in-from-bottom cursor-pointer w-full max-w-full overflow-hidden border border-transparent dark:border-indigo-500/20 dark:hover:border-indigo-500/40 hover:dark:bg-gradient-to-r hover:dark:from-slate-800/80 hover:dark:via-indigo-900/30 hover:dark:to-slate-800/80"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 dark:bg-gradient-to-br dark:from-indigo-600/30 dark:to-indigo-800/40 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary dark:text-indigo-400" />
                  </div>

                  <div className="flex-1 min-w-0 w-full max-w-full">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-3 w-full max-w-full">
                      <div className="flex-1 min-w-0 w-full max-w-full">
                        <h3 className="font-medium text-foreground dark:text-indigo-100 break-words text-xs sm:text-base whitespace-normal">
                          {doc.nom_fichier}
                        </h3>
                        {/* Affiche la catégorie si ce n'est pas la catégorie par défaut (pour distinguer les Archivés) */}
                        {doc.categorie !== 'Documents en Cours' && (
                            <p className="text-xs text-secondary-foreground/70 dark:text-indigo-300/60 mt-0.5 truncate">
                                Classé dans : {doc.categorie}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground dark:text-indigo-300/50 mt-0.5">
                          {formatDisplayDate(doc.date_ajout)}
                        </p>
                      </div>

                      {/* Badges pour les états "Signé" / "Non Signé" et "Rempli" / "À remplir" */}
                      <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                        {/* Badge Rempli/À remplir */}
                        <Badge
                          variant={isFilled(doc) ? "default" : "secondary"}
                          className={`flex items-center gap-1 transition-all duration-300 flex-shrink-0 text-xs h-fit w-fit text-white ${
                            isFilled(doc)
                              ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600/80 dark:hover:bg-blue-600"
                              : "bg-gray-400 hover:bg-gray-500 dark:bg-gray-600/60 dark:hover:bg-gray-600/70"
                          }`}
                        >
                          {isFilled(doc) ? (
                            <>
                              <span>✓</span>
                              <span>Rempli</span>
                            </>
                          ) : (
                            <>
                              <span>○</span>
                              <span>À remplir</span>
                            </>
                          )}
                        </Badge>

                        {/* Badge Signé/Non signé */}
                        <Badge
                          variant={isSigned(doc) ? "default" : "destructive"}
                          className={`flex items-center gap-1 transition-all duration-300 flex-shrink-0 text-xs h-fit w-fit text-white ${
                            isSigned(doc)
                              ? "bg-success hover:bg-success/90 dark:bg-emerald-600/80 dark:hover:bg-emerald-600"
                              : "bg-destructive hover:bg-destructive/90 dark:bg-red-600/60 dark:hover:bg-red-600/70"
                          }`}
                        >
                          {isSigned(doc) ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Signé</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>Non signé</span>
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Menu contextuel - Popup Compact 2x2 */}
      {showContextMenu && selectedDoc && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={() => {
              setShowContextMenu(false);
              setSelectedDoc(null);
            }}
          />
          <div 
            className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 bg-white dark:bg-slate-800 w-full max-w-md"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate text-base">
                {selectedDoc.nom_fichier}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Sélectionnez une action</p>
            </div>

            {/* Grille 2x2 */}
            <div className="p-6 grid grid-cols-2 gap-4">
              {/* Signer - Bleu */}
              <button
                onClick={handleSignDocument}
                disabled={isSigned(selectedDoc)}
                className={`relative px-3 py-4 rounded-xl font-medium transition-all duration-200 flex flex-col items-center gap-2.5 ${
                  isSigned(selectedDoc)
                    ? 'bg-gray-100 dark:bg-slate-700/50 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'bg-sky-50 dark:bg-sky-900/20 text-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:border-sky-300 dark:hover:border-sky-700'
                }`}
              >
                <span className="text-2xl">✓</span>
                <span className="text-sm font-semibold leading-tight">Signer</span>
              </button>

              {/* Remplir - Vert */}
              <button
                onClick={handleFillDocument}
                disabled={isFilled(selectedDoc)}
                className={`relative px-3 py-4 rounded-xl font-medium transition-all duration-200 flex flex-col items-center gap-2.5 ${
                  isFilled(selectedDoc)
                    ? 'bg-gray-100 dark:bg-slate-700/50 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
              >
                <span className="text-2xl">📝</span>
                <span className="text-sm font-semibold leading-tight">Remplir</span>
              </button>

              {/* Voir - Pourpre */}
              <button
                onClick={handleViewDocument}
                className="relative px-3 py-4 rounded-xl font-medium transition-all duration-200 flex flex-col items-center gap-2.5 bg-violet-50 dark:bg-violet-900/20 text-violet-900 dark:text-violet-200 border border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:border-violet-300 dark:hover:border-violet-700"
              >
                <span className="text-2xl">👁️</span>
                <span className="text-sm font-semibold leading-tight">Voir</span>
              </button>

              {/* Supprimer - Rose */}
              <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(selectedDoc.id, selectedDoc.nom_fichier);
                    setShowContextMenu(false);
                    setSelectedDoc(null);
                }}
                className="relative px-3 py-4 rounded-xl font-medium transition-all duration-200 flex flex-col items-center gap-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:border-rose-300 dark:hover:border-rose-700"
              >
                <span className="text-2xl">🗑️</span>
                <span className="text-sm font-semibold leading-tight">Supprimer</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Signature Pad Modal */}
      {showSignaturePad && selectedDoc && (
        <SignaturePad
          onSign={handleSignatureComplete}
          onCancel={() => {
            setShowSignaturePad(false);
            setSelectedDoc(null);
          }}
          documentName={selectedDoc.nom_fichier}
          documentPath={`${API_BASE_URL}/api/documents/preview/${selectedDoc.id}`}
          documentType={selectedDoc.nom_fichier.split('.').pop()?.toLowerCase() || 'pdf'}
        />
      )}

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <DocumentViewer
          fileName={viewingDocument.fileName}
          fileUrl={viewingDocument.fileUrl}
          onClose={handleCloseViewer}
          documentId={viewingDocument.documentId}
        />
      )}
    </div>
  );
};



// --- COMPOSANT PRINCIPAL DASHBOARD ---
const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentView = searchParams.get('view') || 'home'; 

  // NOUVEAU : État pour le document actuellement visualisé (pour la modale)
  const [viewingDocument, setViewingDocument] = useState<{ fileName: string; fileUrl: string; documentId: number } | null>(null);

  // L'état qui force le rafraîchissement global après un upload/suppression
  const [globalRefreshKey, setGlobalRefreshKey] = useState(0);
  
  // État pour les catégories chargées dynamiquement
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Charger les catégories au montage du composant
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        if (response.ok) {
          const data = await response.json();
          // Construire les catégories avec les icônes
          const categoriesWithIcons = data.map((catName: string) => ({
            name: catName,
            icon: catName === "Documents archivés" ? Archive : LifeBuoy,
            url: catName
          }));
          setCategories(categoriesWithIcons);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);
  // Fonction de rappel pour l'upload (incrémente la clé)
  const handleDocumentUploaded = () => {
      setGlobalRefreshKey(prevKey => prevKey + 1); 
  };

  // NOUVEAU : Fonction pour ouvrir le visualiseur
  const handleViewDocument = (doc: Document) => {
    // Utiliser localhost:5001 pour forcer la communication inter-port locale
    const fileUrl = `${API_BASE_URL}/api/documents/ouvrir/${doc.nom_fichier}`;
    setViewingDocument({ fileName: doc.nom_fichier, fileUrl, documentId: doc.id });
  };

  // NOUVEAU : Fonction pour fermer le visualiseur
  const handleCloseViewer = () => {
    setViewingDocument(null);
  };

  // Fonctions pour le menu profil
  const handleViewProfile = () => {
    navigate("/profile");
  };

  const handleViewSettings = () => {
    navigate("/settings");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const isDocumentCategory = categories.some(cat => cat.url === currentView);

  const currentCategoryName = isDocumentCategory ? currentView : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent overflow-hidden flex flex-col">
      
      {/* Header avec menu hamburger sur mobile */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-[var(--shadow-soft)]">
        <div className="w-full px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Menu hamburger MOBILE ONLY - À GAUCHE */}
          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <NavigationMenu /> 
              </SheetContent>
            </Sheet>
          </div>

          {/* Titre */}
          <h1 className="text-lg sm:text-xl font-bold text-foreground flex-1 text-center md:hidden">Formulama</h1>
          <h1 className="hidden md:block text-lg sm:text-xl font-bold text-foreground">Formulama</h1>
          
          {/* Menu déroulant de profil en haut à droite */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full hover:bg-primary/10 transition-colors text-foreground" title="Profil">
                <User className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              <DropdownMenuItem className="cursor-pointer" onClick={handleViewProfile}>
                <User className="mr-2 h-4 w-4" />
                <span>Mon Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={handleViewSettings}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>


      <main className="w-full max-w-full overflow-x-hidden px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 flex-1">
        
        {/* Upload Section (Toujours visible en haut) */}
        {currentView === 'home' && (
      <div className="animate-in fade-in duration-500">
        {/* L'upload déclenche le rafraîchissement de la liste en incrémentant globalRefreshKey */}
        <DocumentUpload onUploadSuccess={handleDocumentUploaded} />
      </div>
)}
        {/* --- CONTENU DYNAMIQUE (Accueil vs Documents) --- */}
        <div className="space-y-4 pt-4">
            {currentView === 'home' ? (
                // 1. Affiche le contenu DYNAMIQUE de l'Accueil (liste de signature)
                <HomeContent 
                  refreshKey={globalRefreshKey} // Passe la clé pour forcer le rafraîchissement
                  onDocumentClick={handleViewDocument} // Passe la fonction d'ouverture
                />
            ) : isDocumentCategory ? (
                // 2. Affiche la page des documents dynamiques
                <DocumentsPage 
                    currentCategory={currentCategoryName} 
                    refreshKey={globalRefreshKey} // Clé pour le rafraîchissement après upload/delete
                    onDocumentClick={handleViewDocument} // Passe la fonction d'ouverture
                />
            ) : (
                // 3. Cas par défaut 
                <div>Sélectionnez une option valide dans le menu.</div>
            )}
        </div>
        
      </main>

      {/* NOUVEAU : Modale de visualisation conditionnelle */}
      {viewingDocument && (
        <DocumentViewer
          fileName={viewingDocument.fileName}
          fileUrl={viewingDocument.fileUrl}
          onClose={handleCloseViewer}
          documentId={viewingDocument.documentId}
        />
      )}
    </div>
  );
};

export default Dashboard;