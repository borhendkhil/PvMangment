package com.example.demo.controller;

import com.example.demo.models.User;
import com.example.demo.models.Role;
import com.example.demo.models.Employe;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.EmployeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.mindrot.jbcrypt.BCrypt;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
public class UserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmployeRepository employeRepository;

    public UserController(UserRepository userRepository, RoleRepository roleRepository, EmployeRepository employeRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.employeRepository = employeRepository;
    }

    private String getUserDisplayName(User user) {
        // Always fetch from employe table (single source of truth)
        List<Employe> employes = employeRepository.findByUserId(user.getId());
        if (!employes.isEmpty()) {
            Employe employe = employes.get(0);
            String nom = employe.getNom() != null ? employe.getNom() : "";
            String prenom = employe.getPrenom() != null ? employe.getPrenom() : "";
            return (nom + " " + prenom).trim();
        }
        // Fallback to email if no employe found
        return user.getEmail();
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            List<Map<String, Object>> result = users.stream().map(u -> Map.of(
                "id", u.getId(),
                "email", u.getEmail(),
                "nomPrenom", getUserDisplayName(u),
                "telephone", u.getTelephone() != null ? u.getTelephone() : "",
                "enabled", u.isEnabled(),
                "roles", u.getRoles()
            )).collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/available-employes")
    public ResponseEntity<List<Map<String, Object>>> getAvailableEmployes() {
        try {
            List<Employe> employes = employeRepository.findAll();
            List<Map<String, Object>> result = employes.stream()
                    .filter(e -> e.getUser() == null)  // Only employes without user account
                    .map(e -> {
                        Map<String, Object> map = new java.util.LinkedHashMap<>();
                        map.put("id", e.getId());
                        map.put("nom", e.getNom() != null ? e.getNom() : "");
                        map.put("prenom", e.getPrenom() != null ? e.getPrenom() : "");
                        map.put("nomComplet", (e.getNom() != null ? e.getNom() : "") + " " + (e.getPrenom() != null ? e.getPrenom() : ""));
                        map.put("matricule", e.getMatricule() != null ? e.getMatricule() : "");
                        map.put("telephone", e.getTelephone() != null ? e.getTelephone() : "");
                        return map;
                    }).collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        try {
            Optional<User> user = userRepository.findById(id);
            return user.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            String password = (String) request.get("password");
            Integer employeId = request.get("employeId") != null ? ((Number) request.get("employeId")).intValue() : null;
            Integer roleId = request.get("roleId") != null ? ((Number) request.get("roleId")).intValue() : null;

            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (password == null || password.length() < 6) {
                return ResponseEntity.badRequest().body("Password must be at least 6 characters");
            }
            if (userRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            if (employeId == null) {
                return ResponseEntity.badRequest().body("Employe is required");
            }
            if (roleId == null) {
                return ResponseEntity.badRequest().body("Role is required");
            }

            Optional<Employe> employeOpt = employeRepository.findById(employeId);
            if (employeOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Employe not found");
            }

            Employe employe = employeOpt.get();
            if (employe.getUser() != null) {
                return ResponseEntity.badRequest().body("This employe already has a user account");
            }

            Optional<Role> roleOpt = roleRepository.findById(roleId);
            if (roleOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Role not found");
            }

            User user = new User();
            user.setEmail(email);
            user.setTelephone(employe.getTelephone());
            user.setPassword(BCrypt.hashpw(password, BCrypt.gensalt(12)));
            user.setEnabled(true);

            // Assign selected role
            user.getRoles().add(roleOpt.get());

            User savedUser = userRepository.save(user);
            
            // Link employe to user
            employe.setUser(savedUser);
            employeRepository.save(employe);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable int id, @RequestBody Map<String, Object> request) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            User user = userOpt.get();
            
            String email = (String) request.get("email");
            String telephone = (String) request.get("telephone");
            String password = (String) request.get("password");
            Integer roleId = request.get("roleId") != null ? ((Number) request.get("roleId")).intValue() : null;

            if (email != null && !email.isEmpty()) {
                Optional<User> existingUser = userRepository.findByEmail(email);
                if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
                    return ResponseEntity.badRequest().body("Email already exists");
                }
                user.setEmail(email);
            }

            if (telephone != null && !telephone.isEmpty()) {
                user.setTelephone(telephone);
            }

            if (password != null && !password.isEmpty()) {
                if (password.length() < 6) {
                    return ResponseEntity.badRequest().body("Password must be at least 6 characters");
                }
                user.setPassword(BCrypt.hashpw(password, BCrypt.gensalt(12)));
            }

            if (roleId != null) {
                Optional<Role> role = roleRepository.findById(roleId);
                if (role.isPresent()) {
                    user.getRoles().clear();
                    user.getRoles().add(role.get());
                }
            }

            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggleUserStatus(@PathVariable int id) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            User user = userOpt.get();
            user.setEnabled(!user.isEnabled());
            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
