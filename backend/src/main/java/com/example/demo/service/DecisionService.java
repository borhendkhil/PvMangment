package com.example.demo.service;

import com.example.demo.dto.DecisionDTO;
import com.example.demo.models.Decision;
import com.example.demo.models.ComiteSession;
import com.example.demo.repository.DecisionRepository;
import com.example.demo.repository.ComiteSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DecisionService {
    
    @Autowired
    private DecisionRepository decisionRepository;
    
    @Autowired
    private ComiteSessionRepository comiteSessionRepository;
    
    public DecisionDTO getDecisionById(Integer id) {
        return decisionRepository.findById(id)
            .map(this::mapToDTO)
            .orElse(null);
    }
    
    public DecisionDTO updateDecision(Integer id, String statut) {
        Decision decision = decisionRepository.findById(id).orElseThrow();
        decision.setStatut(statut);
        
        Decision saved = decisionRepository.save(decision);
        return mapToDTO(saved);
    }
    
    public void deleteDecision(Integer id) {
        decisionRepository.deleteById(id);
    }

    public DecisionDTO createDecision(DecisionDTO dto) {
        Decision decision = new Decision();
        decision.setSujetId(dto.getSujetId());
        decision.setStatut(dto.getStatut() != null ? dto.getStatut() : "brouillon");
        decision.setCurrent(false);
        decision.setDateCreation(LocalDateTime.now());
        
        Decision saved = decisionRepository.save(decision);
        return mapToDTO(saved);
    }

    public void markOldDecisionsAsNotCurrent(Integer sujetId) {
        List<Decision> oldDecisions = decisionRepository.findBySujetIdAndCurrentTrue(sujetId);
        oldDecisions.forEach(d -> {
            d.setCurrent(false);
            decisionRepository.save(d);
        });
    }

    public void markDecisionAsCurrent(Integer decisionId) {
        decisionRepository.findById(decisionId).ifPresent(decision -> {
            decision.setCurrent(true);
            decisionRepository.save(decision);
        });
    }
    
    public List<DecisionDTO> getDecisionsBySujetId(Integer sujetId) {
        return decisionRepository.findBySujetId(sujetId).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    private DecisionDTO mapToDTO(Decision decision) {
        DecisionDTO dto = new DecisionDTO();
        dto.setId(decision.getId());
        dto.setSujetId(decision.getSujetId());
        dto.setFichierPath(decision.getFichierPath());
        dto.setFichierName(decision.getFichierName());
        dto.setPdfPath(decision.getPdfPath());
        dto.setStatut(decision.getStatut());
        dto.setCurrent(decision.getCurrent());
        dto.setDateCreation(decision.getDateCreation());
        dto.setDateUpload(decision.getDateUpload());
        return dto;
    }
}
