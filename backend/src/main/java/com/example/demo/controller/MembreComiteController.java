package com.example.demo.controller;

import com.example.demo.models.MembreComite;
import com.example.demo.models.MembreComiteId;
import com.example.demo.models.Employe;
import com.example.demo.models.RoleComite;
import com.example.demo.repository.MembreComiteRepository;
import com.example.demo.repository.EmployeRepository;
import com.example.demo.repository.ComiteRepository;
import com.example.demo.repository.RoleComiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/membres-comite")
public class MembreComiteController {

    @Autowired
    private MembreComiteRepository membreComiteRepository;

    @Autowired
    private EmployeRepository employeRepository;

    @Autowired
    private ComiteRepository comiteRepository;

    @Autowired
    private RoleComiteRepository roleComiteRepository;

    // ========== Récupérer les membres d'un comité ==========
    @GetMapping("/comite/{comiteId}")
    public ResponseEntity<List<MembreComite>> getMembresComite(@PathVariable Integer comiteId) {
        List<MembreComite> membres = membreComiteRepository.findByComiteId(comiteId);
        return ResponseEntity.ok(membres);
    }

    // ========== Récupérer les employés disponibles pour une direction ==========
    // Les directeurs ne peuvent ajouter que leurs propres employés
    @GetMapping("/comite/{comiteId}/employes-disponibles/{directionId}")
    public ResponseEntity<List<Employe>> getEmployesDisponibles(
            @PathVariable Integer comiteId,
            @PathVariable Integer directionId) {
        // Récupérer tous les employés de cette direction
        List<Employe> tousEmployes = employeRepository.findByDirectionId(directionId);
        
        // Récupérer les membres déjà assignés à ce comité
        List<MembreComite> membresExistants = membreComiteRepository.findByComiteId(comiteId);
        
        // Créer une liste des employeIds déjà assignés
        java.util.Set<Integer> employeIdsExistants = new java.util.HashSet<>();
        for (MembreComite membre : membresExistants) {
            employeIdsExistants.add(membre.getEmployeId());
        }
        
        // Filtrer pour retourner seulement les employés non assignés
        List<Employe> employesDisponibles = new java.util.ArrayList<>();
        for (Employe employe : tousEmployes) {
            if (!employeIdsExistants.contains(employe.getId())) {
                employesDisponibles.add(employe);
            }
        }
        
        return ResponseEntity.ok(employesDisponibles);
    }

    // ========== Ajouter un membre à un comité ==========
    @PostMapping("/comite/{comiteId}")
    public ResponseEntity<?> addMembreComite(
            @PathVariable Integer comiteId,
            @RequestBody Map<String, Object> payload) {
        try {
            Object employeIdObj = payload.get("employeId");
            Object roleComiteIdObj = payload.get("roleComiteId");
            
            if (employeIdObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "employeId est requis"));
            }
            
            Integer employeId = ((Number) employeIdObj).intValue();
            
            // Vérifier que le comité existe
            if (comiteId != null && !comiteRepository.existsById(comiteId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Comité non trouvé"));
            }
            
            // Vérifier que l'employé existe
            Optional<Employe> employe = employeRepository.findById(employeId);
            if (!employe.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Employé non trouvé"));
            }
            
            // Vérifier que le membre n'existe pas déjà
            MembreComiteId id = new MembreComiteId(comiteId, employeId);
            if (membreComiteRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Ce membre est déjà assigné au comité"));
            }
            
            // Créer le nouveau membre
            MembreComite membre = new MembreComite();
            membre.setComiteId(comiteId);
            membre.setEmployeId(employeId);
            if (comiteId != null) {
                membre.setComite(comiteRepository.findById(comiteId).orElse(null));
            }
            membre.setEmploye(employe.get());
            
            // Assign role if provided
            if (roleComiteIdObj != null) {
                Integer roleComiteId = ((Number) roleComiteIdObj).intValue();
                RoleComite roleComite = roleComiteRepository.findById(roleComiteId).orElse(null);
                if (roleComite != null) {
                    membre.setRoleComite(roleComite);
                }
            }
            
            MembreComite saved = membreComiteRepository.save(membre);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
            
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Format d'ID invalide"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de l'ajout du membre: " + e.getMessage()));
        }
    }

    // ========== Mettre à jour un membre ==========
    @PutMapping("/comite/{comiteId}/membre/{employeId}")
    public ResponseEntity<?> updateMembreComite(
            @PathVariable Integer comiteId,
            @PathVariable Integer employeId,
            @RequestBody Map<String, Object> payload) {
        try {
            MembreComiteId id = new MembreComiteId(comiteId, employeId);
            Optional<MembreComite> existing = membreComiteRepository.findById(id);
            
            if (!existing.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Membre non trouvé"));
            }
            
            MembreComite membre = existing.get();
            
            if (payload.containsKey("roleComiteId")) {
                Object roleIdObj = payload.get("roleComiteId");
                if (roleIdObj != null) {
                    Integer roleComiteId = ((Number) roleIdObj).intValue();
                    RoleComite roleComite = roleComiteRepository.findById(roleComiteId).orElse(null);
                    if (roleComite != null) {
                        membre.setRoleComite(roleComite);
                    }
                }
            }
            
            @SuppressWarnings("null")
            MembreComite updated = membreComiteRepository.save(membre);
            return ResponseEntity.ok(updated);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la mise à jour: " + e.getMessage()));
        }
    }

    // ========== Supprimer un membre ==========
    @DeleteMapping("/comite/{comiteId}/membre/{employeId}")
    public ResponseEntity<?> deleteMembreComite(
            @PathVariable Integer comiteId,
            @PathVariable Integer employeId) {
        try {
            MembreComiteId id = new MembreComiteId(comiteId, employeId);
            
            if (!membreComiteRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Membre non trouvé"));
            }
            
            membreComiteRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Membre supprimé avec succès"));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la suppression: " + e.getMessage()));
        }
    }
}
