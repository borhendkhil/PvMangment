package com.example.demo.controller;

import com.example.demo.models.Direction;
import com.example.demo.models.Employe;
import com.example.demo.repository.DirectionRepository;
import com.example.demo.repository.EmployeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/employes")
public class EmployeController {

    private final EmployeRepository employeRepository;
    private final DirectionRepository directionRepository;

    public EmployeController(EmployeRepository employeRepository, DirectionRepository directionRepository) {
        this.employeRepository = employeRepository;
        this.directionRepository = directionRepository;
    }

    public static class EmployeDTO {
        public Integer id;
        public String matricule;
        public String nom;
        public String prenom;
        public String address;
        public String telephone;
        public Integer directionId;
        public String directionLib;

        public EmployeDTO(Employe employe) {
            this.id = employe.getId();
            this.matricule = employe.getMatricule();
            this.nom = employe.getNom();
            this.prenom = employe.getPrenom();
            this.address = employe.getAddress();
            this.telephone = employe.getTelephone();
            this.directionId = employe.getDirection() != null ? employe.getDirection().getId() : null;
            this.directionLib = employe.getDirection() != null ? employe.getDirection().getLib() : null;
        }
    }

    @GetMapping
    public ResponseEntity<List<EmployeDTO>> getAllEmployes() {
        try {
            List<Employe> employes = employeRepository.findAll();
            List<EmployeDTO> dtos = employes.stream()
                    .map(EmployeDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeDTO> getEmployeById(@PathVariable @NonNull Integer id) {
        try {
            Optional<Employe> employe = employeRepository.findById(id);
            if (employe.isPresent()) {
                return ResponseEntity.ok(new EmployeDTO(employe.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> createEmploye(@RequestBody Employe request) {
        try {
            if (request.getNom() == null || request.getNom().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le nom est requis");
            }
            if (request.getPrenom() == null || request.getPrenom().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le prénom est requis");
            }

            Employe employe = new Employe();
            employe.setMatricule(request.getMatricule());
            employe.setNom(request.getNom());
            employe.setPrenom(request.getPrenom());
            employe.setTelephone(request.getTelephone());
            employe.setAddress(request.getAddress());

            // Set direction if provided
            if (request.getDirection() != null && request.getDirection().getId() != null) {
                Optional<Direction> direction = directionRepository.findById(request.getDirection().getId());
                direction.ifPresent(employe::setDirection);
            }

            Employe savedEmploye = employeRepository.save(employe);
            return ResponseEntity.status(HttpStatus.CREATED).body(new EmployeDTO(savedEmploye));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la création: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmploye(@PathVariable @NonNull Integer id, @RequestBody Employe request) {
        try {
            Optional<Employe> employeOpt = employeRepository.findById(id);
            if (employeOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employé non trouvé");
            }

            Employe employe = employeOpt.get();

            if (request.getMatricule() != null) {
                employe.setMatricule(request.getMatricule());
            }

            if (request.getNom() != null && !request.getNom().trim().isEmpty()) {
                employe.setNom(request.getNom());
            }

            if (request.getPrenom() != null && !request.getPrenom().trim().isEmpty()) {
                employe.setPrenom(request.getPrenom());
            }

            if (request.getTelephone() != null) {
                employe.setTelephone(request.getTelephone());
            }

            if (request.getAddress() != null) {
                employe.setAddress(request.getAddress());
            }

            // Update direction if provided
            if (request.getDirection() != null && request.getDirection().getId() != null) {
                Optional<Direction> direction = directionRepository.findById(request.getDirection().getId());
                direction.ifPresent(employe::setDirection);
            } else if (request.getDirection() == null) {
                employe.setDirection(null);
            }

            Employe updatedEmploye = employeRepository.save(employe);
            return ResponseEntity.ok(new EmployeDTO(updatedEmploye));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmploye(@PathVariable @NonNull Integer id) {
        try {
            Optional<Employe> employeOpt = employeRepository.findById(id);
            if (employeOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employé non trouvé");
            }

            employeRepository.deleteById(id);
            return ResponseEntity.ok("Employé supprimé avec succès");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la suppression: " + e.getMessage());
        }
    }

    @GetMapping("/direction/{directionId}")
    public ResponseEntity<List<EmployeDTO>> getEmployesByDirection(@PathVariable Integer directionId) {
        try {
            List<Employe> employes = employeRepository.findAll().stream()
                    .filter(e -> e.getDirection() != null && e.getDirection().getId().equals(directionId))
                    .toList();
            List<EmployeDTO> dtos = employes.stream()
                    .map(EmployeDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
