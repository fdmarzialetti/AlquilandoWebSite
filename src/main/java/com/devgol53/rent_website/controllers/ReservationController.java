package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.email.EmailDTO;
import com.devgol53.rent_website.dtos.reservation.ReservationPostDto;
import com.devgol53.rent_website.entities.*;
import com.devgol53.rent_website.repositories.*;
import com.devgol53.rent_website.services.IEmailService;
import com.devgol53.rent_website.utils.CodeGenerator;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservation")
public class ReservationController {
    @Autowired
    private IEmailService iEmailService;
    @Autowired
    private CardRepository cardRepository;
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
    public ResponseEntity<String> createReservation(@RequestBody ReservationPostDto reservationPostDto, Authentication auth) throws MessagingException {

        Optional<Card> findCard = cardRepository.findByNumber(reservationPostDto.getCard().getNumber());
        if (!findCard.isPresent()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La tarjeta ingresada no es válida. Por favor, verifique los datos e intente nuevamente.");
        }
        if(findCard.isPresent()){
            if(findCard.get().getNumber().equals("4567456745674567")){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Saldo insuficiente. Por favor, revise los fondos disponibles en su cuenta.");
            }
        }

        if(findCard.isPresent()){
            if(findCard.get().getNumber().equals("1234123412341234")){
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

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d 'de' MMMM 'del' yyyy", new Locale("es", "ES"));

                String formattedDate = reservationPostDto.getStartDate().format(formatter);

                iEmailService.sendMail(new EmailDTO(client.getEmail(),"✅ Confirmación de tu reserva "+newCode+" – Alquilando ", newCode,branchFind.getAddress()+", "+branchFind.getCity(),formattedDate,modelFind.getBrand()+" "+modelFind.getName()));

                return ResponseEntity.status(HttpStatus.CREATED).body("Reserva realizada con éxito! Recibirá el codigo de reserva en su correo electrónico.");

            }
        }
        return null;
    }

}


