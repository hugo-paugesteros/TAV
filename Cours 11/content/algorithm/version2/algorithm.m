for (m, k) = requete
    entrees = bdd(k)
    for [~, M, id] in entrees
        resultats[id][M - m]++
    end
end