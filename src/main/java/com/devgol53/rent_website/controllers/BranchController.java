package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.entities.Branch;
import com.devgol53.rent_website.repositories.BranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
@CrossOrigin(origins = "*") // Permitir llamadas desde el frontend
public class BranchController {

    @Autowired
    private BranchRepository branchRepository;

    @PostMapping
    public ResponseEntity<?> createBranch(@RequestBody Branch branch) {
        // Validación: evitar duplicados
        if (branchRepository.existsByCityAndAddress(branch.getCity(), branch.getAddress())) {
            return ResponseEntity
                    .badRequest()
                    .body("Ya existe una sucursal con esa ciudad y dirección.");
        }

        // Si no existe, se guarda
        Branch saved = branchRepository.save(branch);
        return ResponseEntity.ok(saved);
    }
    @GetMapping
    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteBranch(@PathVariable Long id) {
        branchRepository.deleteById(id);
    }


}
