import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Bell,
  Lock,
  Eye,
  Moon,
  Sun,
  Volume2,
  Shield,
  LogOut,
  Trash2,
  Globe,
  FileText,
  Users,
  Zap,
  BarChart3,
  Workflow,
  Settings as SettingsIcon,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useAudio } from "@/context/AudioContext";

interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  category: "documents" | "collaboration" | "security" | "automation" | "analytics";
  premium?: boolean;
}

interface Settings {
  notifications: boolean;
  twoFactor: boolean;
  emailUpdates: boolean;
  dataSaving: boolean;
}

interface ProFeatures {
  [key: string]: FeatureToggle;
}

const DEFAULT_PRO_FEATURES: ProFeatures = {
  templateForms: {
    id: "templateForms",
    name: "Modèles de formulaires",
    description: "Créer des templates réutilisables pour gagner du temps sur les saisies répétitives",
    icon: <FileText className="w-5 h-5" />,
    enabled: true,
    category: "documents",
  },
  autoReminders: {
    id: "autoReminders",
    name: "Relances automatiques",
    description: "Envoyer des rappels auto après 7 jours si formulaire non complété",
    icon: <Bell className="w-5 h-5" />,
    enabled: true,
    category: "documents",
  },
  versionHistory: {
    id: "versionHistory",
    name: "Historique des versions",
    description: "Garder la trace de tous les changements (qui a modifié, quand)",
    icon: <FileText className="w-5 h-5" />,
    enabled: true,
    category: "documents",
  },
  duplicateDetection: {
    id: "duplicateDetection",
    name: "Détection de doublons",
    description: "Identifier automatiquement les formulaires en doublon",
    icon: <AlertCircle className="w-5 h-5" />,
    enabled: false,
    category: "documents",
    premium: true,
  },
  teamAccess: {
    id: "teamAccess",
    name: "Accès équipe simple",
    description: "Permettre à collègues de consulter/modifier les dossiers ensemble",
    icon: <Users className="w-5 h-5" />,
    enabled: true,
    category: "collaboration",
  },
  activityLog: {
    id: "activityLog",
    name: "Journal d'activité",
    description: "Voir qui a ouvert, modifié, finalisé chaque formulaire",
    icon: <Shield className="w-5 h-5" />,
    enabled: true,
    category: "collaboration",
  },
  notificationsSteps: {
    id: "notificationsSteps",
    name: "Alertes étapes importantes",
    description: "Notifier responsable quand formulaire complété ou modifié",
    icon: <Bell className="w-5 h-5" />,
    enabled: false,
    category: "collaboration",
  },
  bulkActions: {
    id: "bulkActions",
    name: "Actions en masse",
    description: "Archiver/Supprimer plusieurs documents d'un coup",
    icon: <Zap className="w-5 h-5" />,
    enabled: false,
    category: "documents",
    premium: true,
  },
  basicExport: {
    id: "basicExport",
    name: "Export CSV/Excel",
    description: "Exporter les données pour analyse (complétude, délais, etc)",
    icon: <BarChart3 className="w-5 h-5" />,
    enabled: true,
    category: "analytics",
  },
  autoValidation: {
    id: "autoValidation",
    name: "Validation automatique",
    description: "Vérifier que tous les champs obligatoires sont remplis",
    icon: <CheckCircle className="w-5 h-5" />,
    enabled: false,
    category: "documents",
  },
};

type TabType = "preferences" | "features" | "account" | "data";

const Settings = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const { soundEffectsEnabled, soundVolume, toggleSoundEffects, setSoundVolume, playSoundEffect } = useAudio();
  const [currentTab, setCurrentTab] = useState<TabType>("preferences");
  const [proFeatures, setProFeatures] = useState<ProFeatures>(DEFAULT_PRO_FEATURES);
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    twoFactor: false,
    emailUpdates: true,
    dataSaving: true,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleSetting = (key: keyof Settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleProFeature = (featureId: string) => {
    setProFeatures(prev => ({
      ...prev,
      [featureId]: {
        ...prev[featureId],
        enabled: !prev[featureId].enabled,
      },
    }));
  };

  const handleToggleSoundEffects = () => {
    toggleSoundEffects();
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    alert("Mot de passe changé avec succès");
    setShowPasswordModal(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogoutAllDevices = () => {
    alert("Déconnexion de tous les appareils effectuée");
    setShowLogoutModal(false);
    navigate("/");
  };

  const handleDeleteAllDocuments = async () => {
    try {
      const API_BASE_URL = '';
      const response = await fetch(`${API_BASE_URL}/api/documents`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert("Tous les documents ont été supprimés avec succès");
        setShowDeleteModal(false);
      } else {
        const error = await response.json();
        alert(`Erreur : ${error.error || 'Impossible de supprimer les documents'}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert("Erreur de connexion au serveur");
    }
  };

  // Component réutilisable pour les toggles
  const SettingToggle = ({ label, description, enabled, onChange, icon }: any) => (
    <Card className="p-3 sm:p-6 mb-3 sm:mb-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {icon && <div className="w-5 h-5 text-primary flex-shrink-0">{icon}</div>}
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-medium text-foreground">{label}</p>
            {description && <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        <button
          onClick={onChange}
          className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
            enabled ? "bg-primary" : "bg-muted"
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              enabled ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>
    </Card>
  );

  // Component pour les features pro
  const ProFeatureCard = ({ feature }: { feature: FeatureToggle }) => (
    <Card className="p-3 sm:p-4 mb-2 cursor-pointer hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="text-primary flex-shrink-0 mt-0.5">{feature.icon}</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm sm:text-base font-medium text-foreground">{feature.name}</p>
              {feature.premium && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                  Premium
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{feature.description}</p>
          </div>
        </div>
        <button
          onClick={() => toggleProFeature(feature.id)}
          disabled={feature.premium && !feature.enabled}
          className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
            feature.enabled ? "bg-primary" : "bg-muted"
          } ${feature.premium && !feature.enabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              feature.enabled ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-[var(--shadow-soft)]">
        <div className="w-full px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg sm:text-xl font-bold text-foreground">Paramètres</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="w-full px-3 sm:px-4 py-4 sm:py-8 max-w-4xl mx-auto">
        {/* Tabs Navigation */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 border-b border-border">
          {[
            { id: "preferences" as TabType, label: "Préférences", icon: SettingsIcon },
            { id: "features" as TabType, label: "Features Pro", icon: Zap },
            { id: "account" as TabType, label: "Compte", icon: Lock },
            { id: "data" as TabType, label: "Données", icon: Trash2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap transition-colors ${
                currentTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* PREFERENCES TAB */}
        {currentTab === "preferences" && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Préférences personnelles</h2>

            <SettingToggle
              label="Notifications"
              description="Recevoir les notifications par email"
              enabled={settings.notifications}
              onChange={() => toggleSetting("notifications")}
              icon={<Bell className="w-5 h-5" />}
            />

            <SettingToggle
              label="Mode sombre"
              description="Activer le thème sombre"
              enabled={darkMode}
              onChange={toggleDarkMode}
              icon={darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            />

            <SettingToggle
              label="Mises à jour par email"
              description="Recevoir les mises à jour des produits"
              enabled={settings.emailUpdates}
              onChange={() => toggleSetting("emailUpdates")}
              icon={<Eye className="w-5 h-5" />}
            />

            {/* Sound Effects */}
            <Card className="p-3 sm:p-6 mb-3 sm:mb-4">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Volume2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-medium text-foreground">Effets sonores</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Activer les sons de notification</p>
                  </div>
                </div>
                <button
                  onClick={handleToggleSoundEffects}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                    soundEffectsEnabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      soundEffectsEnabled ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-foreground">Volume</label>
                  <span className="text-sm font-semibold text-primary">{soundVolume}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(Number(e.target.value))}
                    disabled={!soundEffectsEnabled}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: soundEffectsEnabled
                        ? `linear-gradient(to right, var(--primary) 0%, var(--primary) ${soundVolume}%, var(--muted) ${soundVolume}%, var(--muted) 100%)`
                        : undefined
                    }}
                  />
                </div>
                <button
                  onClick={() => playSoundEffect("notification")}
                  disabled={!soundEffectsEnabled}
                  className="w-full px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tester le son
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* FEATURES PRO TAB */}
        {currentTab === "features" && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">Fonctionnalités Professionnelles</h2>
              <p className="text-sm text-muted-foreground">Optimisez votre processus administratif</p>
            </div>

            {/* Impact Cards */}
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <Card className="p-4 border-green-500/30 bg-green-500/5">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">3h</p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">économisées par semaine en efficacité</p>
              </Card>
              <Card className="p-4 border-blue-500/30 bg-blue-500/5">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">95%</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">de formulaires sans erreur</p>
              </Card>
            </div>

            {/* Efficacité Administrative */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                ⚡ Efficacité Administrative
              </h3>
              {Object.values(proFeatures)
                .filter(f => f.category === "documents")
                .map(feature => (
                  <ProFeatureCard key={feature.id} feature={feature} />
                ))}
            </div>

            {/* Traçabilité & Qualité */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-500" />
                🔍 Traçabilité & Qualité
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Garder une trace complète et éviter les erreurs</p>
              {Object.values(proFeatures)
                .filter(f => f.id === "versionHistory" || f.id === "autoValidation")
                .map(feature => (
                  <ProFeatureCard key={feature.id} feature={feature} />
                ))}
            </div>

            {/* Équipe & Communication */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                👥 Équipe & Communication
              </h3>
              {Object.values(proFeatures)
                .filter(f => f.category === "collaboration")
                .map(feature => (
                  <ProFeatureCard key={feature.id} feature={feature} />
                ))}
            </div>

            {/* Reporting */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-500" />
                📊 Reporting & Données
              </h3>
              {Object.values(proFeatures)
                .filter(f => f.category === "analytics")
                .map(feature => (
                  <ProFeatureCard key={feature.id} feature={feature} />
                ))}
            </div>

            {/* Premium Banner */}
            <Card className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-purple-900 dark:text-purple-100">Fonctionnalités Premium</p>
                  <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">
                    La détection de doublons, les actions en masse et la validation automatique réduisent encore plus les erreurs et le temps perdu.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ACCOUNT TAB */}
        {currentTab === "account" && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Compte et sécurité</h2>

            <SettingToggle
              label="Authentification double facteur"
              description="Sécuriser votre compte avec 2FA"
              enabled={settings.twoFactor}
              onChange={() => toggleSetting("twoFactor")}
              icon={<Lock className="w-5 h-5" />}
            />

            <SettingToggle
              label="Sauvegarde automatique"
              description="Sauvegarder les documents automatiquement"
              enabled={settings.dataSaving}
              onChange={() => toggleSetting("dataSaving")}
              icon={<Globe className="w-5 h-5" />}
            />

            <Card onClick={() => setShowPasswordModal(true)} className="p-3 sm:p-4 mb-2 cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Lock className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-medium text-foreground">Changer le mot de passe</p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180 flex-shrink-0" />
              </div>
            </Card>

            <Card onClick={() => setShowLogoutModal(true)} className="p-3 sm:p-4 mb-2 cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <LogOut className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-medium text-foreground">Déconnecter tous les appareils</p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180 flex-shrink-0" />
              </div>
            </Card>
          </div>
        )}

        {/* DATA TAB */}
        {currentTab === "data" && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Données et confidentialité</h2>

            <Card className="p-4 bg-blue-500/5 border border-blue-500/30 mb-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">Conformité RGPD</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                    Vos données sont traitées conformément aux réglementations RGPD. Vous pouvez exporter ou supprimer vos données à tout moment.
                  </p>
                </div>
              </div>
            </Card>

            <Card onClick={() => alert("Export de vos données...")} className="p-3 sm:p-4 mb-2 cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-medium text-foreground">Exporter mes données</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Télécharger une copie de vos données (format JSON)</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            </Card>

            <Card onClick={() => setShowDeleteModal(true)} className="p-3 sm:p-4 mb-4 cursor-pointer hover:bg-red-500/5 transition-colors border-red-500/30">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Trash2 className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-medium text-foreground">Supprimer tous les documents</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Action irréversible</p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180 flex-shrink-0" />
              </div>
            </Card>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 pt-6 border-t border-border">
          <Button onClick={() => navigate("/dashboard")} className="w-full">
            Retour
          </Button>
          <Button variant="outline" className="w-full">
            Enregistrer les modifications
          </Button>
        </div>

        {/* Modal Changer le mot de passe */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <div className="p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Changer le mot de passe</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nouveau mot de passe</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 caractères"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmer le mot de passe"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowPasswordModal(false)} className="flex-1">
                      Annuler
                    </Button>
                    <Button onClick={handleChangePassword} className="flex-1">
                      Changer
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Modal Déconnecter tous les appareils */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <div className="p-6">
                <h2 className="text-lg font-bold text-foreground mb-2">Déconnecter tous les appareils ?</h2>
                <p className="text-sm text-muted-foreground mb-6">Vous serez déconnecté de tous vos appareils. Vous devrez vous reconnecter.</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowLogoutModal(false)} className="flex-1">
                    Annuler
                  </Button>
                  <Button onClick={handleLogoutAllDevices} className="flex-1">
                    Déconnecter
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Modal Supprimer tous les documents */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <div className="p-6">
                <h2 className="text-lg font-bold text-foreground mb-2">Supprimer tous les documents ?</h2>
                <p className="text-sm text-muted-foreground mb-6">Cette action est irréversible. Tous vos documents seront supprimés définitivement.</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1">
                    Annuler
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteAllDocuments} className="flex-1">
                    Supprimer
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Settings;
