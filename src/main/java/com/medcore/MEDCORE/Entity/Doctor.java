package com.medcore.MEDCORE.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Doctor name is required")
    private String doctorName;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    private String qualification;

    @Min(0)
    @Max(60)
    private Integer experience;

    @Column(unique = true)
    private String phone;

    @Email(message = "Enter a valid email")
    @Column(unique = true)
    private String email;

    private Double consultationFee;
}