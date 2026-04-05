package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DecisionDTO {
    private Integer id;
    private Integer sujetId;
    private String fichierPath;
    private String fichierName;
    private String pdfPath;
    private String statut;
    private Boolean current;
    private LocalDateTime dateCreation;
    private LocalDateTime dateUpload;
}
