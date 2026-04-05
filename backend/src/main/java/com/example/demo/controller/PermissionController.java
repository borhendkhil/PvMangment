package com.example.demo.controller;

import com.example.demo.models.Permission;
import com.example.demo.repository.PermissionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/permissions")
public class PermissionController {

    private final PermissionRepository permissionRepository;

    public PermissionController(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    @GetMapping
    public ResponseEntity<List<Permission>> getAllPermissions() {
        try {
            List<Permission> permissions = permissionRepository.findAll();
            return ResponseEntity.ok(permissions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Permission> getPermissionById(@PathVariable Integer id) {
        try {
            Optional<Permission> permission = permissionRepository.findById(id);
            if (permission.isPresent()) {
                return ResponseEntity.ok(permission.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> createPermission(@RequestBody Permission request) {
        try {
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le nom de la permission est requis");
            }

            Permission permission = new Permission();
            permission.setName(request.getName());

            Permission savedPermission = permissionRepository.save(permission);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPermission);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la création: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePermission(@PathVariable Integer id, @RequestBody Permission request) {
        try {
            Optional<Permission> permissionOpt = permissionRepository.findById(id);
            if (permissionOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Permission non trouvée");
            }

            Permission permission = permissionOpt.get();
            if (request.getName() != null && !request.getName().trim().isEmpty()) {
                permission.setName(request.getName());
            }

            Permission updatedPermission = permissionRepository.save(permission);
            return ResponseEntity.ok(updatedPermission);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePermission(@PathVariable Integer id) {
        try {
            Optional<Permission> permissionOpt = permissionRepository.findById(id);
            if (permissionOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Permission non trouvée");
            }

            permissionRepository.deleteById(id);
            return ResponseEntity.ok("Permission supprimée avec succès");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la suppression: " + e.getMessage());
        }
    }
}
