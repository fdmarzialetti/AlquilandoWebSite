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
        Map<Model, Long> modelToVehicleCount = branch.getVehicles().stream()
                .collect(Collectors.groupingBy(Vehicle::getModel, Collectors.counting()));

        List<AvalaibleModelDTO> availableModels = modelToVehicleCount.entrySet().stream()
                .filter(entry -> {
                    Model model = entry.getKey();
                    long totalVehicles = entry.getValue();

                    // Filtramos las reservas activas (no canceladas) que se solapan con el rango dado
                    long overlappingReservations = model.getReservations().stream()
                            .filter(res -> !res.getCancelled()) // 👈 Excluye canceladas
                            .filter(res -> {
                                LocalDate resStart = res.getStartDate();
                                LocalDate resEnd = res.getEndDate();
                                return !resEnd.isBefore(startDate) && !resStart.isAfter(endDate);
                            })
                            .count();

                    // Solo devolvemos el modelo si tiene más vehículos que reservas superpuestas activas
                    return overlappingReservations < totalVehicles;
                })
                .map(Map.Entry::getKey)
                .sorted(Comparator.comparing(Model::getBrand)
                        .thenComparing(Model::getName))
                .map(AvalaibleModelDTO::new)
                .toList();

        return availableModels;
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
