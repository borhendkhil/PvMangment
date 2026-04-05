package com.example.demo.controller;

import com.example.demo.models.Direction;
import com.example.demo.repository.DirectionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/directions")
public class DirectionController {

    private final DirectionRepository directionRepository;

    public DirectionController(DirectionRepository directionRepository) {
        this.directionRepository = directionRepository;
    }

    // DTO helper class to avoid circular references
    public static class DirectionDTO {
        public Integer id;
        public String code;
        public String lib;
        public String address;

        public DirectionDTO(Direction direction) {
            this.id = direction.getId();
            this.code = direction.getCode();
            this.lib = direction.getLib();
            this.address = direction.getAddress();
        }
    }

    @GetMapping
    public ResponseEntity<List<DirectionDTO>> getAllDirections() {
        try {
            List<Direction> directions = directionRepository.findAll();
            System.out.println("📌 DirectionController.getAllDirections() - Found " + directions.size() + " directions");
            directions.forEach(d -> System.out.println("  → Direction: id=" + d.getId() + ", code=" + d.getCode() + ", lib=" + d.getLib()));
            
            List<DirectionDTO> dtos = directions.stream()
                    .map(DirectionDTO::new)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            System.err.println("❌ Error in getAllDirections: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DirectionDTO> getDirectionById(@PathVariable @NonNull Integer id) {
        try {
            Optional<Direction> direction = directionRepository.findById(id);
            if (direction.isPresent()) {
                return ResponseEntity.ok(new DirectionDTO(direction.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> createDirection(@RequestBody Direction request) {
        try {
            if (request.getLib() == null || request.getLib().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le nom de la direction est requis");
            }

            Direction direction = new Direction();
            direction.setCode(request.getCode());
            direction.setLib(request.getLib());
            direction.setAddress(request.getAddress());

            Direction savedDirection = directionRepository.save(direction);
            return ResponseEntity.status(HttpStatus.CREATED).body(new DirectionDTO(savedDirection));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la création: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDirection(@PathVariable @NonNull Integer id, @RequestBody Direction request) {
        try {
            Optional<Direction> directionOpt = directionRepository.findById(id);
            if (directionOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Direction non trouvée");
            }

            Direction direction = directionOpt.get();

            if (request.getCode() != null) {
                direction.setCode(request.getCode());
            }

            if (request.getLib() != null && !request.getLib().trim().isEmpty()) {
                direction.setLib(request.getLib());
            }

            if (request.getAddress() != null) {
                direction.setAddress(request.getAddress());
            }

            Direction updatedDirection = directionRepository.save(direction);
            return ResponseEntity.ok(new DirectionDTO(updatedDirection));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDirection(@PathVariable @NonNull Integer id) {
        try {
            Optional<Direction> directionOpt = directionRepository.findById(id);
            if (directionOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Direction non trouvée");
            }

            directionRepository.deleteById(id);
            return ResponseEntity.ok("Direction supprimée avec succès");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la suppression: " + e.getMessage());
        }
    }
}

