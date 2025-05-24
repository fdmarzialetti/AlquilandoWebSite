package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.car.CarGetDto;
import com.devgol53.rent_website.dtos.vehicle.VehicleCreateDTO;
import com.devgol53.rent_website.entities.Model;
import com.devgol53.rent_website.entities.Vehicle;
import com.devgol53.rent_website.repositories.ModelRepository;
import com.devgol53.rent_website.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/vehicle")
public class VehicleController {
    @Autowired
    VehicleRepository vehicleRepository;
    @Autowired
    ModelRepository modelRepository;
    @PostMapping("createVehicle")
    public ResponseEntity<String> createVehicle(@RequestBody VehicleCreateDTO vehicleCreateDTO){
        Model model = modelRepository.getById(vehicleCreateDTO.getModelId());
        if(model!=null){
            Vehicle newVehicle = new Vehicle(vehicleCreateDTO);
            newVehicle.addModel(model);
            vehicleRepository.save(newVehicle);
            modelRepository.save(model);
            return ResponseEntity.status(HttpStatus.CREATED).body("Vehiculo creado exitosamente");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encuentra el modelo");
    }
}
