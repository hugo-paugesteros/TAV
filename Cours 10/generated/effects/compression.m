function [Y_modifie] = compression(Y,m)

% Récupération des indices des lignes des m maxima de chaque colonne
% I est de taille (m, size(Y, 2))
[~, I] = maxk(abs(Y), m);

% Création des indices des colones des m maxima
C = repmat(1:length(I), size(I, 1), 1);

% Création du spectrogramme modifié
Y_modifie = zeros(size(Y));
Y_modifie(sub2ind(size(Y), I, C)) = Y(sub2ind(size(Y), I, C));