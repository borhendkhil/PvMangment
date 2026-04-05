package com.example.demo.controller;

import com.example.demo.models.Role;
import com.example.demo.models.Permission;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.PermissionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/role-permissions")
public class RolePermissionController {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public RolePermissionController(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    public static class RolePermissionDTO {
        public Integer roleId;
        public String roleName;
        public String roleLabelAr;
        public List<Integer> permissionIds;
        public List<String> permissionNames;

        public RolePermissionDTO(Role role) {
            this.roleId = role.getId();
            this.roleName = role.getName();
            this.roleLabelAr = role.getLabelAr();
            this.permissionIds = role.getPermissions() != null ? 
                    role.getPermissions().stream().map(Permission::getId).collect(Collectors.toList()) : 
                    List.of();
            this.permissionNames = role.getPermissions() != null ? 
                    role.getPermissions().stream().map(Permission::getName).collect(Collectors.toList()) : 
                    List.of();
        }
    }

    @GetMapping
    public ResponseEntity<List<RolePermissionDTO>> getAllRolePermissions() {
        try {
            List<Role> roles = roleRepository.findAll();
            List<RolePermissionDTO> dtos = roles.stream()
                    .map(RolePermissionDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{roleId}")
    public ResponseEntity<RolePermissionDTO> getRolePermissions(@PathVariable @NonNull Integer roleId) {
        try {
            Optional<Role> roleOpt = roleRepository.findById(roleId);
            if (roleOpt.isPresent()) {
                return ResponseEntity.ok(new RolePermissionDTO(roleOpt.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> assignPermissionsToRole(@RequestBody Map<String, Object> request) {
        try {
            Integer roleId = ((Number) request.get("roleId")).intValue();
            List<Integer> permissionIds = (List<Integer>) request.get("permissionIds");

            Optional<Role> roleOpt = roleRepository.findById(roleId);
            if (roleOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Rôle non trouvé");
            }

            Role role = roleOpt.get();
            role.getPermissions().clear();

            if (permissionIds != null && !permissionIds.isEmpty()) {
                for (Integer permissionId : permissionIds) {
                    Optional<Permission> permissionOpt = permissionRepository.findById(permissionId);
                    permissionOpt.ifPresent(p -> role.getPermissions().add(p));
                }
            }

            Role savedRole = roleRepository.save(role);
            return ResponseEntity.status(HttpStatus.CREATED).body(new RolePermissionDTO(savedRole));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'assignation: " + e.getMessage());
        }
    }

    @PutMapping("/{roleId}")
    public ResponseEntity<?> updateRolePermissions(@PathVariable @NonNull Integer roleId, @RequestBody Map<String, Object> request) {
        try {
            Optional<Role> roleOpt = roleRepository.findById(roleId);
            if (roleOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rôle non trouvé");
            }

            Role role = roleOpt.get();
            List<Integer> permissionIds = (List<Integer>) request.get("permissionIds");

            role.getPermissions().clear();

            if (permissionIds != null && !permissionIds.isEmpty()) {
                for (Integer permissionId : permissionIds) {
                    Optional<Permission> permissionOpt = permissionRepository.findById(permissionId);
                    permissionOpt.ifPresent(p -> role.getPermissions().add(p));
                }
            }

            Role updatedRole = roleRepository.save(role);
            return ResponseEntity.ok(new RolePermissionDTO(updatedRole));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }

    @DeleteMapping("/{roleId}")
    public ResponseEntity<?> removeAllPermissionsFromRole(@PathVariable @NonNull Integer roleId) {
        try {
            Optional<Role> roleOpt = roleRepository.findById(roleId);
            if (roleOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rôle non trouvé");
            }

            Role role = roleOpt.get();
            role.getPermissions().clear();
            roleRepository.save(role);

            return ResponseEntity.ok("Permissions supprimées du rôle avec succès");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la suppression: " + e.getMessage());
        }
    }
}
