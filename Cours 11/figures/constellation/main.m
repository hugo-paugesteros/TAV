clear all;
close all;

addpath('/media/hdd/Travail/Cours N7/TAV/TP10/Corrige')
addpath('/media/hdd/Travail/Cours N7/TAV/TP11/Corrige')

load parametres;

[y, f_ech] = audioread('../../audio/transforms/original.wav');
y = resample(y, 8000, f_ech);
f_ech = 8000;
[Y,valeurs_t,valeurs_f] = TFCT(y, f_ech, n_fenetre, n_decalage, fenetre);
S = 20*log10(abs(Y)+eps);
[pics_t, pics_f] = pics_spectraux(S, eta_t, eta_f, epsilon);

[y2, f_ech] = audioread('../../audio/transforms/etirement_temporel.wav');
y2 = resample(y2, 8000, f_ech);
f_ech = 8000;
[Y,valeurs_t2,valeurs_f2] = TFCT(y2, f_ech, n_fenetre, n_decalage, fenetre);
S = 20*log10(abs(Y)+eps);
[pics_t2, pics_f2] = pics_spectraux(S, eta_t, eta_f, epsilon);

figure();
plot(valeurs_t(pics_t), valeurs_f(pics_f), 'r.', MarkerSize=30);
hold on;
plot(valeurs_t2(pics_t2), valeurs_f2(pics_f2), 'b.', MarkerSize=15);
hold on;
matches = find(ismember([pics_t, pics_f], [pics_t2, pics_f2], 'rows'));
plot(valeurs_t(pics_t(matches)), valeurs_f(pics_f(matches)), 'g+', MarkerSize=15);
legend('Original', 'Bruit Parole', 'Matches (TP)');
TP = length(matches);
FN = length(pics_t) - TP;
FP = length(pics_t2) - TP;
title("TP : " + TP + " ; FN : " + FN + " ; FP : " + FP);