package com.example.demo.controller;

import com.example.demo.models.Comite;
import com.example.demo.repository.ComiteRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comites")
public class ComiteController {

    private final ComiteRepository comiteRepository;

    public ComiteController(ComiteRepository comiteRepository) {
        this.comiteRepository = comiteRepository;
    }

    @GetMapping
    public ResponseEntity<List<Comite>> getAllComites() {
        try {
            List<Comite> comites = comiteRepository.findAll();
            return ResponseEntity.ok(comites);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comite> getComiteById(@PathVariable @NonNull Integer id) {
        try {
            Optional<Comite> comite = comiteRepository.findById(id);
            return comite.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> createComite(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description) {
        try {
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }

            Comite comite = new Comite();
            comite.setName(name);
            comite.setDescription(description != null ? description : "");

            Comite saved = comiteRepository.save(comite);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating comite: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComite(
            @PathVariable @NonNull Integer id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description) {
        try {
            Optional<Comite> opt = comiteRepository.findById(id);
            if (opt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comite not found");
            }

            Comite comite = opt.get();
            if (name != null && !name.trim().isEmpty()) {
                comite.setName(name);
            }
            if (description != null) {
                comite.setDescription(description);
            }

            @SuppressWarnings("null")
            Comite updated = comiteRepository.save(comite);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating comite: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComite(@PathVariable @NonNull Integer id) {
        try {
            if (!comiteRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comite not found");
            }
            comiteRepository.deleteById(id);
            return ResponseEntity.ok("Comite deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting comite: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/view")
    public ResponseEntity<String> viewComiteInfo(@PathVariable @NonNull Integer id) {
        try {
            Optional<Comite> opt = comiteRepository.findById(id);
            if (opt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comite not found");
            }

            Comite comite = opt.get();
            // Return comite info as JSON string
            String info = String.format(
                "{\n" +
                "  \"id\": %d,\n" +
                "  \"name\": \"%s\",\n" +
                "  \"description\": \"%s\",\n" +
                "  \"members\": %d,\n" +
                "  \"sessions\": %d\n" +
                "}",
                comite.getId(),
                comite.getName(),
                comite.getDescription() != null ? comite.getDescription() : "",
                comite.getMembres() != null ? comite.getMembres().size() : 0,
                comite.getSessions() != null ? comite.getSessions().size() : 0
            );
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .body(info);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving comite: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<String> downloadComiteReport(@PathVariable @NonNull Integer id) {
        try {
            Optional<Comite> opt = comiteRepository.findById(id);
            if (opt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comite not found");
            }

            Comite comite = opt.get();
            // Generate CSV report from comite data
            StringBuilder csv = new StringBuilder();
            csv.append("Comite Report\n");
            csv.append("ID,").append(comite.getId()).append("\n");
            csv.append("Name,").append(comite.getName()).append("\n");
            csv.append("Description,").append(comite.getDescription()).append("\n");
            csv.append("Created At,").append(comite.getCreatedAt()).append("\n");
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8")
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"comite_" + id + ".csv\"")
                    .body(csv.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error downloading report: " + e.getMessage());
        }
    }
}