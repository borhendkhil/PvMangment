package com.example.demo.service;

import com.example.demo.dto.ComiteSessionDTO;
import com.example.demo.models.ComiteSession;
import com.example.demo.models.Comite;
import com.example.demo.repository.ComiteSessionRepository;
import com.example.demo.repository.ComiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComiteSessionService {
    
    @Autowired
    private ComiteSessionRepository comiteSessionRepository;
    
    @Autowired
    private ComiteRepository comiteRepository;
    
    public List<ComiteSessionDTO> getSessionsByComiteId(Integer comiteId) {
        return comiteSessionRepository.findByComiteIdOrderByDateSessionDesc(comiteId).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    public ComiteSessionDTO createSession(Integer comiteId, String dateSession, String lieu, String statut) {
        Comite comite = comiteRepository.findById(comiteId).orElseThrow();
        ComiteSession session = new ComiteSession();
        session.setComite(comite);
        session.setLieu(lieu);
        session.setStatut(statut);
        session.setDateSession(LocalDateTime.now());
        
        ComiteSession saved = comiteSessionRepository.save(session);
        return mapToDTO(saved);
    }
    
    public ComiteSessionDTO updateSession(Integer id, String lieu, String statut) {
        ComiteSession session = comiteSessionRepository.findById(id).orElseThrow();
        session.setLieu(lieu);
        session.setStatut(statut);
        
        ComiteSession saved = comiteSessionRepository.save(session);
        return mapToDTO(saved);
    }
    
    public void deleteSession(Integer id) {
        comiteSessionRepository.deleteById(id);
    }
    
    public int countSessionsByComiteId(Integer comiteId) {
        return comiteSessionRepository.findByComiteId(comiteId).size();
    }
    
    private ComiteSessionDTO mapToDTO(ComiteSession session) {
        ComiteSessionDTO dto = new ComiteSessionDTO();
        dto.setId(session.getId());
        dto.setComiteId(session.getComite() != null ? session.getComite().getId() : null);
        dto.setDateSession(session.getDateSession());
        dto.setLieu(session.getLieu());
        dto.setStatut(session.getStatut());
        return dto;
    }
}
