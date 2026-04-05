package com.example.demo.repository;

import com.example.demo.models.Role;
import com.example.demo.models.UserRole;
import com.example.demo.models.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Repository pour la table user_role (N:N junction)
 */
@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {

    /**
     * Récupérer tous les rôles d'un utilisateur
     */
    @Query(value = "SELECT r.* FROM role r " +
           "JOIN user_role ur ON ur.role_id = r.id " +
           "WHERE ur.user_id = ?1", nativeQuery = true)
    List<Role> findRolesByUserId(Integer userId);

    /**
     * Supprimer tous les rôles d'un utilisateur
     */
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_role WHERE user_id = ?1", nativeQuery = true)
    void deleteByUserId(Integer userId);

    /**
     * Assigner un rôle à un utilisateur
     */
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO user_role (user_id, role_id) VALUES (?1, ?2)", nativeQuery = true)
    void assignRoleToUser(Integer userId, Integer roleId);

    /**
     * Vérifier si un utilisateur a un rôle spécifique
     */
    @Query(value = "SELECT COUNT(*) FROM user_role WHERE user_id = ?1 AND role_id = ?2", nativeQuery = true)
    long countByUserIdAndRoleId(Integer userId, Integer roleId);
}
