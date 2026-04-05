package com.example.demo.controller;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.models.User;
import com.example.demo.models.Role;
import com.example.demo.models.Employe;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.EmployeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.List;
import org.mindrot.jbcrypt.BCrypt;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmployeRepository employeRepository;

    public AuthController(UserRepository userRepository, RoleRepository roleRepository, EmployeRepository employeRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.employeRepository = employeRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Check if the user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use");
        }

        User newUser = new User();
        newUser.setEmail(request.getEmail());
        newUser.setTelephone(request.getTelephone());

        // Hash the password before saving
        String hashedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt(12));
        newUser.setPassword(hashedPassword);

        try {
            userRepository.save(newUser);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error saving user: " + e.getMessage() + (e.getCause() != null ? " Cause: " + e.getCause().getMessage() : ""));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            if (request == null || request.getEmail() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest().body("Email and password are required");
            }

            Optional<User> opt = userRepository.findByEmail(request.getEmail());
            if (opt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }

            User user = opt.get();

            // NOTE: Migrating to BCrypt password checking
            if (user.getPassword() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }

            boolean passwordMatches = false;
            try {
                String storedPassword = user.getPassword();
                if (storedPassword != null && (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$")
                        || storedPassword.startsWith("$2y$"))) {
                    passwordMatches = BCrypt.checkpw(request.getPassword(), storedPassword);
                } else {
                    passwordMatches = storedPassword != null && storedPassword.equals(request.getPassword());
                }
            } catch (Exception e) {
                passwordMatches = user.getPassword().equals(request.getPassword());
            }

            if (!passwordMatches) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }

            // Generate a simple token placeholder. Replace with JWT generation if available.
            String token = UUID.randomUUID().toString();
            
            // Get primary role from user's roles (Many-to-Many)
            Integer primaryRoleId = null;
            String roleName = "user";
            
            // Load roles once to avoid ConcurrentModificationException
            Set<Role> userRoles = user.getRoles();
            if (userRoles != null && !userRoles.isEmpty()) {
                Role firstRole = userRoles.stream().findFirst().orElse(null);
                if (firstRole != null) {
                    primaryRoleId = firstRole.getId();
                    roleName = firstRole.getName();
                }
            }

            // Get user's full name from associated Employe
            String nomPrenom = "المسؤول";
            try {
                List<Employe> employes = employeRepository.findByUserId(user.getId());
                if (employes != null && !employes.isEmpty()) {
                    Employe employe = employes.get(0);
                    nomPrenom = employe.getPrenom() + " " + employe.getNom();
                }
            } catch (Exception e) {
                // Use default name if Employe lookup fails
            }

            // Frontend handles all role-based routing; backend returns token and role info
            AuthResponse resp = new AuthResponse(token, primaryRoleId, roleName, nomPrenom);
            return ResponseEntity.ok(resp);
        } catch (Exception ex) {
            System.out.println("LOGIN ERROR: " + ex.getClass().getName());
            System.out.println("MESSAGE: " + ex.getMessage());
            ex.printStackTrace();
            // Return detailed response for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new java.util.HashMap<String, Object>() {{
                        put("error", ex.getClass().getSimpleName());
                        put("message", ex.getMessage() != null ? ex.getMessage() : "Unknown error");
                        put("details", ex.getCause() != null ? ex.getCause().getMessage() : "No additional details");
                    }});
        }
    }

    /**
     * Utility endpoint to hash a password.
     * Useful for initializing the database with encrypted passwords.
     */
    @PostMapping("/hash")
    public ResponseEntity<String> hashPassword(@RequestBody String plainTextPassword) {
        if (plainTextPassword == null || plainTextPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Password cannot be empty");
        }
        String hashedPassword = BCrypt.hashpw(plainTextPassword, BCrypt.gensalt(12));
        return ResponseEntity.ok(hashedPassword);
    }

    /**
     * Assign a role to a user. DEBUG endpoint for development.
     */
    @PostMapping("/assign-role")
    public ResponseEntity<?> assignRole(@RequestParam String email, @RequestParam Integer roleId) {
        try {
            // Vérifier que roleId n'est pas null
            if (roleId == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Role ID is required");
            }

            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            
            Optional<Role> roleOpt = roleRepository.findById(roleId);
            if (roleOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Role not found");
            }
            
            User user = userOpt.get();
            Role role = roleOpt.get();
            
            // Clear existing roles and add the new one
            user.getRoles().clear();
            user.getRoles().add(role);
            userRepository.save(user);
            
            return ResponseEntity.ok("Role assigned successfully");
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + ex.getMessage());
        }
    }
}
