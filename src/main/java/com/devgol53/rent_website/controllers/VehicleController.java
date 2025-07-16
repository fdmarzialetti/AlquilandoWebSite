    package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.vehicle.VehicleGetDTO;
import com.devgol53.rent_website.dtos.vehicle.VehicleCreateDTO;
import com.devgol53.rent_website.entities.Branch;
import com.devgol53.rent_website.entities.Model;
import com.devgol53.rent_website.entities.Vehicle;
import com.devgol53.rent_website.repositories.AppUserRepository;
import com.devgol53.rent_website.repositories.BranchRepository;
import com.devgol53.rent_website.repositories.ModelRepository;
import com.devgol53.rent_website.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.devgol53.rent_website.dtos.vehicle.VehicleGetDTO;
import com.devgol53.rent_website.dtos.vehicle.VehicleCreateDTO;
import com.devgol53.rent_website.entities.AppUser;
import com.devgol53.rent_website.entities.Branch;
import com.devgol53.rent_website.entities.Model;
import com.devgol53.rent_website.entities.Vehicle;
import com.devgol53.rent_website.enums.UserRol;
import com.devgol53.rent_website.repositories.AppUserRepository;
import com.devgol53.rent_website.repositories.BranchRepository;
import com.devgol53.rent_website.repositories.ModelRepository;
import com.devgol53.rent_website.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/vehicle")
@CrossOrigin(origins = "*")
public class VehicleController {

        @Autowired
        private AppUserRepository appUserRepository;

        @Autowired
        private VehicleRepository vehicleRepository;

        @Autowired
        private BranchRepository branchRepository;

        @Autowired
        private ModelRepository modelRepository;

        @PostMapping("/createVehicle")
        public ResponseEntity<String> createVehicle(@RequestBody VehicleCreateDTO vehicleCreateDTO) {

            // Normalizo la patente antes de verificar existencia
            String normalizedPatent = vehicleCreateDTO.getPatent().replaceAll("\\s+", "").toUpperCase();

            if (vehicleRepository.existsByPatent(normalizedPatent)) {
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

        @PutMapping("/{id}/updateVehicle")
        public ResponseEntity<String> updateVehicle(@PathVariable Long id, @RequestBody VehicleCreateDTO dto) {
            return vehicleRepository.findById(id).map(vehicle -> {
                String normalizedPatent = dto.getPatent().replaceAll("\\s+", "").toUpperCase();

                Optional<Vehicle> existing = vehicleRepository.findByPatent(normalizedPatent);
                if (existing.isPresent() && existing.get().getId() != id) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("Ya existe otro vehículo con esa patente");
                }

                vehicle.setPatent(normalizedPatent);
                vehicle.setYearV(dto.getYearV());
                vehicle.setMaintence(dto.getMaintence());

                modelRepository.findById(dto.getModelId()).ifPresent(vehicle::addModel);
                branchRepository.findById(dto.getBranchId()).ifPresent(vehicle::addBranch);

                vehicleRepository.save(vehicle);
                return ResponseEntity.ok("Vehículo actualizado correctamente");
            }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vehículo no encontrado"));
        }


        @GetMapping("/listVehicles/active")
        public List<VehicleGetDTO> getActiveVehicles(Authentication auth) {
            AppUser appUser = appUserRepository.findByEmail(auth.getName()).get();

            if (appUser.getRol().equals(UserRol.ADMIN)) {
                // Admin: ver todos los vehículos activos
                return vehicleRepository.findByActiveTrue().stream()
                        .map(VehicleGetDTO::new)
                        .toList();
            }

            // Empleado: vehículos activos de su sucursal
            return vehicleRepository.findByActiveTrue().stream()
                    .filter(v -> v.getBranch().equals(appUser.getBranch()))
                    .map(VehicleGetDTO::new)
                    .toList();
        }

        @GetMapping("/listVehicles/inactive")
        public List<VehicleGetDTO> getInactiveVehicles(Authentication auth) {
            AppUser appUser = appUserRepository.findByEmail(auth.getName()).get();

            if (appUser.getRol().equals(UserRol.ADMIN)) {
                // Admin: ver todos los vehículos activos
                return vehicleRepository.findByActiveFalse().stream()
                        .map(VehicleGetDTO::new)
                        .toList();
            }

            // Empleado: vehículos inactivos de su sucursal
            return vehicleRepository.findByActiveFalse().stream()
                    .filter(v -> v.getBranch().equals(appUser.getBranch()))
                    .map(VehicleGetDTO::new)
                    .toList();

        }

        @GetMapping("/listVehicles")
        public List<VehicleGetDTO> getVehicles(Authentication auth) {
            AppUser appUser = appUserRepository.findByEmail(auth.getName()).get();
            if(appUser.getRol().equals(UserRol.ADMIN)){
                return vehicleRepository.findAll().stream().map(VehicleGetDTO::new).toList();

            }
            return vehicleRepository.findAll().stream()
                    .filter(v->v.getBranch().equals(appUser.getBranch()))
                    .filter(v->v.isActive())
                    .map(VehicleGetDTO::new).toList();
        }

        @GetMapping("/{id}")
        public ResponseEntity<VehicleGetDTO> getVehicleById(@PathVariable Long id) {
            return vehicleRepository.findById(id)
                    .map(vehicle -> ResponseEntity.ok(new VehicleGetDTO(vehicle)))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<String> deactivateVehicle(@PathVariable Long id) {
        return vehicleRepository.findById(id).map(vehicle -> {
            if (vehicle.hasOngoingReservationToday()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("No se puede desactivar el vehículo porque tiene una reserva en curso.");
            }

            vehicle.setActive(false);
            vehicleRepository.save(vehicle);
            return ResponseEntity.ok("Vehículo desactivado");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vehículo no encontrado"));
    }
    @PutMapping("/{id}/activate")
    public ResponseEntity<String> activateVehicle(@PathVariable Long id) {
        return vehicleRepository.findById(id).map(vehicle -> {
            vehicle.setActive(true);
            vehicleRepository.save(vehicle);
            return ResponseEntity.ok("Vehículo reactivado");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vehículo no encontrado"));
    }

        @PutMapping("/{id}/deleteVehicle")
        public ResponseEntity<String> deleteVehicle(@PathVariable Long id) {
            return vehicleRepository.findById(id).map(vehicle -> {
                if (vehicle.hasOngoingReservationToday()) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("No se puede eliminar el vehículo porque tiene una reserva en curso.");
                }

                vehicle.setActive(false);
                vehicleRepository.save(vehicle);
                return ResponseEntity.ok("Vehículo desactivado");
            }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vehículo no encontrado"));
        }
    }


