package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.entities.Client;
import com.devgol53.rent_website.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.devgol53.rent_website.enums.UserRol;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*") // habilita peticiones desde frontend
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    @PostMapping
    public ResponseEntity<?> registerClient(@RequestBody Client client) {
        // 🔍 Verificar si el email ya existe
        if (clientRepository.existsByEmail(client.getEmail())) {
            return ResponseEntity.badRequest().body("El email ya está registrado.");
        }

        // 🔍 Verificar si el DNI ya existe
        if (clientRepository.existsByDni(client.getDni())) {
            return ResponseEntity.badRequest().body("El DNI ya está registrado.");
        }

        // ✅ Asignar rol por defecto si no se recibe desde el frontend
        if (client.getRol() == null) {
            client.setRol(UserRol.CLIENT);
        }

        // 💾 Guardar el cliente
        Client savedClient = clientRepository.save(client);
        return ResponseEntity.ok(savedClient);
    }

    @GetMapping
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }
}