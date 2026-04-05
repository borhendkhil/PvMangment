package com.example.demo.dto;

import java.time.LocalDateTime;

public class DecisionPdfDTO {
    private Integer id;
    private Integer decisionId;
    private String pdfPath;
    private String pdfName;
    private LocalDateTime dateUpload;

    public DecisionPdfDTO() {}

    public DecisionPdfDTO(Integer id, Integer decisionId, String pdfPath, String pdfName, LocalDateTime dateUpload) {
        this.id = id;
        this.decisionId = decisionId;
        this.pdfPath = pdfPath;
        this.pdfName = pdfName;
        this.dateUpload = dateUpload;
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
