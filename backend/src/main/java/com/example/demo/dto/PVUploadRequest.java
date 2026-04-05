package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

/**
 * Requête pour upload de PV (Procès-Verbal)
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PVUploadRequest {
    private Integer comiteId;
    private String name;
    private MultipartFile file;
}
