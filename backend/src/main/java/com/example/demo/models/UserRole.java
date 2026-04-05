package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

/**
 * Entité pour la table junction user_role (Relation N:N)
 * Utilise une clé composite (user_id, role_id)
 */
@Entity
@Table(name = "user_role")
@Data
@NoArgsConstructor
@IdClass(UserRoleId.class)
public class UserRole implements Serializable {
    
    @Id
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Id
    @Column(name = "role_id", nullable = false)
    private Integer roleId;

    public UserRole(Integer userId, Integer roleId) {
        this.userId = userId;
        this.roleId = roleId;
    }
}

