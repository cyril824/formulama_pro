import React, { useState, useEffect } from 'react';
import { Trash2, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { useDocumentContext } from '@/context/DocumentContext';
import { Badge } from '@/components/ui/badge';
import SignaturePad from '@/components/SignaturePad';
import DocumentViewer from '@/components/DocumentViewer';

// CORRECTION CRITIQUE : Utilisation stricte de localhost pour éviter les blocages inter-IP
const API_BASE_URL = '';

// --- INTERFACE MISE À JOUR POUR CORRESPONDRE À LA DB SQLITE ---
interface DocumentItem {
    id: number;
    nom_fichier: string;
    chemin_local: string;
    date_ajout: string;
    categorie?: string;
    is_signed?: boolean | number;
    is_filled?: boolean | number;
}

// ----------------------------------------------------------------------
// 1. Composant DocumentsPage
// ----------------------------------------------------------------------
interface DocumentsPageProps {
    currentCategory: string; // La catégorie à filtrer (ex: "Documents archivés")
    refreshKey: number;      // Clé pour forcer le rafraîchissement
    onDocumentClick: (doc: DocumentItem) => void; // Fonction pour ouvrir le visualiseur
}

const DocumentsPage: React.FC<DocumentsPageProps> = ({ currentCategory, refreshKey, onDocumentClick }) => {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    
    // États pour le menu contextuel
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [showSignaturePad, setShowSignaturePad] = useState(false);
    const [viewingDocument, setViewingDocument] = useState<{ fileName: string; fileUrl: string; documentId: number } | null>(null);

    // Hook pour notifier les changements de documents
    const { notifyDocumentChange } = useDocumentContext();

    // URL de l'API Flask (Port 5001) pour la récupération
    const FETCH_API_URL = `${API_BASE_URL}/api/documents/${currentCategory}`;
    // URL de l'API Flask pour la suppression
    const DELETE_API_URL_BASE = `${API_BASE_URL}/api/documents`;

    // Fonction pour forcer le rafraîchissement après une action (suppression ou ajout)
    const [localRefresh, setLocalRefresh] = useState(0);

    const forceRefresh = () => {
        setLocalRefresh(prev => prev + 1);
    };

    // Fonction pour formater la date
    const formatDisplayDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch (e) {
            return dateString.split(' ')[0] || 'Date inconnue';
        }
    };

    // Logique pour vérifier si un document est signé
    const isSigned = (doc: DocumentItem) => doc.is_signed === true || doc.is_signed === 1;

    // Logique pour vérifier si un document est rempli
    const isFilled = (doc: DocumentItem) => doc.is_filled === true || doc.is_filled === 1;

    // Handlers pour le menu contextuel
    const handleSignDocument = async () => {
        if (!selectedDoc) return;
        setShowContextMenu(false);
        setShowSignaturePad(true);
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
            // Appeler l'API pour marquer le document comme rempli
            const response = await fetch(`${API_BASE_URL}/api/documents/${selectedDoc.id}/fill`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du document');
            }

            console.log('Document marqué comme rempli');
            alert(`Document "${selectedDoc.nom_fichier}" a été marqué comme rempli!`);
            setShowContextMenu(false);
            setSelectedDoc(null);
            // Rafraîchir la liste
            forceRefresh();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors du remplissage du document');
        }
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
            forceRefresh();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la signature du document');
        }
    };

    const handleCloseViewer = () => {
        setViewingDocument(null);
    };

    // --- LOGIQUE DE SUPPRESSION ---
    const handleDelete = async (docId: number, docName: string) => {
        // Remplacer window.confirm() par une modale personnalisée dans une version finale.
        // Utilisation de console.log pour respecter les contraintes du Canvas (pas d'alert/confirm)
        if (!window.confirm(`Confirmation de suppression pour ${docName}.`)) {
             console.log("Suppression annulée par l'utilisateur.");
             return;
        }

        setIsDeleting(true);
        try {
            // 🚨 Appel DELETE à l'API sur le port 5001
            const response = await fetch(`${DELETE_API_URL_BASE}/${docId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log(`Document ${docId} supprimé avec succès.`);
                // 1. Mise à jour immédiate du DOM (pour une sensation de rapidité)
                setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== docId));
                // 2. Notifier que des documents ont changé
                notifyDocumentChange();
                // 3. Forcer un rafraîchissement complet (en cas d'erreur de cache)
                forceRefresh();
            } else {
                // Tente de lire l'erreur renvoyée par Flask
                const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
                throw new Error(`Échec de la suppression sur le serveur: ${errorData.error}`);
            }
        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
            // Utilisation de console.error pour le débogage
            console.error(`Erreur de suppression: ${err instanceof Error ? err.message : 'Connexion impossible'}`);
        } finally {
            setIsDeleting(false);
        }
    };
    // --- FIN LOGIQUE DE SUPPRESSION ---

    // --- LOGIQUE DE CHARGEMENT DES DONNÉES ---
    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                // 🚨 Appel GET à l'API sur le port 5001
                const response = await fetch(FETCH_API_URL);

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const data: any[] = await response.json();

                // Mappage des données (supporte tuples et dictionnaires)
                const documentsMapped: DocumentItem[] = data.map(item => {
                    // Si c'est un tuple (array)
                    if (Array.isArray(item)) {
                        return {
                            id: item[0],
                            nom_fichier: item[1],
                            chemin_local: item[2],
                            categorie: item[3],
                            date_ajout: item[4],
                            is_signed: item[5],
                            is_filled: item[6]
                        };
                    }
                    // Si c'est un dictionnaire (objet)
                    return {
                        id: item.id,
                        nom_fichier: item.nom_fichier,
                        chemin_local: item.chemin_local,
                        categorie: item.categorie,
                        date_ajout: item.date_ajout,
                        is_signed: item.is_signed,
                        is_filled: item.is_filled
                    };
                });

                setDocuments(documentsMapped);
                setError(null);
            } catch (err) {
                console.error("Erreur de récupération de l'API:", err);
                setError(`Impossible de charger les documents pour ${currentCategory}. Le serveur Flask est-il démarré ?`);
                setDocuments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [currentCategory, refreshKey, localRefresh]); // Déclenchement au changement de catégorie, de clé globale, ou après suppression

    // Rendu d'affichage
    if (loading) return <div className="text-center py-8 text-indigo-600 text-sm sm:text-base">Chargement des documents...</div>;
    if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded relative mt-4 text-xs sm:text-sm">Erreur: {error}</div>;

    return (
        <div className="space-y-4 pt-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="truncate">{currentCategory} ({documents.length} documents)</span>
            </h2>

            <div className="grid gap-3">
                {documents.length > 0 ? (
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
                                className="bg-white dark:bg-gradient-to-r dark:from-slate-800 dark:via-indigo-900/20 dark:to-slate-800 rounded-xl p-4 shadow-md dark:shadow-lg dark:shadow-indigo-900/20 hover:shadow-lg dark:hover:shadow-indigo-900/30 transition-all duration-300 cursor-pointer w-full max-w-full overflow-hidden border border-transparent dark:border-indigo-500/20 dark:hover:border-indigo-500/40"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-gradient-to-br dark:from-indigo-600/30 dark:to-indigo-800/40 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                                    </div>

                                    <div className="flex-1 min-w-0 w-full max-w-full">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-3 w-full max-w-full">
                                            <div className="flex-1 min-w-0 w-full max-w-full">
                                                <h3 className="font-medium text-gray-900 dark:text-indigo-100 break-words text-xs sm:text-base whitespace-normal">
                                                    {doc.nom_fichier}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-indigo-300/50 mt-0.5">
                                                    {formatDisplayDate(doc.date_ajout)}
                                                </p>
                                            </div>

                                            {/* Badges pour les états "Signé" / "Non Signé" et "Rempli" / "À remplir" */}
                                            <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                                                {/* Badge Rempli/À remplir */}
                                                <Badge
                                                    variant={isFilled(doc) ? "default" : "secondary"}
                                                    className={`flex items-center gap-1 transition-all duration-300 flex-shrink-0 text-xs h-fit w-fit ${
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
                                                    className={`flex items-center gap-1 transition-all duration-300 flex-shrink-0 text-xs h-fit w-fit ${
                                                        isSigned(doc)
                                                            ? "bg-green-600 hover:bg-green-700 dark:bg-emerald-600/80 dark:hover:bg-emerald-600"
                                                            : "bg-red-600 hover:bg-red-700 dark:bg-red-600/60 dark:hover:bg-red-600/70"
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
                ) : (
                    <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
                        Aucun document n'a encore été ajouté dans cette catégorie.
                    </div>
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

export default DocumentsPage;