package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDateTime;

@Entity
@Table(name = "comite_session")
@Data
public class ComiteSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "comite_id", nullable = false)
    @JsonBackReference
    private Comite comite;

    @Column(name = "date_session")
    private LocalDateTime dateSession;

    @Column(name = "lieu", length = 255)
    private String lieu;

    @Column(name = "statut", length = 50)
    private String statut;

    public ComiteSession() {}

    public ComiteSession(Comite comite, LocalDateTime dateSession) {
        this.comite = comite;
        this.dateSession = dateSession;
        this.statut = "Planifiée";
    }
}
