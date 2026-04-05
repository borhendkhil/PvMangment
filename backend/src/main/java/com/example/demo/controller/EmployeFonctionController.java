package com.example.demo.controller;

import com.example.demo.models.EmployeFonction;
import com.example.demo.models.Employe;
import com.example.demo.models.Fonction;
import com.example.demo.repository.EmployeFonctionRepository;
import com.example.demo.repository.EmployeRepository;
import com.example.demo.repository.FonctionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/employe-fonctions")
public class EmployeFonctionController {

    private final EmployeFonctionRepository employeFonctionRepository;
    private final EmployeRepository employeRepository;
    private final FonctionRepository fonctionRepository;

    public EmployeFonctionController(
            EmployeFonctionRepository employeFonctionRepository,
            EmployeRepository employeRepository,
            FonctionRepository fonctionRepository) {
        this.employeFonctionRepository = employeFonctionRepository;
        this.employeRepository = employeRepository;
        this.fonctionRepository = fonctionRepository;
    }

    public static class EmployeFonctionDTO {
        public Integer id;
        public Integer employeId;
        public String employeNom;
        public String employePrenom;
        public Integer fonctionId;
        public String fonctionLabel;
        public LocalDate dateDebut;
        public LocalDate dateFin;
        public Boolean isActive;

        public EmployeFonctionDTO(EmployeFonction ef) {
            this.id = ef.getId();
            this.employeId = ef.getEmploye() != null ? ef.getEmploye().getId() : null;
            this.employeNom = ef.getEmploye() != null ? ef.getEmploye().getNom() : null;
            this.employePrenom = ef.getEmploye() != null ? ef.getEmploye().getPrenom() : null;
            this.fonctionId = ef.getFonction() != null ? ef.getFonction().getId() : null;
            this.fonctionLabel = ef.getFonction() != null ? ef.getFonction().getLabelAr() : null;
            this.dateDebut = ef.getDateDebut();
            this.dateFin = ef.getDateFin();
            this.isActive = ef.getIsActive();
        }
    }

    @GetMapping
    public ResponseEntity<List<EmployeFonctionDTO>> getAllEmployeFonctions() {
        try {
            List<EmployeFonction> employeFonctions = employeFonctionRepository.findAll();
            List<EmployeFonctionDTO> dtos = employeFonctions.stream()
                    .map(EmployeFonctionDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeFonctionDTO> getEmployeFonctionById(@PathVariable @NonNull Integer id) {
        try {
            Optional<EmployeFonction> employeFonction = employeFonctionRepository.findById(id);
            if (employeFonction.isPresent()) {
                return ResponseEntity.ok(new EmployeFonctionDTO(employeFonction.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> createEmployeFonction(@RequestBody EmployeFonctionRequest request) {
        try {
            // Validate employe_id
            if (request.getEmploye() == null || request.getEmploye().getId() == null) {
                return ResponseEntity.badRequest().body("L'ID de l'employé est requis");
            }

            Optional<Employe> employeOpt = employeRepository.findById(request.getEmploye().getId());
            if (employeOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Employé non trouvé");
            }

            // Validate fonction_id
            if (request.getFonction() == null || request.getFonction().getId() == null) {
                return ResponseEntity.badRequest().body("L'ID de la fonction est requis");
            }

            Optional<Fonction> fonctionOpt = fonctionRepository.findById(request.getFonction().getId());
            if (fonctionOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Fonction non trouvée");
            }

            // Validate dateDebut
            if (request.getDateDebut() == null) {
                return ResponseEntity.badRequest().body("La date de début est requise");
            }

            EmployeFonction employeFonction = new EmployeFonction();
            employeFonction.setEmploye(employeOpt.get());
            employeFonction.setFonction(fonctionOpt.get());
            employeFonction.setDateDebut(request.getDateDebut());
            employeFonction.setDateFin(request.getDateFin());
            employeFonction.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

            EmployeFonction savedEmployeFonction = employeFonctionRepository.save(employeFonction);
            return ResponseEntity.status(HttpStatus.CREATED).body(new EmployeFonctionDTO(savedEmployeFonction));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la création: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployeFonction(@PathVariable @NonNull Integer id, @RequestBody EmployeFonctionRequest request) {
        try {
            Optional<EmployeFonction> employeFonctionOpt = employeFonctionRepository.findById(id);
            if (employeFonctionOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Association non trouvée");
            }

            EmployeFonction employeFonction = employeFonctionOpt.get();

            // Update employe if provided
            if (request.getEmploye() != null && request.getEmploye().getId() != null) {
                Optional<Employe> employeOpt = employeRepository.findById(request.getEmploye().getId());
                if (employeOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body("Employé non trouvé");
                }
                employeFonction.setEmploye(employeOpt.get());
            }

            // Update fonction if provided
            if (request.getFonction() != null && request.getFonction().getId() != null) {
                Optional<Fonction> fonctionOpt = fonctionRepository.findById(request.getFonction().getId());
                if (fonctionOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body("Fonction non trouvée");
                }
                employeFonction.setFonction(fonctionOpt.get());
            }

            // Update dates if provided
            if (request.getDateDebut() != null) {
                employeFonction.setDateDebut(request.getDateDebut());
            }

            if (request.getDateFin() != null) {
                employeFonction.setDateFin(request.getDateFin());
            }

            // Update isActive if provided
            if (request.getIsActive() != null) {
                employeFonction.setIsActive(request.getIsActive());
            }

            EmployeFonction updatedEmployeFonction = employeFonctionRepository.save(employeFonction);
            return ResponseEntity.ok(new EmployeFonctionDTO(updatedEmployeFonction));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployeFonction(@PathVariable @NonNull Integer id) {
        try {
            Optional<EmployeFonction> employeFonctionOpt = employeFonctionRepository.findById(id);
            if (employeFonctionOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Association non trouvée");
            }

            employeFonctionRepository.deleteById(id);
            return ResponseEntity.ok("Association supprimée avec succès");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la suppression: " + e.getMessage());
        }
    }

    @GetMapping("/employe/{employeId}")
    public ResponseEntity<List<EmployeFonctionDTO>> getFonctionsByEmploye(@PathVariable Integer employeId) {
        try {
            List<EmployeFonction> fonctions = employeFonctionRepository.findAll().stream()
                    .filter(ef -> ef.getEmploye() != null && ef.getEmploye().getId().equals(employeId))
                    .toList();
            List<EmployeFonctionDTO> dtos = fonctions.stream()
                    .map(EmployeFonctionDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Inner DTO class for request handling
    public static class EmployeFonctionRequest {
        private EmployeRef employe;
        private FonctionRef fonction;
        private LocalDate dateDebut;
        private LocalDate dateFin;
        private Boolean isActive;

        // Getters and Setters
        public EmployeRef getEmploye() { return employe; }
        public void setEmploye(EmployeRef employe) { this.employe = employe; }

        public FonctionRef getFonction() { return fonction; }
        public void setFonction(FonctionRef fonction) { this.fonction = fonction; }

        public LocalDate getDateDebut() { return dateDebut; }
        public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

        public LocalDate getDateFin() { return dateFin; }
        public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }

        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }

        // Inner reference classes
        public static class EmployeRef {
            private Integer id;
            public Integer getId() { return id; }
            public void setId(Integer id) { this.id = id; }
        }

        public static class FonctionRef {
            private Integer id;
            public Integer getId() { return id; }
            public void setId(Integer id) { this.id = id; }
        }
    }
}
