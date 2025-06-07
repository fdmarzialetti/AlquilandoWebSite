package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.vehicle.VehicleGetDTO;
import com.devgol53.rent_website.dtos.vehicle.VehicleCreateDTO;
import com.devgol53.rent_website.entities.Branch;
import com.devgol53.rent_website.entities.Model;
import com.devgol53.rent_website.entities.Vehicle;
import com.devgol53.rent_website.repositories.BranchRepository;
import com.devgol53.rent_website.repositories.ModelRepository;
import com.devgol53.rent_website.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/vehicle")
@CrossOrigin(origins = "*")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private ModelRepository modelRepository;

    @PostMapping("/createVehicle")
    public ResponseEntity<String> createVehicle(@RequestBody VehicleCreateDTO vehicleCreateDTO) {
        if (vehicleRepository.existsByPatent(vehicleCreateDTO.getPatent())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe un vehículo con esa patente");
        }

        Model model = modelRepository.findById(vehicleCreateDTO.getModelId()).orElse(null);
        Branch branch = branchRepository.findById(vehicleCreateDTO.getBranchId()).orElse(null);

        if (model != null && branch != null) {
            Vehicle newVehicle = new Vehicle(vehicleCreateDTO);
            newVehicle.addModel(model);
            newVehicle.addBranch(branch);
            vehicleRepository.save(newVehicle);
            return ResponseEntity.status(HttpStatus.CREATED).body("Vehículo creado exitosamente");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Modelo o sucursal no encontrada");
    }

    @GetMapping("/listVehicles")
    public List<VehicleGetDTO> getVehicles() {
        return vehicleRepository.findAll().stream().map(VehicleGetDTO::new).toList();
    }
}