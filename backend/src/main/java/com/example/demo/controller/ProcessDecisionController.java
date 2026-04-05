package com.example.demo.controller;

import com.example.demo.dto.SujetDecisionDTO;
import com.example.demo.dto.DecisionDTO;
import com.example.demo.dto.DecisionPdfDTO;
import com.example.demo.service.SujetDecisionService;
import com.example.demo.service.DecisionService;
import com.example.demo.repository.DecisionPdfRepository;
import com.example.demo.entity.DecisionPdf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/directeur/process")
@CrossOrigin(origins = "http://localhost:5174")
public class ProcessDecisionController {
    
    @Autowired
    private SujetDecisionService sujetDecisionService;
    
    @Autowired
    private DecisionService decisionService;
    
    @Autowired
    private DecisionPdfRepository decisionPdfRepository;

    // ========== SUJET ==========
    @GetMapping("/sujets")
    public ResponseEntity<List<SujetDecisionDTO>> getAllSujets() {
        return ResponseEntity.ok(sujetDecisionService.getAllSujets());
    }

    @PostMapping("/sujets")
    public ResponseEntity<?> createSujet(@RequestBody Map<String, String> request) {
        try {
            String sujet = request.get("sujet");
            String description = request.get("description");
            
            // Validation
            if (sujet == null || sujet.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Le champ 'sujet' est obligatoire")
                );
            }
            
            SujetDecisionDTO result = sujetDecisionService.createSujet(sujet, description != null ? description : "");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Erreur: " + e.getMessage())
            );
        }
    }

    @PutMapping("/sujets/{id}")
    public ResponseEntity<SujetDecisionDTO> updateSujet(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        String sujet = request.get("sujet");
        String description = request.get("description");
        return ResponseEntity.ok(sujetDecisionService.updateSujet(id, sujet, description));
    }

    @DeleteMapping("/sujets/{id}")
    public ResponseEntity<Void> deleteSujet(@PathVariable Integer id) {
        sujetDecisionService.deleteSujet(id);
        return ResponseEntity.ok().build();
    }

    // ========== DECISION ==========
    @GetMapping("/decisions")
    public ResponseEntity<List<DecisionDTO>> getDecisionsBySujet(@RequestParam Integer sujetId) {
        try {
            List<DecisionDTO> decisions = decisionService.getDecisionsBySujetId(sujetId);
            return ResponseEntity.ok(decisions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/decisions")
    public ResponseEntity<DecisionDTO> createDecision(@RequestBody Map<String, Object> request) {
        Integer sujetId = (Integer) request.get("sujetId");
        String statut = (String) request.get("statut");
        
        DecisionDTO decision = new DecisionDTO();
        decision.setSujetId(sujetId);
        decision.setStatut(statut);
        decision.setCurrent(false);
        
        return ResponseEntity.ok(decisionService.createDecision(decision));
    }

    @PutMapping("/decisions/{id}/current")
    public ResponseEntity<Map<String, String>> markAsCurrent(@PathVariable Integer id) {
        // Marquer ancienne décision comme non-actuelle
        decisionService.markOldDecisionsAsNotCurrent(id);
        // Marquer nouvelle comme actuelle
        decisionService.markDecisionAsCurrent(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Décision marquée comme actuelle");
        return ResponseEntity.ok(response);
    }

    // ========== PDF ==========
    @PostMapping("/decisions/{decisionId}/upload-pdf")
    public ResponseEntity<DecisionPdfDTO> uploadPdf(
            @PathVariable Integer decisionId,
            @RequestParam("file") MultipartFile file) {
        try {
            // Créer le répertoire s'il n'existe pas
            String uploadDir = "uploads/decisions/";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // Sauvegarder le fichier
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filePath = uploadDir + fileName;
            file.transferTo(new File(filePath));

            // Créer l'enregistrement de pdf
            DecisionPdf pdf = new DecisionPdf(decisionId, filePath, file.getOriginalFilename());
            DecisionPdf saved = decisionPdfRepository.save(pdf);

            return ResponseEntity.ok(new DecisionPdfDTO(
                    saved.getId(),
                    saved.getDecisionId(),
                    saved.getPdfPath(),
                    saved.getPdfName(),
                    saved.getDateUpload()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/decisions/{decisionId}/pdfs")
    public ResponseEntity<List<DecisionPdfDTO>> getPdfsForDecision(@PathVariable Integer decisionId) {
        List<DecisionPdfDTO> pdfs = decisionPdfRepository.findByDecisionId(decisionId).stream()
                .map(pdf -> new DecisionPdfDTO(
                        pdf.getId(),
                        pdf.getDecisionId(),
                        pdf.getPdfPath(),
                        pdf.getPdfName(),
                        pdf.getDateUpload()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(pdfs);
    }

    @DeleteMapping("/pdfs/{pdfId}")
    public ResponseEntity<Void> deletePdf(@PathVariable Integer pdfId) {
        decisionPdfRepository.deleteById(pdfId);
        return ResponseEntity.ok().build();
    }
}
