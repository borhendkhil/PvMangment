package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "fonction")
@Data
public class Fonction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "label_ar", nullable = false)
    private String labelAr;

    public Fonction() {}

    public Fonction(String name, String labelAr) {
        this.name = name;
        this.labelAr = labelAr;
    }
}
