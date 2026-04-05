package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;

@Entity
@Table(name = "employe")
@Data
@EqualsAndHashCode(exclude = {"direction", "user", "fonctions"})
@ToString(exclude = {"direction", "user", "fonctions"})
public class Employe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, length = 50)
    private String matricule;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, length = 100)
    private String prenom;

    private String address;
    
    @Column(length = 20)
    private String telephone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "direction_id")
    @JsonManagedReference
    private Direction direction;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    @OneToMany(mappedBy = "employe", cascade = CascadeType.ALL)
    private List<EmployeFonction> fonctions;

    public Employe() {}

    public Employe(String matricule, String nom, String prenom, String address, String telephone) {
        this.matricule = matricule;
        this.nom = nom;
        this.prenom = prenom;
        this.address = address;
        this.telephone = telephone;
    }

    public String getFullName() {
        return this.prenom + " " + this.nom;
    }
}
