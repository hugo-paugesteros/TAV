function Y = TFCT(y, f_ech, N, D, fenetre)

	% TFCT (transformée de Fourier à court terme)
	%	
	% Inputs :
	%	y		: signal réel
	%	f_ech		: fréquence d'échantillonnage
	%	N		: nombre d'échantillons d'une fenêtre
	%	D		: décalage entre deux fenêtres
	%
	% Output :
	%	Y		: TFCT(y)

	% Découpage du signal en tranches de taille N,
	% avec un recouvrement de N - D 
	% (D est le décalage entre deux fenêtres) :
	frames = buffer(y, N, N - D, 'nodelay');

	% Fenêtrage (pour éviter les fuites hautes-fréquences) :
	if nargin == 4 || strcmp(fenetre, 'hann')
		% Par défaut, fenêtre de Hann :
		w = hann(N);
	elseif strcmp(fenetre, 'rect')
		w = ones(N, 1);
	end
	Y = fft(frames .* repmat(w, 1, size(frames, 2)));

	% Élimination des fréquences négatives (car signal réel) :
	Y = Y(1:floor(N/2) + 1, :);

end
