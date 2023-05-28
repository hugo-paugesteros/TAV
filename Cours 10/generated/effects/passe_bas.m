function [Y_modifie] = passe_bas(Y, valeurs_f, frequence_coupure)

Y_modifie = Y;
indices_coupes = find(valeurs_f > frequence_coupure);
Y_modifie(indices_coupes, :) = 0;