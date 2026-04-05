package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

/**
 * Entité pour la table junction role_permission (Relation N:N)
 * Utilise une clé composite (role_id, permission_id)
 */
@Entity
@Table(name = "role_permission")
@Data
@NoArgsConstructor
@IdClass(RolePermissionId.class)
public class RolePermission implements Serializable {
    
    @Id
    @Column(name = "role_id", nullable = false)
    private Integer roleId;

    @Id
    @Column(name = "permission_id", nullable = false)
    private Integer permissionId;

    public RolePermission(Integer roleId, Integer permissionId) {
        this.roleId = roleId;
        this.permissionId = permissionId;
    }
}

