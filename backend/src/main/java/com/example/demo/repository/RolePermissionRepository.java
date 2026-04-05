package com.example.demo.repository;

import com.example.demo.models.RolePermission;
import com.example.demo.models.RolePermissionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Repository pour la table role_permission
 * Permet de vérifier les permissions RBAC d'un rôle
 */
@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, RolePermissionId> {

    /**
     * Vérifier si un rôle a une permission spécifique
     */
    @Query(value = "SELECT COUNT(*) FROM role_permission rp " +
           "JOIN permission p ON rp.permission_id = p.id " +
           "WHERE rp.role_id = ?1 AND p.name = ?2", nativeQuery = true)
    long countByRoleIdAndPermissionName(Integer roleId, String permissionName);

    /**
     * Vérifier si un rôle a une permission (boolean)
     */
    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END FROM role_permission rp " +
           "JOIN permission p ON rp.permission_id = p.id " +
           "WHERE rp.role_id = ?1 AND p.name = ?2", nativeQuery = true)
    boolean hasPermission(Integer roleId, String permissionName);
}
