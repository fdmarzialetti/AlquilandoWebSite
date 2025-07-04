package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.model.AvalaibleModelDTO;
import com.devgol53.rent_website.dtos.model.CreateModelDTO;
import com.devgol53.rent_website.dtos.model.GetModelDTO;
import com.devgol53.rent_website.entities.Branch;
import com.devgol53.rent_website.entities.Model;
import com.devgol53.rent_website.entities.Vehicle;
import com.devgol53.rent_website.repositories.BranchRepository;
import com.devgol53.rent_website.repositories.ModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/model")
public class ModelController {

    @Autowired
    private ModelRepository modelRepository;
    @Autowired
    private BranchRepository branchRepository;

    @GetMapping("/listModels")
    public List<GetModelDTO> getModels(){
        return modelRepository.findAll().stream().map(GetModelDTO::new).toList();
    }

    @GetMapping("/listActiveModels")
    public List<GetModelDTO> getActiveModels() {
        return modelRepository.findAll().stream()
                .filter(Model::isStatus)
                .sorted(Comparator.comparing(Model::getBrand)
                        .thenComparing(Model::getName))
                .map(GetModelDTO::new)
                .toList();
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createModel(@ModelAttribute CreateModelDTO modelDto) throws IOException {
        String brand = modelDto.getBrand().trim();
        String name = modelDto.getName().trim();

        if (!modelRepository.existsByBrandIgnoreCaseAndNameIgnoreCase(brand, name)) {
            modelDto.setBrand(brand); // limpia los espacios
            modelDto.setName(name);

            Model newModel = new Model(modelDto);
            modelRepository.save(newModel);
            return ResponseEntity.status(HttpStatus.CREATED).body("Modelo creado");
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe el modelo");
    }

    @GetMapping("/availableModels")
    public List<AvalaibleModelDTO> getAvailableModels(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            @RequestParam long branchId) {

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        // Agrupamos vehículos por modelo
        Map<Model, List<Vehicle>> modelToVehicles = branch.getVehicles().stream()
                .collect(Collectors.groupingBy(Vehicle::getModel));

        return modelToVehicles.entrySet().stream()
                .filter(entry -> {
                    List<Vehicle> vehicles = entry.getValue();

                    // Contar vehículos SIN reservas superpuestas
                    long disponibles = vehicles.stream()
                            .filter(vehicle -> !vehicle.hasOverlappingReservation(startDate, endDate))
                            .count();

                    return disponibles > 0;
                })
                .map(entry -> {
                    Model model = entry.getKey();

                    // Obtener valoraciones con score válido
                    List<Integer> scores = model.getReservations().stream()
                            .map(r->r.getValoration())
                            .filter(Objects::nonNull)
                            .map(v->v.getScore())
                            .filter(Objects::nonNull)
                            .collect(Collectors.toList());

                    int scorePromedio = 0;
                    if (!scores.isEmpty()) {
                        double promedio = scores.stream().mapToInt(Integer::intValue).average().orElse(0);
                        scorePromedio = (int) Math.ceil(promedio);
                    }

                    return new AvalaibleModelDTO(model,scorePromedio);
                })
                .toList();
    }
    @GetMapping("/detalle")
    public ResponseEntity<GetModelDTO> getModelByBrandAndName(
            @RequestParam String brand,
            @RequestParam String name) {

        return modelRepository.findByBrandAndName(brand, name)
                .map(m->ResponseEntity.status(HttpStatus.OK).body(new GetModelDTO(m)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<String> deactivateModel(@PathVariable Long id) {
        return modelRepository.findById(id).map(model -> {
            if (model.hasActiveVehicles()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("No se puede eliminar el modelo porque tiene vehículos asociados.");
            }

            model.setStatus(false);
            modelRepository.save(model);
            return ResponseEntity.ok("Modelo eliminado");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Modelo no encontrado"));
    }

}
