package com.example.demo.service;

import com.example.demo.dto.ComiteDTO;
import com.example.demo.models.Comite;
import com.example.demo.repository.ComiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComiteService {
    
    @Autowired
    private ComiteRepository comiteRepository;
    
    @Autowired
    private ComiteSessionService comiteSessionService;
    
    public List<ComiteDTO> getAllComites() {
        return comiteRepository.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    public ComiteDTO getComiteById(Integer id) {
        return comiteRepository.findById(id)
            .map(this::mapToDTO)
            .orElse(null);
    }
    
    public ComiteDTO createComite(String sujet, String description) {
        Comite comite = new Comite();
        comite.setName(sujet);
        comite.setDescription(description);
        comite.setCreatedAt(LocalDateTime.now());
        
        Comite saved = comiteRepository.save(comite);
        return mapToDTO(saved);
    }
    
    public ComiteDTO updateComite(Integer id, String sujet, String description) {
        Comite comite = comiteRepository.findById(id).orElseThrow();
        comite.setName(sujet);
        comite.setDescription(description);
        
        Comite saved = comiteRepository.save(comite);
        return mapToDTO(saved);
    }
    
    public void deleteComite(Integer id) {
        comiteRepository.deleteById(id);
    }
    
    public ComiteDTO getComiteStats(Integer id) {
        Comite comite = comiteRepository.findById(id).orElseThrow();
        ComiteDTO dto = mapToDTO(comite);
        
        // Ajouter les stats
        dto.setTotalSessions(comiteSessionService.countSessionsByComiteId(id));
        
        return dto;
    }
    
    private ComiteDTO mapToDTO(Comite comite) {
        ComiteDTO dto = new ComiteDTO();
        dto.setId(comite.getId());
        dto.setSujet(comite.getName());
        dto.setDescription(comite.getDescription());
        dto.setDateCreation(comite.getCreatedAt());
        return dto;
    }
}
