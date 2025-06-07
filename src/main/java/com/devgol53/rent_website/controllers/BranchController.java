package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.branch.BranchGetDTO;
import com.devgol53.rent_website.entities.Branch;
import com.devgol53.rent_website.repositories.BranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
@CrossOrigin(origins = "*") // Permitir llamadas desde el frontend
public class BranchController {

    @Autowired
    private BranchRepository branchRepository;

    @PostMapping
    public ResponseEntity<?> createBranch(@RequestBody Branch branch) {
        String city = branch.getCity().trim();
        String address = branch.getAddress().trim();

        if (branchRepository.existsByCityIgnoreCaseAndAddressIgnoreCase(city, address)) {
            return ResponseEntity
                    .badRequest()
                    .body("Ya existe una sucursal con esa ciudad y dirección.");
        }

        branch.setCity(city);      // guardar sin espacios extra
        branch.setAddress(address);

        Branch saved = branchRepository.save(branch);
        return ResponseEntity.ok(saved);
    }


    @GetMapping()
    public List<BranchGetDTO> getAllBranches() {
        return branchRepository.findAll().stream().map(BranchGetDTO::new).toList();
    }

    @DeleteMapping("/{id}")
    public void deleteBranch(@PathVariable Long id) {
        branchRepository.deleteById(id);
    }

    @GetMapping("/{id}")
    public BranchGetDTO getBranchById(@PathVariable Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sucursal no encontrada"));
        return new BranchGetDTO(branch);
    }



}
