package com.example.demo.service;

import com.example.demo.repository.MembreComiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Service pour la gestion des Procès-Verbaux
 * 
 * Met en place la contrainte métier:
 * - Seul le Rapporteur d'un comité peut uploader le PV
 */
@Service
public class PVManagementService {

    @Autowired
    private MembreComiteRepository membreComiteRepository;

    // Répertoire où les fichiers PV seront stockés
    private static final String UPLOAD_DIR = "uploads/pv";

    /**
     * Vérifier si un utilisateur est Rapporteur dans un comité spécifique
     * 
     * @param userId ID de l'utilisateur
     * @param comiteId ID du comité
     * @return true si l'utilisateur est Rapporteur
     */
    public boolean isUserRapporteurInComite(Integer userId, Integer comiteId) {
        if (userId == null || comiteId == null) {
            return false;
        }
        return membreComiteRepository.isUserRapporteurInComite(userId, comiteId);
    }

    /**
     * Vérifier si un utilisateur est Président d'un comité
     */
    public boolean isUserPresidentInComite(Integer userId, Integer comiteId) {
        if (userId == null || comiteId == null) {
            return false;
        }
        return membreComiteRepository.isUserPresidentInComite(userId, comiteId);
    }

    /**
     * Upload un Procès-Verbal
     * 
     * Attention: Cette méthode est appelée APRÈS les vérifications dans PVController
     * - La sécurité RBAC est vérifiée (UPLOAD_PV permission)
     * - La sécurité métier est vérifiée (Rapporteur dans comité)
     * 
     * @param comiteId ID du comité
     * @param userId ID de l'utilisateur
     * @param file Fichier du PV
     * @param name Nom du PV
     * @return Objet représentant le PV uploadé
     * @throws IOException Si erreur lors de la sauvegarde
     */
    public Object uploadPV(Integer comiteId, Integer userId, MultipartFile file, String name) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier ne peut pas être vide");
        }

        // 1. Créer le répertoire s'il n'existe pas
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 2. Générer un nom de fichier unique
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String uniqueFilename = UUID.randomUUID().toString() + "." + extension;
        String filePath = UPLOAD_DIR + "/" + uniqueFilename;

        // 3. Sauvegarder le fichier
        Path targetPath = Paths.get(filePath);
        Files.write(targetPath, file.getBytes());

        // 4. Créer un objet de réponse avec métadonnées
        return new java.util.HashMap<String, Object>() {{
            put("id", UUID.randomUUID().toString());
            put("comiteId", comiteId);
            put("userId", userId);
            put("name", name);
            put("fileName", uniqueFilename);
            put("filePath", filePath);
            put("originalFileName", originalFilename);
            put("fileSize", file.getSize());
            put("uploadDate", new java.util.Date());
            put("status", "SUCCESS");
        }};
    }

    /**
     * Obtenir l'extension d'un fichier
     */
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "pdf";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }
}
