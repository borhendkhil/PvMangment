package com.example.demo.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity pour la table fonction_role_mapping
 * 
 * But: Définir le mapping automatlque entre une Fonction et un Rôle Système
 * 
 * Exemples:
 * - directeur → role 'directeur'
 * - chef_service → role 'user'
 * - agent → role 'user'
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fonction_role_mapping", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"fonction_id", "role_id"})
})
public class FonctionRoleMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fonction_id", nullable = false)
    private Fonction fonction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
}
