import { ArrowLeft, Lightbulb, Zap, CheckCircle2, Lock, HelpCircle, AlertCircle, FileText, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const HelpPage = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const [activeSection, setActiveSection] = useState<string>("overview");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const sections = [
        { id: "overview", label: "Vue d'ensemble", icon: Lightbulb },
        { id: "guide", label: "Guide professionnels", icon: Zap },
        { id: "documents", label: "Gestion documentaire", icon: FileText },
        { id: "security", label: "Sécurité & Conformité", icon: Lock },
        { id: "faq", label: "FAQ Pro", icon: HelpCircle },
        { id: "support", label: "Support", icon: AlertCircle }
    ];

    const faqItems = [
        {
            question: "Comment télécharger des documents professionnels ?",
            answer: "Accédez à la page d'accueil et utilisez la zone de dépôt pour importer vos fichiers. Sélectionnez la catégorie appropriée (Contrats, Factures, RH, Légal, etc.) et confirmez l'ajout. Les documents sont immédiatement disponibles pour votre équipe selon les permissions."
        },
        {
            question: "Comment s'organiser en tant qu'entreprise ?",
            answer: "Utilisez les catégories pour structurer vos documents : par département, par type, par année fiscale, etc. Nommez vos fichiers de manière cohérente (ex: 2025-02-06_Facture_Client_ABC.pdf) pour une gestion optimale et une recherche facile."
        },
        {
            question: "Pouvez-vous vérifier nos documents archivés ?",
            answer: "Oui. Classifiez vos documents archivés dans une catégorie dédiée (ex: 'Documents archivés') avec l'année ou la période concernée. Tous les documents restent accessibles et consultables à tout moment conformément à vos obligations légales."
        },
        {
            question: "Comment garantir la conformité légale ?",
            answer: "Formulama exige une authentification sécurisée et conserve un historique des accès. Retrouvez chaque document avec sa date d'ajout précise. Pour la conformité complète, consultez nos partenaires légaux et assurez-vous de respecter les périodes de rétention obligatoires."
        },
        {
            question: "Puis-je modifier ou supprimer des documents ?",
            answer: "Actuellement, vous pouvez visualiser l'ensemble de vos documents. Pour les modifications, téléchargez une version mise à jour avec une nomenclature claire (ex: v2) pour maintenir une traçabilité complète."
        },
        {
            question: "Quels documents dois-je conserver ?",
            answer: "Cela dépend de votre secteur d'activité et de vos obligations légales. Généralement : factures (6 ans), contrats (durée + 1 an), fiches de paie (5 ans minimum). Consultez un expert comptable ou juridique pour vos besoins spécifiques."
        },
        {
            question: "Qu'advient-il de nos données après suppression de compte ?",
            answer: "Les données sont supprimées après une période de rétention légale. Pour des détails spécifiques sur les politiques de rétention, veuillez contacter notre support ou consulter nos conditions d'utilisation."
        },
        {
            question: "L'application est-elle compatible avec nos systèmes existants ?",
            answer: "Formulama fonctionne comme une application web indépendante. Vous pouvez générer des copies de vos documents et les intégrer à vos systèmes existants. Pour une intégration personnalisée, contactez notre équipe technique."
        },
        {
            question: "Comment gérer les accès des collaborateurs ?",
            answer: "Chaque collaborateur dispose d'un compte personnel sécurisé. Contactez un administrateur pour obtenir les détails d'accès. Une authentification sécurisée garantit que seuls les autorisés peuvent consulter les documents."
        },
        {
            question: "Quelle est la politique de sauvegarde ?",
            answer: "Vos documents sont sauvegardés régulièrement dans une base de données SQLite sécurisée. Pour des besoins spécifiques de sauvegarde ou de récupération, consultez nos services de support. Nous recommandons toujours une sauvegarde locale supplémentaire."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* En-tête */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link 
                            to="/dashboard?view=home" 
                            className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Retour</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Centre d'Aide Pro</h1>
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            ) : (
                                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-6 p-4 sm:p-6 lg:p-8">
                    
                    {/* Barre latérale de navigation */}
                    <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block md:w-64 flex-shrink-0`}>
                        <nav className="sticky top-20 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 space-y-1">
                            {sections.map(section => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => {
                                            setActiveSection(section.id);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                                            activeSection === section.id
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-sm">{section.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Contenu principal */}
                    <main className="flex-1">
                        {/* Vue d'ensemble */}
                        {activeSection === "overview" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Formulama Pro</h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">Solution professionelle de gestion documentaire</p>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border-l-4 border-blue-600">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                        Formulama Pro aide votre entreprise à gérer efficacement tous ses documents : conformité légale, archivage sécurisé, traçabilité complète.
                                    </p>
                                    
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">Organisé</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Structure professionnelle par catégories</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30">
                                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">Sécurisé</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Authentification et chiffrement</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                                    <CheckCircle2 className="h-6 w-6 text-purple-600" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">Conforme</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Traçabilité et attestations</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                                    <CheckCircle2 className="h-6 w-6 text-orange-600" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">Professionnel</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Audit et rapports</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Guide d'utilisation */}
                        {activeSection === "guide" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Guide professionnel</h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">Optimisez votre gestion documentaire en 5 étapes</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { num: 1, title: "Se connecter sécurité", desc: "Utilisez vos identifiants professionnels. Chaque compte est isolé et permet une séparation claire des responsabilités.", color: "blue" },
                                        { num: 2, title: "Structurer votre organisation", desc: "Créez des catégories : Contrats, Factures, RH, Légal, Archivés. Reflet de votre structure organisationnelle.", color: "indigo" },
                                        { num: 3, title: "Importer vos documents", desc: "Téléchargez via la zone de dépôt. Utilisez une nomenclature standardisée dans votre entreprise.", color: "purple" },
                                        { num: 4, title: "Consulter et vérifier", desc: "Accédez par catégorie. Vérifiez les dates et les détails pour vos opérations quotidiennes.", color: "pink" },
                                        { num: 5, title: "Gérer votre compte", desc: "Mettez à jour les informations, gérez les préférences et les paramètres de sécurité.", color: "rose" }
                                    ].map(step => (
                                        <div key={step.num} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-600 hover:shadow-lg transition-shadow">
                                            <div className="flex gap-4">
                                                <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-${step.color}-100 dark:bg-${step.color}-900/30 flex items-center justify-center font-bold text-${step.color}-600`}>
                                                    {step.num}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{step.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gestion documentaire */}
                        {activeSection === "documents" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestion documentaire professionnelle</h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">Meilleures pratiques pour votre entreprise</p>
                                </div>

                                <div className="grid gap-4">
                                    {[
                                        { title: "Types acceptés", content: "PDF, DOCX, XLSX, PNG, JPG. Conserver les formats originaux pour l'intégrité et la conformité légale." },
                                        { title: "Catégories recommandées", content: "Contrats, Factures, RH/Paie, Légal, Propriété Intellectuelle, Archivés. Adapté à votre structure." },
                                        { title: "Nomenclature standardisée", content: "Format: YYYY-MM-DD_Type_Description (ex: 2025-02-06_Facture_Client_ABC.pdf)" },
                                        { title: "Traçabilité & historique", content: "Chaque document conserve sa date d'ajout pour l'audit et la conformité légale." }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">{item.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sécurité & Conformité */}
                        {activeSection === "security" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sécurité et conformité</h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">Au cœur de nos priorités</p>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border-l-4 border-green-600">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Lock className="w-5 h-5 text-green-600" />
                                        Mesures de sécurité
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            "Authentification sécurisée par compte personnel",
                                            "Chiffrement des données sensibles",
                                            "Stockage SQLite sécurisé",
                                            "Séparation et isolation des comptes",
                                            "Sauvegardes régulières et redondance",
                                            "Accès limité avec traçabilité"
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="text-green-600 font-bold">✓</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border-l-4 border-yellow-600">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Conformité légale</h3>
                                    <ul className="space-y-3">
                                        {[
                                            "Traçabilité documentaire avec dates précises",
                                            "Historique complet des ajouts",
                                            "Respect des périodes de rétention légales",
                                            "Structure conforme à vos obligations",
                                            "Documents prêts pour audit"
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="text-yellow-600 font-bold">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border-l-4 border-red-600">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recommandations</h3>
                                    <ul className="space-y-3">
                                        {[
                                            "Mot de passe complexe et unique",
                                            "Rotation régulière des identifiants",
                                            "Déconnexion après chaque utilisation",
                                            "Éviter les appareils publics",
                                            "Signaler les accès anormaux immédiatement"
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="text-red-600 font-bold">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* FAQ Pro */}
                        {activeSection === "faq" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">FAQ Professionnelle</h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">Questions spécifiques aux entreprises</p>
                                </div>

                                <div className="space-y-3">
                                    {faqItems.map((item, index) => (
                                        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                            <button
                                                onClick={() => toggleFAQ(index)}
                                                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                            >
                                                <span className="font-semibold text-gray-900 dark:text-white">{item.question}</span>
                                                <span className={`transform transition-transform text-blue-600 ${openFAQ === index ? 'rotate-180' : ''}`}>▼</span>
                                            </button>
                                            {openFAQ === index && (
                                                <div className="px-6 pb-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                                                    {item.answer}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Support */}
                        {activeSection === "support" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Support professionnel</h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">Nous sommes à votre service</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border-l-4 border-blue-600">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5 text-blue-600" />
                                            Dépannage rapide
                                        </h3>
                                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                            <li>• Reconnexion au compte</li>
                                            <li>• Vider le cache du navigateur</li>
                                            <li>• Navigateur à jour</li>
                                            <li>• Connexion internet stable</li>
                                        </ul>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border-l-4 border-purple-600">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Assistance avancée</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            Pour les questions de conformité légale, d'intégration système ou de support technique avancé.
                                        </p>
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                                            Contacter le support
                                        </button>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border-l-4 border-indigo-600">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Audit & Conformité</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Générez des rapports de vos documents archivés. Pour des audits spécifiques ou des certifications, consultez notre équipe.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-8 border border-blue-200 dark:border-blue-700/50">
                                    <div className="flex items-start gap-4">
                                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Partenaire de confiance</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Formulama Pro : Sécurité, conformité et transparence pour votre entreprise.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;