package com.example.demo.controller;

import com.example.demo.models.Fonction;
import com.example.demo.repository.FonctionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/fonctions")
public class FonctionController {

    private final FonctionRepository fonctionRepository;

    public FonctionController(FonctionRepository fonctionRepository) {
        this.fonctionRepository = fonctionRepository;
    }

    @GetMapping
    public ResponseEntity<List<Fonction>> getAllFonctions() {
        try {
            List<Fonction> fonctions = fonctionRepository.findAll();
            return ResponseEntity.ok(fonctions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fonction> getFonctionById(@PathVariable @NonNull Integer id) {
        try {
            Optional<Fonction> fonction = fonctionRepository.findById(id);
            if (fonction.isPresent()) {
                return ResponseEntity.ok(fonction.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> createFonction(@RequestBody Fonction request) {
        try {
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }
            if (request.getLabelAr() == null || request.getLabelAr().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("LabelAr is required");
            }

            Fonction fonction = new Fonction();
            fonction.setName(request.getName());
            fonction.setLabelAr(request.getLabelAr());

            Fonction savedFonction = fonctionRepository.save(fonction);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedFonction);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating fonction: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFonction(@PathVariable @NonNull Integer id, @RequestBody Fonction request) {
        try {
            Optional<Fonction> fonctionOpt = fonctionRepository.findById(id);
            if (fonctionOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Fonction not found");
            }

            Fonction fonction = fonctionOpt.get();

            if (request.getName() != null && !request.getName().trim().isEmpty()) {
                fonction.setName(request.getName());
            }

            if (request.getLabelAr() != null && !request.getLabelAr().trim().isEmpty()) {
                fonction.setLabelAr(request.getLabelAr());
            }

            Fonction updatedFonction = fonctionRepository.save(fonction);
            return ResponseEntity.ok(updatedFonction);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating fonction: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFonction(@PathVariable @NonNull Integer id) {
        try {
            Optional<Fonction> fonctionOpt = fonctionRepository.findById(id);
            if (fonctionOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Fonction not found");
            }

            fonctionRepository.deleteById(id);
            return ResponseEntity.ok("Fonction deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting fonction: " + e.getMessage());
        }
    }
}