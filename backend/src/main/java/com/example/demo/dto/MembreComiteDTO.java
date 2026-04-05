package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MembreComiteDTO {
    private Integer comiteId;
    private Integer employeId;
    private Integer roleComiteId;
    private String employeNom;
    private String employePrenom;
    private String roleComiteLabel;
}
