# Système de Sons de Notification - Documentation

## Fonctionnalités Ajoutées

### 1. Contexte Audio (`AudioContext.tsx`)
Un contexte React qui gère :
- **L'activation/désactivation** des effets sonores
- **Le volume** des effets sonores (0-100%)
- **La lecture** des fichiers audio
- **La persistance** des paramètres dans localStorage

### 2. Paramètres dans Settings
La page de paramètres maintenant propose :
- **Toggle** pour activer/désactiver les effets sonores
- **Barre de volume** (range slider) pour ajuster le volume de 0 à 100%
- **Bouton de test** pour tester le son de notification avec le volume actuel

### 3. Intégration dans SignaturePad
Lors de la **validation d'une signature de document**, un son de notification est joué automatiquement si :
- Les effets sonores sont activés
- Un volume > 0 est défini

### 4. Fichier Audio
Un fichier audio `notification.mp3` a été généré à `public/sounds/notification.mp3` avec :
- **Durée** : 0.6 secondes
- **Fréquences** : Do5 (523.25 Hz) et Mi5 (659.25 Hz)
- **Enveloppe ADSR** : Attack, Decay, Sustain, Release pour un son naturel et plaisant
- **Format** : MP3 compressé pour rapidité de chargement

## Utilisation du Hook `useAudio`

### Importer le hook
```tsx
import { useAudio } from '@/context/AudioContext';
```

### Utilisation basique
```tsx
const { soundEffectsEnabled, soundVolume, playSoundEffect } = useAudio();

// Jouer un son
playSoundEffect('notification');

// Vérifier si activé
if (soundEffectsEnabled) {
  // ...
}

// Accéder au volume
console.log(soundVolume); // 0-100
```

### Méthodes disponibles
- `soundEffectsEnabled` : booléen - État d'activation des effets sonores
- `soundVolume` : nombre (0-100) - Volume actuel
- `toggleSoundEffects()` : fonction - Basculer l'état des effets sonores
- `setSoundVolume(volume: number)` : fonction - Définir le volume (sera limité entre 0 et 100)
- `playSoundEffect(soundName: string)` : fonction - Jouer un son depuis `/public/sounds/{soundName}.mp3`

## Ajouter Nouveaux Sons

1. **Créer ou ajouter un fichier audio** dans `public/sounds/` (formats supportés : `.mp3`, `.wav`, `.ogg`)
2. **Utiliser le hook** pour le jouer :
   ```tsx
   playSoundEffect('success'); // Joue /public/sounds/success.mp3
   ```

## Persistance des Paramètres

Les paramètres audio sont automatiquement sauvegardés dans `localStorage` :
- `soundEffectsEnabled` : booléen
- `soundVolume` : nombre (0-100)

Ils sont restaurés au rechargement de la page.

## Notes Technique

### Volume par défaut
- Par défaut : **70%** pour un équilibre entre audibilité et discrétion

### Gestion des erreurs
Le système gère gracieusement les cas où :
- Le fichier audio n'existe pas
- Les effets sonores sont désactivés
- Le volume est à 0

## Fichiers Modifiés/Créés

- ✅ `src/context/AudioContext.tsx` - Nouveau contexte audio
- ✅ `src/pages/Settings.tsx` - Ajout de la barre de volume
- ✅ `src/components/SignaturePad.tsx` - Intégration du son de validation
- ✅ `src/App.tsx` - Ajout du AudioProvider
- ✅ `public/sounds/notification.mp3` - Fichier audio généré
- ℹ️ `generate_sound.py` - Script de génération du son (non nécessaire pour la production)
