package com.medcore.MEDCORE;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class MedcoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedcoreApplication.class, args);
    }

}