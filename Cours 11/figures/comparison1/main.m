close all;
clear all;

addpath('/media/hdd/Travail/Cours N7/TAV/TP10/Corrige')
addpath('/media/hdd/Travail/Cours N7/TAV/TP11/Corrige')

load parametres;

path = "../../audio/samples/Karajan.wav";
[y, f_ech] = audioread(path);
y = mean(y, 2);
y = resample(y, 8000, f_ech);
f_ech = 8000;

[Y, valeurs_t, valeurs_f] = TFCT(y, f_ech, n_fenetre, n_decalage, fenetre);
S = 20*log10(abs(Y)+eps);

[pics_t, pics_f] = pics_spectraux(S, marge_t, marge_f, seuil);

h = figure(Name='Comparaison', Position=[0.4*L,0,0.6*L,0.6*H]);
gif = false;
e_pics_t = pics_t(30:40);
e_pics_f = pics_f(30:40);

t = [];
m = [];
for i = 1:1:length(S)
% for i = 1:2
	h1 = subplot(2,1,1);
	cla(h1);
	plot(valeurs_t(pics_t), valeurs_f(pics_f), 'ro', MarkerSize=10, MarkerFaceColor='r', LineWidth=2);
	hold on;
	plot(valeurs_t(i + e_pics_t - e_pics_t(1)), valeurs_f(e_pics_f), 'bo', MarkerSize=10, Color='b', LineWidth=2);
	
	h2 = subplot(2,1,2);
	matches = sum(ismember(pics_t, i + e_pics_t - e_pics_t(1)) .* ismember(pics_f, e_pics_f));
	t = [t, valeurs_t(i)];
	m = [m, matches];
	plot(t, m)
	xlim([0 20]);
	ylim([0 12]);

	% GIF
    frame = getframe(h); 
    im = frame2im(frame); 
    [imind,cm] = rgb2ind(im,256);
    if gif == false
        gif = true;
        imwrite(imind,cm,'decalage.gif','gif', 'Loopcount',inf, 'DelayTime',0.3);
    else 
        imwrite(imind,cm,'decalage.gif','gif','WriteMode','append', 'DelayTime',0.3); 
    end
end