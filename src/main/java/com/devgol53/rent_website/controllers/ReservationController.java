package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.email.EmailDTO;
import com.devgol53.rent_website.dtos.reservation.ReservationConfirmWhitdrawDto;
import com.devgol53.rent_website.dtos.reservation.ReservationGetDto;
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

import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;
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
        @Autowired
        private VehicleRepository vehicleRepository;


        @GetMapping("/myReservations")
        public List<ReservationPostDto> getMyReservations(Authentication auth){
            AppUser client = appUserRepository.findByEmail(auth.getName()).get();
            return client.getReservations().stream().map(ReservationPostDto::new).toList();
        }

        @PostMapping("/createReservation")
        public ResponseEntity<String> createReservation(@RequestBody ReservationPostDto reservationPostDto, Authentication auth) throws MessagingException {

            Optional<Card> findCard = cardRepository.findByNumber(reservationPostDto.getCardNumber());
            if (!findCard.isPresent()){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La tarjeta ingresada no es válida. Por favor, verifique los datos e intente nuevamente.");
            }
            if(findCard.isPresent()){
                if(findCard.get().getNumber().equals("4567456745674567")){
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Saldo insuficiente. Por favor, revise los fondos disponibles en su cuenta.");
                }
            }

            if(findCard.isPresent()){
                Card card = findCard.get();
                if(card.getNumber().equals(reservationPostDto.getCardNumber())
                    && card.getTitular().equals(reservationPostDto.getTitular().toUpperCase())
                    && card.getCode().equals(reservationPostDto.getCardCode())
                ){
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

                    iEmailService.sendMail(new EmailDTO("email",client.getEmail(),"✅ Confirmación de tu reserva "+newCode+" – Alquilando ", newCode,branchFind.getAddress()+", "+branchFind.getCity(),formattedDate,modelFind.getBrand()+" "+modelFind.getName()));

                    return ResponseEntity.status(HttpStatus.CREATED).body("Reserva realizada con éxito! Recibirá el codigo de reserva en su correo electrónico.");
                }
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La tarjeta ingresada no es válida. Por favor, verifique los datos e intente nuevamente.");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La tarjeta ingresada no es válida. Por favor, verifique los datos e intente nuevamente.");
        }

    @DeleteMapping("/{reservationCode}")
    public ResponseEntity<String> deleteReservation(@PathVariable String reservationCode, Authentication auth) throws MessagingException {
        // Obtener al usuario autenticado
        AppUser client = appUserRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Buscar la reserva por código
        Optional<Reservation> reservationOptional = reservationRepository.findByCode(reservationCode);

        if (reservationOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reserva no encontrada.");
        }

        Reservation reservation = reservationOptional.get();

        // Verificar si la reserva pertenece al usuario
        if (reservation.getClient().getId() != client.getId()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No tiene permiso para eliminar esta reserva.");
        }

        // Eliminar la reserva
        reservation.setCancelled(true);
        reservationRepository.save(reservation);
        double refundPorcent = 0;
        switch (reservation.getModel().getCancelationPolicy()) {
            case FULL:
                refundPorcent= 1.0;
                break;// 100%
            case TWENTY:
                refundPorcent = 0.2;
                break;// 20%
            case ZERO:
                refundPorcent = 0.0;
                break;// 0%
        }
        double refundAmount = reservation.getPayment() * refundPorcent;

        Locale argentina = new Locale("es", "AR");
        NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(argentina);

        String mensaje = currencyFormatter.format(refundAmount);
        iEmailService.sendMail(new EmailDTO("refund",client.getEmail(),"Cancelación de su reserva "+reservationCode+" en Alquilando",mensaje));
        return ResponseEntity.status(HttpStatus.OK).body("¡Listo! Tu reserva fue cancelada. Revisá tu correo para ver si te corresponde un reembolso.");
    }

    @PostMapping("/validar-codigo")
    public ResponseEntity<?> validarCodigoReserva(@RequestBody ReservationConfirmWhitdrawDto dto,Authentication auth) {
        Optional<Reservation> optionalReservation = reservationRepository.findByCode(dto.getCode());

        AppUser empleado = appUserRepository.findByEmail(auth.getName()).get();


        if (optionalReservation.isEmpty() || !empleado.getBranch().equals(optionalReservation.get().getBranch())) {
            return ResponseEntity.badRequest().body("No coincide con un codigo valido,una reserva para hoy o no corresponde a la sucursal");
        }



        Reservation reserva = optionalReservation.get();
        // Verificar si la fecha de inicio es hoy
        boolean esHoy = reserva.getStartDate().equals(dto.getStartDate());

        Boolean hayVehiculoDisp = vehicleRepository.findAll().stream().filter(v->v.getBranch().equals(empleado.getBranch())).anyMatch(v->v.getModel().equals(optionalReservation.get().getModel()));
        if(hayVehiculoDisp){
            return ResponseEntity.ok().body("../pages/additional.html");
        }
        return ResponseEntity.ok().body("../pages/reassign.html");
    }
}


