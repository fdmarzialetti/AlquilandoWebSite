package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.appUser.AppUserGetDTO;
import com.devgol53.rent_website.dtos.appUser.AppUserPostDTO;
import com.devgol53.rent_website.dtos.email.EmailDTO;
import com.devgol53.rent_website.entities.AppUser;
import com.devgol53.rent_website.entities.Client;
import com.devgol53.rent_website.repositories.AppUserRepository;
import com.devgol53.rent_website.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.devgol53.rent_website.enums.UserRol;
import java.util.List;
import com.devgol53.rent_website.utils.CodeGenerator;
import com.devgol53.rent_website.services.IEmailService;
import jakarta.mail.MessagingException;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*") // habilita peticiones desde frontend
public class ClientController {
    @Autowired
    private IEmailService iEmailService;
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

        String passwordToUse;

        if (client.isRegistradoPorEmpleado()) {
            // Genero clave
            passwordToUse = CodeGenerator.generarCodigoAlfanumerico();

            //guardo cliente
            AppUser savedClient = new AppUser(client, passwordEncoder.encode(passwordToUse));
            savedClient.setRol(UserRol.CLIENT);
            savedClient.setMustChangePassword(true);
            appUserRepository.save(savedClient);

            //  cuerpo
            String cuerpo = "Hola " + client.getName() + ",\n\n" +
                    "Has sido registrado exitosamente en Alquilando por uno de nuestros empleados.\n\n" +
                    "Tu contraseña temporal es: **" + passwordToUse + "**\n\n" +
                    "Por favor, inicia sesión y cámbiala lo antes posible para mantener tu cuenta segura.\n\n" +
                    "Saludos,\nEquipo de Alquilando";

            // Envio de Email
            try {
                iEmailService.sendMail(new EmailDTO(
                        "email-registro-cliente",
                        client.getEmail(),
                        "✅ Registro exitoso – Alquilando",
                        cuerpo
                ));
            } catch (MessagingException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("No se pudo enviar el correo electrónico.");
            }

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Cliente registrado correctamente. Recibirá su contraseña por correo electrónico.");
        } else {
            // 👤 Cliente se registró a sí mismo
            passwordToUse = client.getPassword();

            AppUser savedClient = new AppUser(client, passwordEncoder.encode(passwordToUse));
            appUserRepository.save(savedClient);

            return ResponseEntity.ok("Cliente registrado con éxito.");
        }
    }

    @GetMapping
    public List<AppUserGetDTO> getAllClients() {
        return appUserRepository.findAll().stream().filter(u->u.getRol().equals(UserRol.CLIENT)).map(AppUserGetDTO::new).toList();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id) {
        return appUserRepository.findById(id).map(client -> {
            appUserRepository.delete(client);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

}