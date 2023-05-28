import numpy as np
import matplotlib.pyplot as plt

def princearg(phi):
	return phi - 2*np.pi*np.round(phi/(2*np.pi))

N = 64
f = 4.1
phi = 0
hop = 20
t = np.array(range(2*N)) / N
y = np.cos(2 * np.pi * f * t + phi)
y1 = y[:N]
y2 = y[hop:hop+N]
# y = y * np.hanning(N)

Y1 = np.fft.rfft(y1)
S1 = np.abs(Y1)

Y2 = np.fft.rfft(y2)
S2 = np.abs(Y2)

# print(phi)
# print(np.angle(Y1[int(f)]))
# print(0.7 * np.angle(Y1[int(f)]) + 0.3 * np.angle(Y1[int(f)+1]))


expected_phase = phi + hop * 2 * np.pi / (N/f)
print(princearg(expected_phase))
print(np.angle(Y2[int(f)]))

# print(
# 	(princearg(np.angle(Y2[int(f)]) - np.angle(Y1[int(f)] - hop * 2 * np.pi / (N/int(f)))) + 0*np.pi)
# 	# / (2*np.pi) * (N/hop)
# )
# print(princearg(np.angle(Y2[int(f)+1]) - np.angle(Y1[int(f)+1])) / (2*np.pi) * (N/f))

plt.subplot(3,2,1)
plt.plot(y1)
plt.subplot(3,2,3)
plt.plot(S1, 'o')
plt.subplot(3,2,5)
plt.plot(np.angle(Y1), 'o')

plt.subplot(3,2,2)
plt.plot(y2)
plt.subplot(3,2,4)
plt.plot(S2, 'o')
plt.subplot(3,2,6)
plt.plot(np.angle(Y2), 'o')

plt.show()
