package com.example.demo.dto;

import java.time.LocalDateTime;

public class SujetDecisionDTO {
    private Integer id;
    private String sujet;
    private String description;
    private LocalDateTime dateCreation;

    public SujetDecisionDTO() {}

    public SujetDecisionDTO(Integer id, String sujet, String description, LocalDateTime dateCreation) {
        this.id = id;
        this.sujet = sujet;
        this.description = description;
        this.dateCreation = dateCreation;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSujet() {
        return sujet;
    }

    public void setSujet(String sujet) {
        this.sujet = sujet;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }
}
