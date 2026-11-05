package com.medcore.MEDCORE.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medcore.MEDCORE.Entity.Admin;
import com.medcore.MEDCORE.Service.AdminService;
import com.medcore.MEDCORE.Service.JwtService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;
    private final JwtService jwtService;

    public AdminController(
            AdminService adminService,
            JwtService jwtService) {

        this.adminService = adminService;
        this.jwtService = jwtService;
    }

    // ADMIN REGISTRATION

    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin admin) {

        try {

            Admin savedAdmin = adminService.registerAdmin(admin);

            Map<String, Object> response = new HashMap<>();

            response.put("message", "Admin registered successfully!");
            response.put("id", savedAdmin.getId());
            response.put("name", savedAdmin.getName());
            response.put("email", savedAdmin.getEmail());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> response = new HashMap<>();

            response.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }
    }

    // ADMIN LOGIN WITH JWT

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        if (email == null || password == null
                || email.isBlank() || password.isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Email and password are required."
                    ));
        }

        boolean loginSuccess =
                adminService.loginAdmin(email, password);

        if (loginSuccess) {

            String token = jwtService.generateToken(email);

            Map<String, Object> response = new HashMap<>();

            response.put("message", "Login successful!");
            response.put("token", token);
            response.put("email", email);

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "message",
                        "Invalid email or password."
                ));
    }
}