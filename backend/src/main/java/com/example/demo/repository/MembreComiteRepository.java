package com.example.demo.repository;

import com.example.demo.models.MembreComite;
import com.example.demo.models.MembreComiteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository pour la table membre_comite
 * Gère les rôles métier (Rapporteur, Président, Membre) dans les comités
 */
@Repository
public interface MembreComiteRepository extends JpaRepository<MembreComite, MembreComiteId> {
    List<MembreComite> findByComiteId(Integer comiteId);
    List<MembreComite> findByEmployeId(Integer employeId);

    /**
     * Vérifier si un utilisateur est Rapporteur d'un comité spécifique
     * 
     * @param userId ID de l'utilisateur
     * @param comiteId ID du comité
     * @return true si l'utilisateur est Rapporteur
     */
    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END " +
           "FROM membre_comite mc " +
           "JOIN employe e ON mc.employe_id = e.id " +
           "JOIN role_comite rc ON mc.role_comite_id = rc.id " +
           "WHERE e.user_id = ?1 AND mc.comite_id = ?2 AND rc.name = 'Rapporteur'", 
           nativeQuery = true)
    boolean isUserRapporteurInComite(Integer userId, Integer comiteId);

    /**
     * Vérifier si un utilisateur est Président d'un comité
     */
    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END " +
           "FROM membre_comite mc " +
           "JOIN employe e ON mc.employe_id = e.id " +
           "JOIN role_comite rc ON mc.role_comite_id = rc.id " +
           "WHERE e.user_id = ?1 AND mc.comite_id = ?2 AND rc.name = 'Président'", 
           nativeQuery = true)
    boolean isUserPresidentInComite(Integer userId, Integer comiteId);

    /**
     * Vérifier si un utilisateur est membre (quelconque rôle) d'un comité
     */
    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END " +
           "FROM membre_comite mc " +
           "JOIN employe e ON mc.employe_id = e.id " +
           "WHERE e.user_id = ?1 AND mc.comite_id = ?2", 
           nativeQuery = true)
    boolean isUserMemberInComite(Integer userId, Integer comiteId);

    /**
     * Récupérer le rôle d'un utilisateur dans un comité
     */
    @Query(value = "SELECT rc.name FROM membre_comite mc " +
           "JOIN employe e ON mc.employe_id = e.id " +
           "JOIN role_comite rc ON mc.role_comite_id = rc.id " +
           "WHERE e.user_id = ?1 AND mc.comite_id = ?2", 
           nativeQuery = true)
    String getUserRoleInComite(Integer userId, Integer comiteId);
}
