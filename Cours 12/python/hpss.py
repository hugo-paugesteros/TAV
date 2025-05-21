import librosa
import soundfile as sf

# Load audio file
y, sr = librosa.load("../audio/believe.wav")

# Compute harmonic and percussive components
y_harmonic, y_percussive = librosa.effects.hpss(y, kernel_size=(11, 61), margin=1.5)

# Write harmonic component to a wav file
sf.write("harmonic.wav", y_harmonic, sr)

# Write percussive component to a wav file
sf.write("percussive.wav", y_percussive, sr)
