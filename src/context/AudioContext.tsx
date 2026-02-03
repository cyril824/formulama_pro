import React, { createContext, useContext, useState, useEffect } from 'react';

interface AudioContextType {
  soundEffectsEnabled: boolean;
  soundVolume: number; // 0-100
  toggleSoundEffects: () => void;
  setSoundVolume: (volume: number) => void;
  playSoundEffect: (soundName: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEffectsEnabled');
    return saved ? JSON.parse(saved) : true;
  });

  const [soundVolume, setSoundVolumeState] = useState(() => {
    const saved = localStorage.getItem('soundVolume');
    return saved ? JSON.parse(saved) : 50;
  });

  useEffect(() => {
    localStorage.setItem('soundEffectsEnabled', JSON.stringify(soundEffectsEnabled));
  }, [soundEffectsEnabled]);

  useEffect(() => {
    localStorage.setItem('soundVolume', JSON.stringify(soundVolume));
  }, [soundVolume]);

  const toggleSoundEffects = () => {
    setSoundEffectsEnabled(prev => !prev);
  };

  const setSoundVolume = (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(100, volume));
    setSoundVolumeState(clampedVolume);
  };

  const playSoundEffect = (soundName: string) => {
    if (!soundEffectsEnabled) return;

    try {
      const soundPath = `/app/sounds/${soundName}.mp3`;
      const audio = new Audio(soundPath);
      audio.volume = soundVolume / 100;
      
      audio.play().catch(err => {
        console.warn(`Impossible de jouer le son ${soundName}:`, err);
      });
    } catch (error) {
      console.warn(`Erreur lors de la lecture du son ${soundName}:`, error);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        soundEffectsEnabled,
        soundVolume,
        toggleSoundEffects,
        setSoundVolume,
        playSoundEffect,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio doit être utilisé dans AudioProvider');
  }
  return context;
};
