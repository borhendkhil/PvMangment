package com.example.demo.service;

import com.example.demo.dto.SujetDecisionDTO;
import com.example.demo.entity.SujetDecision;
import com.example.demo.repository.SujetDecisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SujetDecisionService {
    @Autowired
    private SujetDecisionRepository sujetDecisionRepository;

    public List<SujetDecisionDTO> getAllSujets() {
        return sujetDecisionRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public SujetDecisionDTO getSujetById(Integer id) {
        return sujetDecisionRepository.findById(id)
                .map(this::mapToDTO)
                .orElse(null);
    }

    public SujetDecisionDTO createSujet(String sujet, String description) {
        SujetDecision entity = new SujetDecision();
        entity.setSujet(sujet);
        entity.setDescription(description);
        SujetDecision saved = sujetDecisionRepository.save(entity);
        return mapToDTO(saved);
    }

    public SujetDecisionDTO updateSujet(Integer id, String sujet, String description) {
        return sujetDecisionRepository.findById(id).map(entity -> {
            entity.setSujet(sujet);
            entity.setDescription(description);
            SujetDecision updated = sujetDecisionRepository.save(entity);
            return mapToDTO(updated);
        }).orElse(null);
    }

    public void deleteSujet(Integer id) {
        sujetDecisionRepository.deleteById(id);
    }

    private SujetDecisionDTO mapToDTO(SujetDecision entity) {
        return new SujetDecisionDTO(
                entity.getId(),
                entity.getSujet(),
                entity.getDescription(),
                entity.getDateCreation()
        );
    }
}
