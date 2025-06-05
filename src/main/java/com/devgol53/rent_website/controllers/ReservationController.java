package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.reservation.ReservationPostDto;
import com.devgol53.rent_website.entities.AppUser;
import com.devgol53.rent_website.entities.Branch;
import com.devgol53.rent_website.entities.Model;
import com.devgol53.rent_website.entities.Reservation;
import com.devgol53.rent_website.repositories.AppUserRepository;
import com.devgol53.rent_website.repositories.BranchRepository;
import com.devgol53.rent_website.repositories.ModelRepository;
import com.devgol53.rent_website.repositories.ReservationRepository;
import com.devgol53.rent_website.utils.CodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservation")
public class ReservationController {
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private AppUserRepository appUserRepository;
    @Autowired
    private BranchRepository branchRepository;
    @Autowired
    private ModelRepository modelRepository;

    @GetMapping("/myReservations")
    public List<ReservationPostDto> getMyReservations(Authentication auth){
        AppUser client = appUserRepository.findByEmail(auth.getName()).get();
        return client.getReservations().stream().map(ReservationPostDto::new).toList();
    }

    @PostMapping("/createReservation")
    public ResponseEntity<String> createReservation(@RequestBody ReservationPostDto reservationPostDto, Authentication auth) {
        String newCode;
        do {
            newCode = CodeGenerator.generarCodigoAlfanumerico();
        } while (reservationRepository.findByCode(newCode).isPresent());

        Branch branchFind = branchRepository.findById(reservationPostDto.getBranch())
                .orElseThrow(() -> new RuntimeException("Branch not found"));
        Model modelFind = modelRepository.findById(reservationPostDto.getModel())
                .orElseThrow(() -> new RuntimeException("Model not found"));
        AppUser client = appUserRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Reservation newReservation = new Reservation(newCode, reservationPostDto);
        newReservation.addBranch(branchFind);
        newReservation.addModel(modelFind);
        newReservation.addClient(client);
        reservationRepository.save(newReservation);
        return ResponseEntity.status(HttpStatus.CREATED).body("Reserva realizada con exito");
    }

}


