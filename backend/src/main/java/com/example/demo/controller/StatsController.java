package com.example.demo.controller;

import com.example.demo.repository.*;
import com.example.demo.models.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin/stats")
public class StatsController {

    private final UserRepository userRepository;
    private final EmployeRepository employeRepository;
    private final RoleRepository roleRepository;
    private final DirectionRepository directionRepository;
    private final ComiteRepository comiteRepository;
    private final MembreComiteRepository membreComiteRepository;

    public StatsController(UserRepository userRepository, EmployeRepository employeRepository,
                          RoleRepository roleRepository, DirectionRepository directionRepository,
                          ComiteRepository comiteRepository, MembreComiteRepository membreComiteRepository) {
        this.userRepository = userRepository;
        this.employeRepository = employeRepository;
        this.roleRepository = roleRepository;
        this.directionRepository = directionRepository;
        this.comiteRepository = comiteRepository;
        this.membreComiteRepository = membreComiteRepository;
    }

    /**
     * Get comprehensive dashboard statistics
     */
    @GetMapping("")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();

            // 1. User Statistics
            List<User> allUsers = userRepository.findAll();
            long totalUsers = allUsers.size();
            long enabledUsers = allUsers.stream().filter(User::isEnabled).count();
            long disabledUsers = totalUsers - enabledUsers;

            stats.put("totalUsers", totalUsers);
            stats.put("enabledUsers", enabledUsers);
            stats.put("disabledUsers", disabledUsers);
            stats.put("enabledPercentage", totalUsers > 0 ? (enabledUsers * 100 / totalUsers) : 0);

            // 2. Role Distribution
            Map<String, Long> roleDistribution = new HashMap<>();
            roleDistribution.put("admin_informatique", countUsersByRoleName("admin_informatique"));
            roleDistribution.put("admin_cabinet", countUsersByRoleName("admin_cabinet"));
            roleDistribution.put("directeur", countUsersByRoleName("directeur"));
            roleDistribution.put("user", countUsersByRoleName("user"));
            roleDistribution.put("sans_role", countUsersWithoutRole());

            stats.put("roleDistribution", roleDistribution);

            // 3. Employee Statistics
            List<Employe> allEmployes = employeRepository.findAll();
            long totalEmployes = allEmployes.size();
            long employesWithUser = allEmployes.stream()
                    .filter(e -> e.getUser() != null)
                    .count();
            long employesWithoutUser = totalEmployes - employesWithUser;

            stats.put("totalEmployes", totalEmployes);
            stats.put("employesWithUser", employesWithUser);
            stats.put("employesWithoutUser", employesWithoutUser);

            // 4. Direction Statistics
            List<Direction> allDirections = directionRepository.findAll();
            long totalDirections = allDirections.size();
            stats.put("totalDirections", totalDirections);

            // 5. Committee Statistics
            List<Comite> allComites = comiteRepository.findAll();
            stats.put("totalComites", allComites.size());

            long totalMembers = membreComiteRepository.count();
            stats.put("totalComiteMembers", totalMembers);

            // 6. User Activity Breakdown (simulated for now)
            Map<String, Object> activityStats = new HashMap<>();
            activityStats.put("activeToday", (int) (enabledUsers * 0.6)); // Simulated
            activityStats.put("activeThisWeek", (int) (enabledUsers * 0.8));
            activityStats.put("inactive", disabledUsers);

            stats.put("activityStats", activityStats);

            // 7. System Health
            Map<String, Object> systemHealth = new HashMap<>();
            systemHealth.put("usersWithoutRole", countUsersWithoutRole());
            systemHealth.put("employesWithoutAccount", employesWithoutUser);
            systemHealth.put("directionsCoverage", totalEmployes > 0 ?
                    (int) ((double) employesWithUser * 100 / totalEmployes) : 0);

            stats.put("systemHealth", systemHealth);

            return ResponseEntity.ok(stats);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(
                    Collections.singletonMap("error", "Failed to fetch stats: " + ex.getMessage())
            );
        }
    }

    /**
     * Get detailed role statistics with user names
     */
    @GetMapping("/roles-detailed")
    public ResponseEntity<Map<String, Object>> getRolesDetailed() {
        try {
            Map<String, Object> result = new HashMap<>();
            List<Role> allRoles = roleRepository.findAll();

            for (Role role : allRoles) {
                List<Map<String, Object>> usersList = new ArrayList<>();
                for (User user : role.getUsers()) {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("id", user.getId());
                    userInfo.put("email", user.getEmail());
                    userInfo.put("enabled", user.isEnabled());
                    usersList.add(userInfo);
                }
                result.put(role.getName(), usersList);
            }

            // Users without role
            List<Map<String, Object>> noRoleUsers = new ArrayList<>();
            for (User user : userRepository.findAll()) {
                if (user.getRoles().isEmpty()) {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("id", user.getId());
                    userInfo.put("email", user.getEmail());
                    userInfo.put("enabled", user.isEnabled());
                    noRoleUsers.add(userInfo);
                }
            }
            result.put("sans_role", noRoleUsers);

            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(
                    Collections.singletonMap("error", "Failed to fetch role details: " + ex.getMessage())
            );
        }
    }

    /**
     * Get employee statistics with coverage analysis
     */
    @GetMapping("/employes")
    public ResponseEntity<Map<String, Object>> getEmployeStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            List<Employe> allEmployes = employeRepository.findAll();

            // By direction
            Map<String, Long> byDirection = new HashMap<>();
            for (Direction dir : directionRepository.findAll()) {
                long count = employeRepository.findByDirectionId(dir.getId()).size();
                byDirection.put(dir.getLib(), count);
            }
            stats.put("byDirection", byDirection);

            // With/Without accounts
            long withAccounts = allEmployes.stream()
                    .filter(e -> e.getUser() != null)
                    .count();
            stats.put("withAccounts", withAccounts);
            stats.put("withoutAccounts", allEmployes.size() - withAccounts);

            // List employees without user account
            List<Map<String, Object>> noAccountList = new ArrayList<>();
            for (Employe emp : allEmployes) {
                if (emp.getUser() == null) {
                    Map<String, Object> empInfo = new HashMap<>();
                    empInfo.put("id", emp.getId());
                    empInfo.put("nom", emp.getNom());
                    empInfo.put("prenom", emp.getPrenom());
                    empInfo.put("matricule", emp.getMatricule());
                    if (emp.getDirection() != null) {
                        empInfo.put("direction", emp.getDirection().getLib());
                    }
                    noAccountList.add(empInfo);
                }
            }
            stats.put("employesWithoutAccount", noAccountList);

            return ResponseEntity.ok(stats);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(
                    Collections.singletonMap("error", "Failed to fetch employe stats: " + ex.getMessage())
            );
        }
    }

    // Helper methods
    private long countUsersByRoleName(String roleName) {
        try {
            Optional<Role> role = roleRepository.findByName(roleName);
            if (role.isPresent()) {
                return role.get().getUsers().size();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    private long countUsersWithoutRole() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRoles().isEmpty())
                .count();
    }
}
