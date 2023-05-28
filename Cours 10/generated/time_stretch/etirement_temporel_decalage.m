function [y_etire] = etirement_temporel(y, f_ech, pourcentage)

	% Étirement temporel
	%	
	% Inputs :
	%	y					: signal réel
	%	f_ech				: fréquence d'échantillonage de ce signal
	%	pourcentage			: pourcentage de modification temporelle (200% = 2x plus long)
	%
	% Outputs :
	%	y_etire				: signal étiré

	% Algorithme d'étirement temporel en préservant le contenu fréquentiel

	% Calcul de la transformée de Fourier à court terme :
	n_fenetre = 2048;		% Largeur de la fenêtre (en nombre d'échantillons)
	n_decalage = 512;		% Décalage entre positions successives de la fenêtre (en nombre d'échantillons)
	fenetre = 'hann';		% Type de la fenêtre : 'rect' ou 'hann'

	% Calcul de la TFCT :
	[Y, valeurs_t, valeurs_f] = TFCT(y, f_ech, n_fenetre, n_decalage, fenetre);

	% Initialisation du nouveau spectrogramme
	Y_modifie = zeros(size(Y));

	% Initialisation de l'accumulateur de phase
	phase_acc = angle(Y(:, 1));

	% Calcul de l'écart angulaire attendu entre deux colonnes
	dphi = zeros(1, n_fenetre / 2 + 1);
	dphi(2:(1 + n_fenetre/2)) = (2*pi*n_decalage)./(n_fenetre./(1:(n_fenetre/2)));

	% Ajout d'une colonne de marge
	Y = padarray(Y, [0 1], 0, 'post');

	for n = 1:size(Y_modifie, 2)	
		Y_modifie(:, n) = abs(Y(:, n)) .* exp(1j * phase_acc);

		% Calcul de la différence de phase "non-attendue" entre les deux colonnes de Y
		dp = angle(Y(:, n + 1)) - angle(Y(:, n)) - dphi';

		% On remet entre [-pi;pi]
		dp = dp - 2 * pi * round(dp/(2*pi));

		% Ajout de la différence à l'accumulateur, en prenant en compte le pourcentage de modification
		phase_acc = phase_acc + (dphi' + dp) * 1/pourcentage;
	end

	% Calcul de la transformée de Fourier inverse, en prenant en compte le pourcentage de modification :
	[y_etire, ~] = ITFCT(Y_modifie, f_ech, round(n_decalage / pourcentage), fenetre);

end