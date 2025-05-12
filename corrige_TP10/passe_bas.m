function [Y_modifie] = passe_bas(Y, valeurs_f, frequence_coupure)

	% Filtre passe-bas
	%	
	% Inputs :
	%	Y			: TFCT d'un signal réel
	%	valeurs_f		: échelle des fréquences de Y
	%	frequence_coupure	: fréquence au-delà de laquelle on veut filtrer le signal
	%
	% Output :
	%	Y_modifie		: TFCT modifiée

	% Filtre passe bas appliqué dans le domaine fréquentiel à un signal :

	Y_modifie = Y;
	indices_coupes = find(valeurs_f > frequence_coupure);
	Y_modifie(indices_coupes, :) = 0;

end
