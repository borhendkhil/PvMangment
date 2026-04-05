package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "decision")
@Data
public class Decision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "sujet_id")
    private Integer sujetId;

    @Column(name = "fichier_path", length = 255)
    private String fichierPath;

    @Column(name = "fichier_name", length = 255)
    private String fichierName;

    @Column(name = "pdf_path", length = 255)
    private String pdfPath;

    @Column(name = "statut", length = 50)
    private String statut;

    @Column(name = "current")
    private Boolean current;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @Column(name = "date_upload")
    private LocalDateTime dateUpload;

    @PrePersist
    protected void onCreate() {
        if (dateCreation == null) {
            dateCreation = LocalDateTime.now();
        }
    }

    public Decision() {}
}
