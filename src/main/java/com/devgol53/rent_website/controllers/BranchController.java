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
import java.util.Optional;

@RestController
@RequestMapping("/api/branches")
@CrossOrigin(origins = "*")
public class BranchController {

    @Autowired
    private BranchRepository branchRepository;
    @PostMapping("/{id}/activate")
    public ResponseEntity<?> activateBranch(@PathVariable Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sucursal no encontrada"));

        branch.setState(true);
        branchRepository.save(branch);
        return ResponseEntity.ok("Sucursal reactivada");
    }
    // Lista las sucursales inactivas (state == false)
    @GetMapping("/inactive")
    public List<BranchGetDTO> getInactiveBranches() {
        return branchRepository.findByStateFalse()
                .stream()
                .map(BranchGetDTO::new)
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> createBranch(@RequestBody Branch branch) {
        String city = branch.getCity().trim();
        String address = branch.getAddress().trim();

        if (branchRepository.existsByCityIgnoreCaseAndAddressIgnoreCase(city, address)) {
            return ResponseEntity
                    .badRequest()
                    .body("Ya existe una sucursal con esa ciudad y dirección.");
        }

        branch.setCity(city);
        branch.setAddress(address);
        branch.setState(true); // Asegura que se cree con estado TRUE

        Branch saved = branchRepository.save(branch);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBranch(@PathVariable Long id, @RequestBody Branch updatedBranch) {
        Optional<Branch> optionalBranch = branchRepository.findById(id);

        if (optionalBranch.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sucursal no encontrada.");
        }

        String city = updatedBranch.getCity().trim();
        String address = updatedBranch.getAddress().trim();

        // Verifica si ya existe otra sucursal con esa ciudad y dirección
        boolean exists = branchRepository.existsByCityIgnoreCaseAndAddressIgnoreCaseAndIdNot(city, address, id);
        if (exists) {
            return ResponseEntity
                    .badRequest()
                    .body("Ya existe otra sucursal con esa ciudad y dirección.");
        }

        Branch branch = optionalBranch.get();
        branch.setCity(city);
        branch.setAddress(address);
        // cualquier otro campo a actualizar...

        branchRepository.save(branch);
        return ResponseEntity.ok("Sucursal actualizada con éxito.");
    }



    // Solo lista las sucursales activas (state == true)
    @GetMapping
    public List<BranchGetDTO> getAllBranches() {
        return branchRepository.findByStateTrue().stream().map(BranchGetDTO::new).toList();
    }

    //  Cambia el estado a false en lugar de eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deactivateBranch(@PathVariable Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sucursal no encontrada"));

        // Verifica si tiene vehículos o empleados asociados
        if (!branch.getEmployees().isEmpty() || branch.hasActiveVehicles()) {
            return ResponseEntity.badRequest()
                    .body("No se puede desactivar la sucursal porque tiene empleados o vehículos asociados.");
        }

        // Desactiva la sucursal
        branch.setState(false);
        branchRepository.save(branch);

        return ResponseEntity.noContent().build();
    }



    @GetMapping("/{id}")
    public BranchGetDTO getBranchById(@PathVariable Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sucursal no encontrada"));
        return new BranchGetDTO(branch);
    }
}
