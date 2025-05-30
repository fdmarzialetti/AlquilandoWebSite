package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.car.CarGetDto;
import com.devgol53.rent_website.dtos.car.CarPostDto;
import com.devgol53.rent_website.dtos.model.CreateModelDTO;
import com.devgol53.rent_website.entities.Car;
import com.devgol53.rent_website.entities.Model;
import com.devgol53.rent_website.repositories.ModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/model")
public class ModelController {

    @Autowired
    private ModelRepository modelRepository;

    @GetMapping("/listModels")
    public List<Model> getModels(){
        return modelRepository.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<String> createModel(@RequestBody CreateModelDTO modelDto){
        if(!modelRepository.existsByBrandAndName(modelDto.getBrand(),modelDto.getName())) {
            Model newModel = new Model(modelDto);
            modelRepository.save(newModel);
            return ResponseEntity.status(HttpStatus.CREATED).body("Modelo creado prueba 1");
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe el modelo");
    }
}
