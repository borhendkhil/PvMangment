package com.example.demo.repository;

import com.example.demo.models.EmployeFonction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeFonctionRepository extends JpaRepository<EmployeFonction, Integer> {
    List<EmployeFonction> findByEmployeId(Integer employeId);
    List<EmployeFonction> findByEmployeIdAndIsActiveTrue(Integer employeId);
    Optional<EmployeFonction> findByEmployeIdAndIsActiveTrueAndFonctionNameOrderByDateDebutDesc(Integer employeId, String fonctionName);
    
    /**
     * Récupérer toutes les fonctions d'employés actifs
     * Utilisé pour la synchronisation des rôles en batch
     */
    List<EmployeFonction> findByIsActiveTrue();
}
