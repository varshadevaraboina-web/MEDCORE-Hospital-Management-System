package com.medcore.MEDCORE.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medcore.MEDCORE.Entity.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

}