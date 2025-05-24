package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.entities.Model;
import com.devgol53.rent_website.repositories.ModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
