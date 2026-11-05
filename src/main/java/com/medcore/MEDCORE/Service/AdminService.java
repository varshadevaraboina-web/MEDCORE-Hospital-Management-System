package com.medcore.MEDCORE.Service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.medcore.MEDCORE.Entity.Admin;
import com.medcore.MEDCORE.Repository.AdminRepository;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(AdminRepository adminRepository,
                        PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Register Admin
    public Admin registerAdmin(Admin admin) {

        if (adminRepository.findByEmail(admin.getEmail()).isPresent()) {
            throw new RuntimeException("Admin email already exists!");
        }

        admin.setPassword(passwordEncoder.encode(admin.getPassword()));

        return adminRepository.save(admin);
    }

    // Login Admin
    public boolean loginAdmin(String email, String password) {

        Optional<Admin> admin = adminRepository.findByEmail(email);

        if (admin.isPresent()) {
            return passwordEncoder.matches(
                password,
                admin.get().getPassword()
            );
        }

        return false;
    }
}