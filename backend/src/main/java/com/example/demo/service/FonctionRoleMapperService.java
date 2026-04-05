package com.example.demo.service;

import com.example.demo.models.Employe;
import com.example.demo.models.EmployeFonction;
import com.example.demo.models.Role;
import com.example.demo.models.User;
import com.example.demo.repository.EmployeFonctionRepository;
import com.example.demo.repository.FonctionRoleMappingRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Service pour gérer le mapping automatique entre Fonction et Rôle Système
 * 
 * Logique:
 * - Quand employe_fonction.is_active = true
 * - Récupère le role depuis fonction_role_mapping
 * - Met à jour user_role automatiquement (backend, pas trigger SQL)
 */
@Service
@Transactional
public class FonctionRoleMapperService {

    @Autowired
    private FonctionRoleMappingRepository fonctionRoleMappingRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private EmployeFonctionRepository employeFonctionRepository;

    /**
     * Synchroniser les rôles de l'utilisateur après un changement de fonction
     * 
     * @param employeFonction L'enregistrement employe_fonction modifié/créé
     */
    public void syncRoleFromFonction(EmployeFonction employeFonction) {
        if (employeFonction == null || employeFonction.getEmploye() == null) {
            return;
        }

        Employe employe = employeFonction.getEmploye();
        User user = employe.getUser();

        if (user == null) {
            return; // L'employé n'a pas de compte utilisateur associé
        }

        // Si la fonction est inactive, on utilise le rôle 'user' par défaut
        if (employeFonction.getIsActive() == null || !employeFonction.getIsActive()) {
            assignDefaultRole(user);
            return;
        }

        // Récupérer le rôle mappé pour cette fonction
        Role newRole = fonctionRoleMappingRepository
            .findRoleByFonctionId(employeFonction.getFonction().getId());

        if (newRole != null) {
            // Remplacer tous les rôles existants par le nouveau rôle
            userRoleRepository.deleteByUserId(user.getId());
            userRoleRepository.assignRoleToUser(user.getId(), newRole.getId());
        } else {
            // Fallback: assigner le rôle 'user' par défaut
            assignDefaultRole(user);
        }
    }

    /**
     * Assigner le rôle 'user' par défaut
     */
    private void assignDefaultRole(User user) {
        roleRepository.findByName("user").ifPresent(defaultRole -> {
            userRoleRepository.deleteByUserId(user.getId());
            userRoleRepository.assignRoleToUser(user.getId(), defaultRole.getId());
        });
    }

    /**
     * Récupérer tous les rôles actifs d'un utilisateur
     */
    public List<Role> getUserRoles(Integer userId) {
        return userRoleRepository.findRolesByUserId(userId);
    }

    /**
     * Synchroniser les rôles pour tous les employés actifs (batch operation)
     * Utile après une modification de la table fonction_role_mapping
     */
    public void syncAllEmployeeFonctions() {
        List<EmployeFonction> allActiveFonctions = employeFonctionRepository.findByIsActiveTrue();
        for (EmployeFonction ef : allActiveFonctions) {
            syncRoleFromFonction(ef);
        }
    }
}
