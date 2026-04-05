package com.example.demo.controller;

import com.example.demo.models.Role;
import com.example.demo.repository.RoleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/roles")
public class RoleController {

    private final RoleRepository roleRepository;

    public RoleController(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllRoles() {
        try {
            List<Role> roles = roleRepository.findAll();
            List<Map<String, Object>> result = new java.util.ArrayList<>();
            for (Role r : roles) {
                result.add(Map.of(
                    "id", r.getId(),
                    "role", r.getName(),
                    "roleAr", r.getLabelAr() != null ? r.getLabelAr() : "",
                    "name", r.getName(),
                    "label_ar", r.getLabelAr() != null ? r.getLabelAr() : ""
                ));
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable Integer id) {
        try {
            Optional<Role> role = roleRepository.findById(id);
            return role.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> createRole(@RequestBody Map<String, String> request) {
        try {
            // Accept both "name" and "role" for flexibility
            String name = request.get("name") != null ? request.get("name") : request.get("role");
            // Accept both "labelAr" and "roleAr"
            String labelAr = request.get("labelAr") != null ? request.get("labelAr") : request.get("roleAr");

            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }

            Role role = new Role();
            role.setName(name);
            role.setLabelAr(labelAr != null ? labelAr : name);

            Role savedRole = roleRepository.save(role);
            
            Map<String, Object> response = Map.of(
                "id", savedRole.getId(),
                "role", savedRole.getName(),
                "roleAr", savedRole.getLabelAr()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRole(@PathVariable int id, @RequestBody Map<String, String> request) {
        try {
            Optional<Role> roleOpt = roleRepository.findById(id);
            if (roleOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Role not found");
            }

            Role role = roleOpt.get();
            
            // Accept both "name" and "role"
            String name = request.get("name") != null ? request.get("name") : request.get("role");
            // Accept both "labelAr" and "roleAr"
            String labelAr = request.get("labelAr") != null ? request.get("labelAr") : request.get("roleAr");

            if (name != null && !name.trim().isEmpty()) {
                role.setName(name);
            }
            
            if (labelAr != null && !labelAr.trim().isEmpty()) {
                role.setLabelAr(labelAr);
            }

            Role updatedRole = roleRepository.save(role);
            
            Map<String, Object> response = Map.of(
                "id", updatedRole.getId(),
                "role", updatedRole.getName(),
                "roleAr", updatedRole.getLabelAr()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable int id) {
        try {
            Optional<Role> roleOpt = roleRepository.findById(id);
            if (roleOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Role not found");
            }

            roleRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Role deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
