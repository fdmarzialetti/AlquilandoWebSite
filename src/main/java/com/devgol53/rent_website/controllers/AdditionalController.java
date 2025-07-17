package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.additional.AdditionalDetailDto;
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

    @PostMapping
    public ResponseEntity<?> createAdditional(@RequestBody Additional additional) {
        String name = additional.getName().trim();

        if (additionalRepository.existsByNameIgnoreCase(name)) {
            return ResponseEntity
                    .badRequest()
                    .body("Ya existe un adicional con ese nombre.");
        }

        additional.setName(name);
        additional.setState(true);
        Additional saved = additionalRepository.save(additional);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    public List<AdditionalDetailDto> getAllAdditionalsRaw() {
        return additionalRepository.findAll().stream().map(AdditionalDetailDto::new).toList();
    }



    @GetMapping("/{id}")
    public Additional getAdditionalById(@PathVariable Long id) {
        return additionalRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Adicional no encontrado"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdditional(@PathVariable Long id, @RequestBody Additional updated) {
        Additional existing = additionalRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Adicional no encontrado"));

        String trimmedName = updated.getName().trim();

        if (additionalRepository.existsByNameIgnoreCaseAndIdNot(trimmedName, id)) {
            return ResponseEntity
                    .badRequest()
                    .body("Ya existe un adicional con ese nombre.");
        }

        existing.setName(trimmedName);
        existing.setPrice(updated.getPrice());

        return ResponseEntity.ok(additionalRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deactivateAdditional(@PathVariable Long id) {
        Additional additional = additionalRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Adicional no encontrado"));

        additional.setState(false);
        additionalRepository.save(additional);

        return ResponseEntity.noContent().build();
    }

    // ✅ NUEVO: Reactivar adicional
    @PostMapping("/{id}/activate")
    public ResponseEntity<?> activateAdditional(@PathVariable Long id) {
        Additional additional = additionalRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Adicional no encontrado"));

        additional.setState(true);
        additionalRepository.save(additional);

        return ResponseEntity.ok().build();
    }
}
