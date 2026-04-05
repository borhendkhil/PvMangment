package com.example.demo.repository;

import com.example.demo.models.FonctionRoleMapping;
import com.example.demo.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Repository pour la table fonction_role_mapping
 * Permet de récupérer le rôle système associé à une fonction
 */
@Repository
public interface FonctionRoleMappingRepository extends JpaRepository<FonctionRoleMapping, Integer> {

    /**
     * Récupérer le rôle système associé à une fonction
     * 
     * @param fonctionId L'ID de la fonction
     * @return Le rôle système correspondant
     */
    @Query("SELECT frm.role FROM FonctionRoleMapping frm WHERE frm.fonction.id = ?1")
    Role findRoleByFonctionId(Integer fonctionId);
}
