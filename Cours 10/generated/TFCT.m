function [Y, valeurs_t, valeurs_f] = TFCT(y, f_ech, n_fenetre, n_decalage, fenetre)

	% TFCT (transformée de Fourier à court terme)
	%	
	% Inputs :
	%	y			: signal réel
	%	f_ech		: fréquence d'échantillonage
	%	n_fenetre	: taille d'une fenêtre
	%	n_decalage	: taille entre deux fenêtres
	%
	% Outputs :
	%	Y		: TFCT(y)
	%	valeurs_t	: points temporels
	%	valeurs_f	: points fréquences

	% Découpage du signal en tranches de taille n_fenetre,
	% avec un recouvrement de n_fenetre - n_decalage 
	% (n_decalage est la taille entre deux fenêtres) :
	frames = buffer(y, n_fenetre, n_fenetre - n_decalage, 'nodelay');

	% Fenêtrage (pour éviter les fuites hautes-fréquences) :
	if nargin == 4 || strcmp(fenetre, 'hann')
		% Par défaut, fenêtre de Hann :
		w = hann(n_fenetre);
	elseif strcmp(fenetre, 'rect')
		w = ones(n_fenetre, 1);
	end
	Y = fft(frames .* repmat(w, 1, size(frames, 2)));

	% Élimination des fréquences négatives (car signal réel) :
	Y = Y(1:floor(n_fenetre/2) + 1, :);

	% Calcul du temps de chaque colonne et de la fréquence de chaque ligne :
	valeurs_t = (0 : size(Y, 2) - 1) * n_decalage / f_ech;
	valeurs_f = (0 : size(Y, 1) - 1) * f_ech / n_fenetre;

end

