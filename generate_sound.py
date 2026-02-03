"""
Script pour générer un son de notification professionnelle
"""
import wave
import struct
import math

def generate_notification_sound(filename, duration=0.6):
    """
    Génère un son de notification de succès avec trois notes montantes (La, Do, Mi)
    pour un effet positif et confirmant
    """
    sample_rate = 44100
    num_samples = int(sample_rate * duration)
    
    # Fréquences montantes - effet positif
    freq1 = 440.00   # La4 (grave)
    freq2 = 523.25   # Do5 (moyen)
    freq3 = 659.25   # Mi5 (aigu)
    
    # Trois notes successives pour un effet ascendant positif
    note1_duration = 0.15
    note2_duration = 0.20
    note3_duration = 0.25
    
    note1_samples = int(sample_rate * note1_duration)
    note2_samples = int(sample_rate * note2_duration)
    note3_samples = int(sample_rate * note3_duration)
    
    samples = []
    
    for i in range(num_samples):
        t = i / sample_rate
        
        # Déterminer quelle note jouer
        if i < note1_samples:
            # Première note (La4)
            freq = freq1
            local_time = i / note1_samples
            # Envelope rapide avec decay
            envelope = max(0, 1.0 - local_time * 1.5)
        elif i < note1_samples + note2_samples:
            # Deuxième note (Do5)
            freq = freq2
            local_i = i - note1_samples
            local_time = local_i / note2_samples
            envelope = max(0, 1.0 - local_time * 1.3)
        else:
            # Troisième note (Mi5)
            freq = freq3
            local_i = i - note1_samples - note2_samples
            local_time = local_i / note3_samples if note3_samples > 0 else 0
            envelope = max(0, 1.0 - local_time * 1.2)
        
        # Générer le son sinusoïdal
        sample = 0.7 * math.sin(2 * math.pi * freq * t) * envelope
        
        # Limiter pour éviter la distorsion
        sample = max(-1.0, min(1.0, sample))
        
        samples.append(sample)
    
    # Convertir en WAV d'abord
    wav_filename = filename.replace('.mp3', '.wav')
    
    with wave.open(wav_filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)   # 16-bit
        wav_file.setframerate(sample_rate)
        
        # Convertir les samples en bytes
        for sample in samples:
            value = int(sample * 32767)  # Convertir en 16-bit signed
            wav_file.writeframes(struct.pack('h', value))
    
    print(f"Fichier WAV créé: {wav_filename}")
    
    # Convertir WAV en MP3 si possible
    try:
        import subprocess
        result = subprocess.run([
            'ffmpeg', '-i', wav_filename, '-q:a', '9', '-y', filename
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"Fichier MP3 créé avec succès: {filename}")
            # Supprimer le fichier WAV temporaire
            import os
            os.remove(wav_filename)
        else:
            print(f"Avertissement: ffmpeg non trouvé ou erreur de conversion")
            print(f"Utilisation du fichier WAV à la place: {wav_filename}")
    except Exception as e:
        print(f"Avertissement: Impossible de convertir en MP3 ({e})")
        print(f"Utilisation du fichier WAV à la place: {wav_filename}")

if __name__ == '__main__':
    output_path = r'c:\Users\cyril\Documents\ENSITECH\PROJET MINI ENTREPRISE\formulama_vite\public\sounds\notification.mp3'
    generate_notification_sound(output_path, duration=0.6)
