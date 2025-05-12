function [y_etire] = etirement_temporel(y, f_ech, proportion)

	% Calcul de la transformée de Fourier à court terme :
	N = 2048;				% Nombre d'échantillons de la fenêtre
	D = 512;				% Nombre d'échantillons entre positions successives de la fenêtre
	fenetre = 'hann';			% Type de la fenêtre : 'rect' ou 'hann'
	Y = TFCT(y, f_ech, N, D, fenetre);

	% Création des nouveaux instants temporels des colonnes du nouveau spectrogramme
	valeurs_t = 1:proportion:(size(Y, 2)+1);

	% Initialisation du nouveau spectrogramme
	Y_etire = zeros(size(Y, 1), length(valeurs_t));

	% Initialisation de l'accumulateur de phase
	phi = angle(Y(:, 1));

	% Ajout d'une colonne de marge
	Y = padarray(Y, [0 1], 0, 'post');

	for n = 1:length(valeurs_t)

		valeur_t = valeurs_t(n);

		% Récupération des deux colonnes de Y dont les instants temporels entourent valeur_t
		colonnes = Y(:, floor(valeur_t) + [0 1]);

		% Interpolation linéaire des magnitudes
		alpha = valeur_t - floor(valeur_t);
		magnitude = (1 - alpha) * abs(colonnes(:, 1)) + alpha * abs(colonnes(:, 2));

		Y_etire(:, n) = magnitude .* exp(j * phi);

		% Ajout de la différence à l'accumulateur
		phi = phi + angle(colonnes(:, 2)) - angle(colonnes(:, 1));

	end

	% Calcul de la transformée de Fourier inverse :
	y_etire = ITFCT(Y_etire, f_ech, N, D, fenetre);

end
