function [y_etire] = etirement_temporel(y, f_ech, pourcentage)

% Calcul de la transformée de Fourier à court terme :
n_fenetre = 2048;		% Largeur de la fenêtre (en nombre d'échantillons)
n_decalage = 512;		% Décalage entre positions successives de la fenêtre (en nombre d'échantillons)
fenetre = 'hann';		% Type de la fenêtre : 'rect' ou 'hann'

% Calcul de la TFCT :
[Y, valeurs_t, valeurs_f] = TFCT(y, f_ech, n_fenetre, n_decalage, fenetre);

% Création des nouveaux instants temporels des colonnes du nouveau spectrogramme
valeurs_t = 1:pourcentage:(size(Y, 2)+1);

% Initialisation du nouveau spectrogramme
Y_etire = zeros(size(Y, 1), length(valeurs_t));

% Initialisation de l'accumulateur de phase
phase_acc = angle(Y(:, 1));

% Ajout d'une colonne de marge
Y = padarray(Y, [0 1], 0, 'post');

for n = 1:length(valeurs_t)

	valeur_t = valeurs_t(n);

	% Récupération des deux colonnes de Y dont les instants temporels entourent valeur_t
	colonnes = Y(:, floor(valeur_t) + [0 1]);

	% Interpolation linéaire des magnitudes
	alpha = valeur_t - floor(valeur_t);
	magnitude = (1 - alpha) * abs(colonnes(:, 1)) + alpha * abs(colonnes(:, 2));

	Y_etire(:, n) = magnitude .* exp(j * phase_acc);

	% Calcul de la différence de phase entre les deux colonnes de Y
  	dphi = angle(colonnes(:, 2)) - angle(colonnes(:, 1));

	% Ajout de la différence à l'accumulateur
	phase_acc = phase_acc + dphi;

	
end

% Calcul de la transformée de Fourier inverse :
[y_etire, ~] = ITFCT(Y_etire, f_ech, n_decalage, fenetre);