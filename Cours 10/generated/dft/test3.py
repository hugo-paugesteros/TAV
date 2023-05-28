import numpy as np
import matplotlib.pyplot as plt

def princearg(phi):
	return phi - 2*np.pi*np.round(phi/(2*np.pi))

def mod2pi(phi):
	return phi - 2*np.pi*np.floor(phi/(2*np.pi))


N = 128
f = 4.5
phi = 0
hop = 32
t = np.array(range(2*N)) / N
y = np.cos(2 * np.pi * f * t + phi)
y1 = y[:N]
y2 = y[hop:hop+N]
# y = y * np.hanning(N)

Y1 = np.fft.rfft(y1)
S1 = np.abs(Y1)

Y2 = np.fft.rfft(y2)
S2 = np.abs(Y2)

k = int(f)
theta2 = np.angle(Y2[k])
theta1 = np.angle(Y1[k])
# theta1 = phi + hop * 2 * np.pi / (N/k)

fn = (princearg(theta2 - theta1) + 2*np.pi*1) / (2*np.pi*(hop)/N)

print(fn)

t1 = np.array(range(N)) / N
cos1 = np.cos(2*np.pi*k*t1 + np.angle(Y1[k]))
t2 = np.array(range(hop, hop + N)) / N
cos2 = np.cos(2*np.pi*k*t1 + np.angle(Y2[k]))
cosn = np.cos(2*np.pi*fn*t1 + np.angle(Y1[k]))

plt.plot(t1, cos1)
plt.plot(t2, cos2)
plt.plot(t1, cosn)
plt.axvline(x=hop/N)
plt.axhline(y=cos1[0])
# plt.plot(t, y)
plt.show()