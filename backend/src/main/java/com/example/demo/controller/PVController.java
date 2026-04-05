package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.service.PVManagementService;
import com.example.demo.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * Contrôleur pour la gestion de l'upload de Procès-Verbaux (PV)
 * 
 * Sécurité à deux niveaux:
 * 1. Niveau système RBAC: hasPermission('UPLOAD_PV')
 * 2. Niveau métier: Role dans comité = 'Rapporteur'
 * 
 * Les deux doivent être vrais pour permettre l'upload
 */
@RestController
@RequestMapping("/api/pv")
public class PVController {

    @Autowired
    private PVManagementService pvService;

    @Autowired
    private PermissionService permissionService;

    /**
     * Upload un Procès-Verbal
     * 
     * @param comiteId ID du comité
     * @param userId ID de l'utilisateur (depuis session/header)
     * @param file Fichier du PV
     * @param name Nom du PV
     * @return Réponse de succès ou erreur 403
     */
    @PostMapping("/upload/{comiteId}")
    public ResponseEntity<?> uploadPV(
            @PathVariable Integer comiteId,
            @RequestParam Integer userId,
            @RequestParam MultipartFile file,
            @RequestParam String name) {

        // ✅ Validation du userId
        if (userId == null || userId <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, "❌ userId requis et doit être > 0"));
        }

        // ✅ Contrôle niveau 1: RBAC Système
        if (!permissionService.hasUserPermission(userId, "UPLOAD_PV")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ApiResponse(false, "❌ Accès refusé: permission UPLOAD_PV requise"));
        }

        // ✅ Contrôle niveau 2: Logique Métier (Rapporteur dans ce comité)
        if (!pvService.isUserRapporteurInComite(userId, comiteId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ApiResponse(false, "❌ Accès refusé: vous devez être Rapporteur de ce comité"));
        }

        // Les deux conditions sont satisfaites → Upload autorisé ✅
        try {
            var pv = pvService.uploadPV(comiteId, userId, file, name);
            return ResponseEntity.ok(new ApiResponse(true, "PV uploadé avec succès", pv));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, "Erreur lors de l'upload: " + e.getMessage()));
        }
    }

    /**
     * Vérifier l'éligibilité pour upload AVANT d'afficher le formulaire
     * Frontend appelle ceci pour savoir d'afficher le bouton upload
     * 
     * @param comiteId ID du comité
     * @param userId ID de l'utilisateur
     * @return { canUpload: boolean, reasons?: string[] }
     */
    @GetMapping("/can-upload/{comiteId}")
    public ResponseEntity<?> canUploadPV(
            @PathVariable Integer comiteId,
            @RequestParam Integer userId) {

        // Validation du userId
        if (userId == null || userId <= 0) {
            var response = new java.util.HashMap<String, Object>();
            response.put("canUpload", false);
            response.put("hasPermission", false);
            response.put("isRapporteur", false);
            response.put("error", "userId requis et doit être > 0");
            return ResponseEntity.ok(response);
        }

        // Vérification 1: Permission système
        boolean hasPermission = permissionService.hasUserPermission(userId, "UPLOAD_PV");

        // Vérification 2: Rôle dans comité
        boolean isRapporteur = pvService.isUserRapporteurInComite(userId, comiteId);

        var response = new java.util.HashMap<String, Object>();
        response.put("canUpload", hasPermission && isRapporteur);
        response.put("hasPermission", hasPermission);
        response.put("isRapporteur", isRapporteur);

        if (!hasPermission) {
            response.put("error", "Vous n'avez pas la permission d'uploader des PV");
        }
        if (!isRapporteur) {
            response.put("error", "Vous devez être Rapporteur de ce comité");
        }

        return ResponseEntity.ok(response);
    }
}
