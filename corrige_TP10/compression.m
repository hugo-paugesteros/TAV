function [Y_modifie,taux_compression] = compression(Y, m)

	% Filtre de compression
	%	
	% Inputs :
	%	Y			: TFCT d'un signal réel
	%	m			: nombre de coefficients à conserver dans chaque colonne
	%
	% Outputs :
	%	Y_modifie		: TFCT modifiée
	%	taux_compression	: taux de compression (>1 si compression il y a)

	% Filtre de compression appliqué dans le domaine fréquentiel à un signal

	% Récupération des indices des lignes des m maxima de chaque colonne :
	% I est de taille (m, size(Y, 2))
	[~, I] = maxk(abs(Y), m);

	% Création des indices des colones des m maxima :
	C = repmat(1:length(I), size(I, 1), 1);

	% Création du spectrogramme modifié :
	Y_modifie = zeros(size(Y));
	Y_modifie(sub2ind(size(Y), I, C)) = Y(sub2ind(size(Y), I, C));

	% Calcul du taux de compression :
	taux_compression = size(Y,1)/m;

end
