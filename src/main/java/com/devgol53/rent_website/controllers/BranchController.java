package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.branch.BranchGetDTO;
import com.devgol53.rent_website.entities.Branch;
import com.devgol53.rent_website.repositories.BranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("api/branches")
@CrossOrigin(origins = "*") // Permitir llamadas desde el frontend
public class BranchController {

    @Autowired
    private BranchRepository branchRepository;

    @PostMapping
    public Branch createBranch(@RequestBody Branch branch) {
        return branchRepository.save(branch);
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
