package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComiteSessionDTO {
    private Integer id;
    private Integer comiteId;
    private LocalDateTime dateSession;
    private String lieu;
    private String statut; // 'planifiée', 'terminée', 'annulée'
    private List<DecisionDTO> decisions;
}
