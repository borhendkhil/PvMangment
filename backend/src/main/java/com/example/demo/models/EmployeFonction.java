package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDate;

@Entity
@Table(name = "employe_fonction")
@Data
public class EmployeFonction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "employe_id", nullable = false)
    @JsonBackReference
    private Employe employe;

    @ManyToOne
    @JoinColumn(name = "fonction_id", nullable = false)
    private Fonction fonction;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    @Column(name = "is_active")
    private Boolean isActive = true;

    public EmployeFonction() {}

    public EmployeFonction(Employe employe, Fonction fonction, LocalDate dateDebut) {
        this.employe = employe;
        this.fonction = fonction;
        this.dateDebut = dateDebut;
        this.isActive = true;
    }
}
