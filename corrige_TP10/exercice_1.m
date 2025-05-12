clear;
close all;
taille_ecran = get(0,'ScreenSize');
L = taille_ecran(3);
H = taille_ecran(4);

% Lecture d'un fichier audio :
[y, f_ech] = audioread('Audio/audible.wav');
y = mean(y, 2);

% Calcul de la transformée de Fourier à court terme :
N = 2048;					% Nombre d'échantillons de la fenêtre
D = 512;					% Nombre d'échantillons entre positions successives de la fenêtre
fenetre = 'hann';				% Type de la fenêtre : 'rect' ou 'hann'
Y = TFCT(y, f_ech, N, D, fenetre);

% Affichage du sonagramme en décibels :
figure(Name='Transformée de  Fourier à court terme', Position=[0.4*L,0,0.6*L,0.6*H]);
valeurs_t = (0 : size(Y, 2) - 1) * D / f_ech;	% Instant correspondant à chaque colonne
valeurs_f = (0 : size(Y, 1) - 1) * f_ech / N;	% Fréquence correspondant à chaque ligne
S = 20 * log10(abs(Y));				% Module au carré de la TFCT en décibels
imagesc(valeurs_t, valeurs_f, S);
axis xy;
set(gca, FontSize=20);
xlabel('Temps ($s$)', Interpreter='Latex', FontSize=30);
ylabel('Frequence ($Hz$)', Interpreter='Latex', FontSize=30);

% Calcul de la transformée de Fourier inverse :
signal_restitue = ITFCT(Y, f_ech, N, D, fenetre);

% Lecture :
player = audioplayer(signal_restitue, f_ech);

% Animation :
h = xline(valeurs_t(1),'LineWidth',3,'Color','r');
player.TimerFcn = {@update player, f_ech, h};
play(player);

function update(obj, event, player, f_ech, h)
	n = player.CurrentSample;
	h.Value = n / f_ech;
end
