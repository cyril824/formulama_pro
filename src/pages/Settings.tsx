import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bell, Lock, Eye, Moon, Sun, Volume2, Shield, LogOut, Trash2, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useAudio } from "@/context/AudioContext";

const Settings = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const { soundEffectsEnabled, soundVolume, toggleSoundEffects, setSoundVolume, playSoundEffect } = useAudio();
  const [settings, setSettings] = useState({
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

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
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

      <main className="w-full px-3 sm:px-4 py-4 sm:py-8 max-w-2xl mx-auto">
        {/* Notifications */}
        <Card className="p-3 sm:p-6 mb-3 sm:mb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Bell className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-medium text-foreground">Notifications</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Recevoir les notifications par email</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('notifications')}
              className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                settings.notifications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.notifications ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Mode sombre */}
        <Card className="p-3 sm:p-6 mb-3 sm:mb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {darkMode ? (
                <Moon className="w-5 h-5 text-primary flex-shrink-0" />
              ) : (
                <Sun className="w-5 h-5 text-primary flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-medium text-foreground">Mode sombre</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Activer le thème sombre</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                darkMode ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Authentification 2FA */}
        <Card className="p-3 sm:p-6 mb-3 sm:mb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Lock className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-medium text-foreground">Authentification double facteur</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Sécuriser votre compte avec 2FA</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('twoFactor')}
              className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                settings.twoFactor ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.twoFactor ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Mises à jour par email */}
        <Card className="p-3 sm:p-6 mb-3 sm:mb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Eye className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-medium text-foreground">Mises à jour par email</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Recevoir les mises à jour des produits</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('emailUpdates')}
              className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                settings.emailUpdates ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.emailUpdates ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Effets sonores */}
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
                soundEffectsEnabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  soundEffectsEnabled ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {/* Volume Slider - Always visible but disabled when sound effects are off */}
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
              onClick={() => playSoundEffect('notification')}
              disabled={!soundEffectsEnabled}
              className="w-full px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tester le son
            </button>
          </div>
        </Card>

        {/* Sauvegarde automatique */}
        <Card className="p-3 sm:p-6 mb-3 sm:mb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Globe className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-medium text-foreground">Sauvegarde automatique</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Sauvegarder les documents automatiquement</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('dataSaving')}
              className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                settings.dataSaving ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.dataSaving ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Compte et sécurité */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Compte et sécurité</h3>
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

        {/* Données et confidentialité */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Données et confidentialité</h3>
          <Card onClick={() => setShowDeleteModal(true)} className="p-3 sm:p-4 mb-2 cursor-pointer hover:bg-accent/50 transition-colors">
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

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button onClick={() => navigate("/dashboard")} className="w-full">
            Retour à l'accueil
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
