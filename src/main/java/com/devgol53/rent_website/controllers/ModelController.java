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
import java.util.List;

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

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createModel(@ModelAttribute CreateModelDTO modelDto) throws IOException {
        if (!modelRepository.existsByBrandAndName(modelDto.getBrand(), modelDto.getName())) {
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
            @RequestParam long branchId){
        Branch branch = branchRepository.findById(branchId).get();
        List<AvalaibleModelDTO> availableModels = branch.getVehicles().stream()
                .filter(v -> !v.hasOverlappingReservation(startDate, endDate)) // vehículos SIN reservas en esas fechas
                .map(Vehicle::getModel) // obtener el modelo de cada vehículo
                .distinct() // eliminar modelos repetidos
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

}
