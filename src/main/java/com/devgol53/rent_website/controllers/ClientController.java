package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.appUser.AppUserGetDTO;
import com.devgol53.rent_website.dtos.appUser.AppUserPostDTO;
import com.devgol53.rent_website.entities.AppUser;
import com.devgol53.rent_website.entities.Client;
import com.devgol53.rent_website.repositories.AppUserRepository;
import com.devgol53.rent_website.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.devgol53.rent_website.enums.UserRol;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*") // habilita peticiones desde frontend
public class ClientController {
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    private AppUserRepository appUserRepository;

    @PostMapping
    public ResponseEntity<?> registerClient(@RequestBody AppUserPostDTO client) {
        // 🔍 Verificar si el email ya existe
        if (appUserRepository.existsByEmail(client.getEmail())) {
            return ResponseEntity.badRequest().body("El email ya está registrado.");
        }

        // 🔍 Verificar si el DNI ya existe
        if (appUserRepository.existsByDni(client.getDni())) {
            return ResponseEntity.badRequest().body("El DNI ya está registrado.");
        }

        // 💾 Guardar el cliente
        AppUser savedClient = new AppUser(client, passwordEncoder.encode(client.getPassword()));
        appUserRepository.save(savedClient);
        return ResponseEntity.ok(savedClient);
    }

    @GetMapping
    public List<AppUserGetDTO> getAllClients() {
        return appUserRepository.findAll().stream().filter(u->u.getRol().equals(UserRol.CLIENT)).map(AppUserGetDTO::new).toList();
    }
}