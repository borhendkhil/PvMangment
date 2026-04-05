package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "role_comite")
@Data
public class RoleComite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(name = "label_ar", nullable = false)
    private String labelAr;

    public RoleComite() {}

    public RoleComite(String name, String labelAr) {
        this.name = name;
        this.labelAr = labelAr;
    }
}
