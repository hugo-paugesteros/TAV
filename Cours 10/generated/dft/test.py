import numpy as np
import matplotlib.pyplot as plt

N = 32
f = 7.5
t = np.array(range(N)) / N
y = np.sin(2 * np.pi * f * t)
y = y * np.hanning(N)

Y = np.fft.rfft(y)
S = np.abs(Y)
print(np.real(Y))

plt.subplot(2,1,1)
plt.plot(y)
plt.subplot(2,1,2)
plt.plot(S, 'o')
plt.show()