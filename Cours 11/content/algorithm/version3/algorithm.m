for (m_i, k_i, m_j, k_j) = paires_requete
    entrees = bdd(k_i, k_j, m_j - m_i)
    for [~, M_i, id] in entrees
        resultats[id][M_i - m_i]++
    end
end