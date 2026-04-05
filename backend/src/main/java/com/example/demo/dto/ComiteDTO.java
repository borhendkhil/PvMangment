package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComiteDTO {
    private Integer id;
    private String sujet;
    private String description;
    private LocalDateTime dateCreation;
    private List<ComiteSessionDTO> sessions;
    private List<MembreComiteDTO> membres;
    private Integer totalSessions;
    private Integer totalMembres;
}
