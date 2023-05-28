clear;
close all;
taille_ecran = get(0,'ScreenSize');
L = taille_ecran(3);
H = taille_ecran(4);

addpath('../');

% Lecture d'un fichier audio
[y, f_ech] = audioread('../../audio/Laurindo Almeida - The Lamp Is Low [lkk6m14htzw].mp3', [122 140] * 48000);
y = mean(y, 2);

% Affichage du signal original, en guise de comparaison :
figure('Name','Modification','Position',[0,0,L,0.6*H]);
subplot(2,1,1);
plot((0:length(y) - 1) / f_ech, y)
ylim([-1 1])
set(gca,'FontSize',20);
xlabel('Temps ($s$)','Interpreter','Latex','FontSize',30);
ylabel('Amplitude','Interpreter','Latex','FontSize',30);
title('Signal original','FontSize',20);

% Ajout d'un effet
y_modifie = changement_vitesse(y, f_ech, 1.5);
% y_modifie = etirement_temporel(y, f_ech, 1.2);
% y_modifie = transposition(y, f_ech, 1.1);


% Gestion des limites de l'axe temporel
% (une fonction qui permet d'avoir les mêmes limites pour les subplots ?)
duree_y = length(y) / f_ech;
duree_y_modifie = length(y_modifie) / f_ech;
xlim([0 max([duree_y, duree_y_modifie])])

% Affichage du signal modifié :
subplot(2,1,2);
plot((0:length(y_modifie) - 1) / f_ech, y_modifie)
xlim([0 max([duree_y, duree_y_modifie])])
ylim([-1 1])
set(gca,'FontSize',20);
xlabel('Temps ($s$)','Interpreter','Latex','FontSize',30);
ylabel('Amplitude','Interpreter','Latex','FontSize',30);
title('Signal modifié','FontSize',20);
drawnow;

saveas(gcf,'playback.png')
audiowrite('y_playback_ex.wav', y, f_ech);
audiowrite('y_playback_res.wav', y_modifie, f_ech);