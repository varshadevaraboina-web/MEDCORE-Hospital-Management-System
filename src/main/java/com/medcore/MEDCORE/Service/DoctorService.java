package com.medcore.MEDCORE.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.medcore.MEDCORE.Entity.Doctor;
import com.medcore.MEDCORE.Repository.DoctorRepository;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    // Add Doctor
    public Doctor addDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    // Get All Doctors
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // Get Doctor By ID
    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    // Update Doctor
    public Doctor updateDoctor(Long id, Doctor doctor) {

        Doctor existingDoctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        existingDoctor.setDoctorName(doctor.getDoctorName());
        existingDoctor.setSpecialization(doctor.getSpecialization());
        existingDoctor.setQualification(doctor.getQualification());
        existingDoctor.setExperience(doctor.getExperience());
        existingDoctor.setPhone(doctor.getPhone());
        existingDoctor.setEmail(doctor.getEmail());
        existingDoctor.setConsultationFee(doctor.getConsultationFee());

        return doctorRepository.save(existingDoctor);
    }

    // Delete Doctor
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
}