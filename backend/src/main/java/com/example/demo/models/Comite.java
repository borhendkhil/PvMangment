package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "comite")
@Data
@EqualsAndHashCode(exclude = {"sessions", "membres"})
@ToString(exclude = {"sessions", "membres"})
public class Comite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "sujet", nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "date_creation")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "comite", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<ComiteSession> sessions;

    @OneToMany(mappedBy = "comite", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<MembreComite> membres;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Comite() {}

    public Comite(String name, String description) {
        this.name = name;
        this.description = description;
        this.createdAt = LocalDateTime.now();
    }
}
