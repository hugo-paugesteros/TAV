import numpy as np

np.float_ = np.float64

import scipy.signal

scipy.signal.hamming = scipy.signal.windows.hamming
scipy.signal.hann = scipy.signal.windows.hann
scipy.signal.blackman = scipy.signal.windows.blackman
import nussl

# Load audio
audio_path = "../audio/ievan_excerpt.wav"  # Replace with your audio file path
audio_file = nussl.AudioSignal(audio_path)

# Separate harmonic and percussive components
separator = nussl.separation.primitive.HPSS(audio_file, mask_type="soft")
separator.run()
harmonic_signal, percussive_signal = separator.make_audio_signals()

# Write components to wav files
harmonic_signal.write_audio_to_file("harmonic_component.wav")
percussive_signal.write_audio_to_file("percussive_component.wav")
