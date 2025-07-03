package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.entities.Additional;
import com.devgol53.rent_website.repositories.AdditionalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/additionals")
@CrossOrigin(origins = "*")
public class AdditionalController {

    @Autowired
    private AdditionalRepository additionalRepository;

    // ✅ Crear adicional
    @PostMapping
    public ResponseEntity<?> createAdditional(@RequestBody Additional additional) {
        String name = additional.getName().trim();

        if (additionalRepository.existsByNameIgnoreCase(name)) {
            return ResponseEntity
                    .badRequest()
                    .body("Ya existe un adicional con ese nombre.");
        }

        additional.setName(name);
        additional.setState(true); // alta lógica
        Additional saved = additionalRepository.save(additional);

        return ResponseEntity.ok(saved);
    }

    // Devuelve TODOS, activos e inactivos
    @GetMapping("/all")
    public List<Additional> getAllAdditionalsRaw() {
        return additionalRepository.findAll();
    }

    // ✅ Obtener uno por ID
    @GetMapping("/{id}")
    public Additional getAdditionalById(@PathVariable Long id) {
        return additionalRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Adicional no encontrado"));
    }

    // ✅ Modificar
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdditional(@PathVariable Long id, @RequestBody Additional updated) {
        Additional existing = additionalRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Adicional no encontrado"));

        existing.setName(updated.getName().trim());
        existing.setPrice(updated.getPrice());

        return ResponseEntity.ok(additionalRepository.save(existing));
    }

    // ✅ Baja lógica
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deactivateAdditional(@PathVariable Long id) {
        Additional additional = additionalRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Adicional no encontrado"));

        additional.setState(false);
        additionalRepository.save(additional);

        return ResponseEntity.noContent().build();
    }
}
