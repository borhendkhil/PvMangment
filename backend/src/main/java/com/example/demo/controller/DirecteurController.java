package com.example.demo.controller;

import com.example.demo.dto.ComiteDTO;
import com.example.demo.dto.ComiteSessionDTO;
import com.example.demo.dto.DecisionDTO;
import com.example.demo.service.ComiteService;
import com.example.demo.service.ComiteSessionService;
import com.example.demo.service.DecisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * API pour les directeurs - gestion des comités et décisions
 */
@RestController
@RequestMapping("/api/directeur")
@CrossOrigin(origins = "http://localhost:5173")
public class DirecteurController {
    
    @Autowired
    private ComiteService comiteService;
    
    @Autowired
    private ComiteSessionService comiteSessionService;
    
    @Autowired
    private DecisionService decisionService;
    
    // ===== DASHBOARD STATS =====
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            List<ComiteDTO> comites = comiteService.getAllComites();
            
            stats.put("totalComites", comites.size());
            stats.put("activeSessions", 0);
            stats.put("pendingDecisions", 0);
            stats.put("completedComites", 0);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur lors du chargement du dashboard"));
        }
    }
    
    // ===== COMITES =====
    @GetMapping("/comites")
    public ResponseEntity<?> getAllComites() {
        try {
            List<ComiteDTO> comites = comiteService.getAllComites();
            return ResponseEntity.ok(comites);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/comites/{id}")
    public ResponseEntity<?> getComiteById(@PathVariable Integer id) {
        try {
            ComiteDTO comite = comiteService.getComiteById(id);
            if (comite == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Comité non trouvé"));
            }
            return ResponseEntity.ok(comite);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/comites")
    public ResponseEntity<?> createComite(
            @RequestParam("sujet") String sujet,
            @RequestParam(value = "description", required = false) String description) {
        try {
            if (sujet == null || sujet.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Le sujet est obligatoire"));
            }
            
            ComiteDTO comite = comiteService.createComite(sujet, description);
            return ResponseEntity.status(HttpStatus.CREATED).body(comite);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/comites/{id}")
    public ResponseEntity<?> updateComite(
            @PathVariable Integer id,
            @RequestParam("sujet") String sujet,
            @RequestParam(value = "description", required = false) String description) {
        try {
            ComiteDTO comite = comiteService.updateComite(id, sujet, description);
            return ResponseEntity.ok(comite);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/comites/{id}")
    public ResponseEntity<?> deleteComite(@PathVariable Integer id) {
        try {
            comiteService.deleteComite(id);
            return ResponseEntity.ok(Map.of("message", "Comité supprimé"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // ===== SESSIONS =====
    @GetMapping("/comites/{comiteId}/sessions")
    public ResponseEntity<?> getSessionsByComite(@PathVariable Integer comiteId) {
        try {
            List<ComiteSessionDTO> sessions = comiteSessionService.getSessionsByComiteId(comiteId);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/sessions")
    public ResponseEntity<?> createSession(
            @RequestParam("comiteId") Integer comiteId,
            @RequestParam("dateSession") String dateSession,
            @RequestParam("lieu") String lieu,
            @RequestParam(value = "statut", defaultValue = "planifiée") String statut) {
        try {
            ComiteSessionDTO session = comiteSessionService.createSession(comiteId, dateSession, lieu, statut);
            return ResponseEntity.status(HttpStatus.CREATED).body(session);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/sessions/{id}")
    public ResponseEntity<?> updateSession(
            @PathVariable Integer id,
            @RequestParam("lieu") String lieu,
            @RequestParam("statut") String statut) {
        try {
            ComiteSessionDTO session = comiteSessionService.updateSession(id, lieu, statut);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Integer id) {
        try {
            comiteSessionService.deleteSession(id);
            return ResponseEntity.ok(Map.of("message", "Session supprimée"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // ===== DECISIONS =====
    @PostMapping("/decisions")
    public ResponseEntity<?> createDecision(
            @RequestParam("sujetId") Integer sujetId,
            @RequestParam(value = "statut", defaultValue = "brouillon") String statut) {
        try {
            DecisionDTO dto = new DecisionDTO();
            dto.setSujetId(sujetId);
            dto.setStatut(statut);
            DecisionDTO decision = decisionService.createDecision(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(decision);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/decisions/{id}")
    public ResponseEntity<?> updateDecision(
            @PathVariable Integer id,
            @RequestParam("statut") String statut) {
        try {
            DecisionDTO decision = decisionService.updateDecision(id, statut);
            return ResponseEntity.ok(decision);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/decisions/{id}")
    public ResponseEntity<?> deleteDecision(@PathVariable Integer id) {
        try {
            decisionService.deleteDecision(id);
            return ResponseEntity.ok(Map.of("message", "Décision supprimée"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
