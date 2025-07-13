package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.model.CreateModelDTO;
import com.devgol53.rent_website.dtos.model.GetModelDTO;
import com.devgol53.rent_website.entities.Model;
import com.devgol53.rent_website.repositories.ModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/model")
@CrossOrigin(origins = "*")
public class ModelController {

    @Autowired
    private ModelRepository modelRepository;

    // Listar TODOS los modelos
    @GetMapping("/listModels")
    public List<GetModelDTO> getAllModels() {
        return modelRepository.findAll().stream().map(GetModelDTO::new).toList();
    }

    @GetMapping("/listActiveModels")
    public List<GetModelDTO> getActiveModels() {
        return modelRepository.findByStatusTrue().stream().map(GetModelDTO::new).toList();
    }

    @GetMapping("/listInactiveModels")
    public List<GetModelDTO> getInactiveModels() {
        return modelRepository.findByStatusFalse().stream().map(GetModelDTO::new).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GetModelDTO> getModelById(@PathVariable Long id) {
        return modelRepository.findById(id)
                .map(model -> ResponseEntity.ok(new GetModelDTO(model)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createModel(@ModelAttribute CreateModelDTO dto) throws IOException {
        String brand = dto.getBrand().trim();
        String name = dto.getName().trim();

        if (modelRepository.existsByBrandIgnoreCaseAndNameIgnoreCase(brand, name)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Ya existe un modelo con esa marca y nombre.");
        }

        dto.setBrand(brand);
        dto.setName(name);
        Model model = new Model(dto);
        model.setStatus(true); // activo por defecto
        modelRepository.save(model);

        return ResponseEntity.status(HttpStatus.CREATED).body("Modelo creado exitosamente.");
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateModel(@PathVariable Long id, @ModelAttribute CreateModelDTO dto) throws IOException {
        Optional<Model> optionalModel = modelRepository.findById(id);
        if (optionalModel.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Modelo no encontrado.");
        }

        String brand = dto.getBrand().trim();
        String name = dto.getName().trim();

        boolean exists = modelRepository.existsByBrandIgnoreCaseAndNameIgnoreCaseAndIdNot(brand, name, id);
        if (exists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Ya existe otro modelo con esa marca y nombre.");
        }

        Model model = optionalModel.get();
        model.setBrand(brand);
        model.setName(name);
        model.setPrice(dto.getPrice());
        model.setCapacity(dto.getCapacity());
        model.setCancelationPolicy(dto.getCancelationPolicy());

        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            model.setImage(dto.getImage().getBytes());
        }

        modelRepository.save(model);
        return ResponseEntity.ok("Modelo actualizado con éxito.");
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<String> deactivateModel(@PathVariable Long id) {
        return modelRepository.findById(id).map(model -> {
            if (model.hasActiveVehicles()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("No se puede desactivar el modelo porque tiene vehículos activos asociados.");
            }

            model.setStatus(false);
            modelRepository.save(model);
            return ResponseEntity.ok("Modelo desactivado correctamente.");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Modelo no encontrado."));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<String> activateModel(@PathVariable Long id) {
        return modelRepository.findById(id).map(model -> {
            model.setStatus(true);
            modelRepository.save(model);
            return ResponseEntity.ok("Modelo reactivado correctamente.");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Modelo no encontrado."));
    }
}
