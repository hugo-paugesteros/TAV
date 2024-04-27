for id = 1:n_chansons
    entrees = bdd(id)
    for decalage = 1:n_decalages
        for [M, K] in entrees
            for [m, k] in requete
                if (m + decalage == M) and (k == K)
                    resultats[id][decalage]++
                end
            end
        end
    end
end