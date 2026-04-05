package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "decision_pdf")
public class DecisionPdf {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "decision_id", nullable = false)
    private Integer decisionId;

    @Column(name = "pdf_path", nullable = false)
    private String pdfPath;

    @Column(name = "pdf_name")
    private String pdfName;

    @Column(name = "date_upload", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime dateUpload;

    public DecisionPdf() {
        this.dateUpload = LocalDateTime.now();
    }

    public DecisionPdf(Integer decisionId, String pdfPath, String pdfName) {
        this.decisionId = decisionId;
        this.pdfPath = pdfPath;
        this.pdfName = pdfName;
        this.dateUpload = LocalDateTime.now();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getDecisionId() {
        return decisionId;
    }

    public void setDecisionId(Integer decisionId) {
        this.decisionId = decisionId;
    }

    public String getPdfPath() {
        return pdfPath;
    }

    public void setPdfPath(String pdfPath) {
        this.pdfPath = pdfPath;
    }

    public String getPdfName() {
        return pdfName;
    }

    public void setPdfName(String pdfName) {
        this.pdfName = pdfName;
    }

    public LocalDateTime getDateUpload() {
        return dateUpload;
    }

    public void setDateUpload(LocalDateTime dateUpload) {
        this.dateUpload = dateUpload;
    }
}
