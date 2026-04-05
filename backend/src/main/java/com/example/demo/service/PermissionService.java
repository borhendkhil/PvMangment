package com.example.demo.service;

import com.example.demo.models.Role;
import com.example.demo.repository.RolePermissionRepository;
import com.example.demo.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service pour vérifier les permissions RBAC d'un utilisateur
 * 
 * Consulte la table role_permission pour savoir si un user
 * possède une permission donnée via son rôle
 */
@Service
public class PermissionService {

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private RolePermissionRepository rolePermissionRepository;

    /**
     * Vérifier si un utilisateur possède une permission
     * 
     * @param userId ID de l'utilisateur
     * @param permissionName Nom de la permission (ex: 'UPLOAD_PV')
     * @return true si l'utilisateur a la permission
     */
    public boolean hasUserPermission(Integer userId, String permissionName) {
        if (userId == null) {
            return false;
        }

        // 1. Récupérer tous les rôles de l'utilisateur
        List<Role> userRoles = userRoleRepository.findRolesByUserId(userId);

        // 2. Pour chaque rôle, vérifier si la permission est assignée
        for (Role role : userRoles) {
            if (role != null && role.getId() != null) {
                if (rolePermissionRepository.hasPermission(role.getId(), permissionName)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Vérifier si un utilisateur possède au moins une permission parmi une liste
     * 
     * @param userId ID de l'utilisateur
     * @param permissionNames Noms des permissions
     * @return true si l'utilisateur a au moins une permission
     */
    public boolean hasAnyPermission(Integer userId, String... permissionNames) {
        for (String permission : permissionNames) {
            if (hasUserPermission(userId, permission)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Vérifier si un utilisateur possède toutes les permissions d'une liste
     * 
     * @param userId ID de l'utilisateur
     * @param permissionNames Noms des permissions
     * @return true si l'utilisateur a toutes les permissions
     */
    public boolean hasAllPermissions(Integer userId, String... permissionNames) {
        for (String permission : permissionNames) {
            if (!hasUserPermission(userId, permission)) {
                return false;
            }
        }
        return true;
    }
}
