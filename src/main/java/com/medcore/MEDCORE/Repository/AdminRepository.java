package com.medcore.MEDCORE.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medcore.MEDCORE.Entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByEmail(String email);

}