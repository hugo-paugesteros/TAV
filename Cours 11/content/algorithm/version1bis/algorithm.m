for id = 1:n_chansons
    entrees = bdd(id)
    for [M, K] in entrees
        for [m, k] in requete
            if (K == k)
                resultats[id][M - m]++
            end
        end
    end
end