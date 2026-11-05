package com.medcore.MEDCORE.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medcore.MEDCORE.Entity.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

}