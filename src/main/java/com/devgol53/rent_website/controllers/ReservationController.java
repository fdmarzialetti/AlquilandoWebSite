package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.additional.AdditionalDetailCreateDto;
import com.devgol53.rent_website.dtos.additional.AdditionalDetailDto;
import com.devgol53.rent_website.dtos.email.EmailDTO;
import com.devgol53.rent_website.dtos.reservation.ReservationConfirmWhitdrawDto;
import com.devgol53.rent_website.dtos.reservation.ReservationGetDto;
import com.devgol53.rent_website.dtos.reservation.ReservationPostDto;
import com.devgol53.rent_website.dtos.reservation.ReservationSummaryDto;
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

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

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
        @Autowired
        private AdditionalRepository additionalRepository;


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
    public ResponseEntity<String> deleteReservation(@PathVariable String reservationCode, Authentication auth) {
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
        reservationRepository.delete(reservation);
        return ResponseEntity.status(HttpStatus.OK).body("Reserva eliminada correctamente.");
    }

    @PostMapping("/validar-codigo")
    public ResponseEntity<?> validarCodigoReserva(@RequestBody ReservationConfirmWhitdrawDto dto, Authentication auth) {
        Optional<Reservation> optionalReservation = reservationRepository.findByCode(dto.getCode());

        AppUser empleado = appUserRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado."));

        if (optionalReservation.isEmpty()) {
            return ResponseEntity.badRequest().body("Código de reserva inválido.");
        }

        Reservation reserva = optionalReservation.get();

        // Validar sucursal
        if (!empleado.getBranch().equals(reserva.getBranch())) {
            return ResponseEntity.badRequest().body("La reserva no corresponde a la sucursal del empleado.");
        }

        // Validar que la reserva sea para hoy
        LocalDate hoy = LocalDate.now();
        if (!reserva.getStartDate().isEqual(hoy)) {
            return ResponseEntity.badRequest().body("La reserva no es para el día de hoy.");
        }
        System.out.println("empleado rama disponibles"+ empleado.getBranch());
        // Buscar vehículo disponible en la sucursal, del mismo modelo, que no tenga reserva activa hoy
        Optional<Vehicle> vehiculoDisponible = vehicleRepository.findAll().stream()
                .filter(v -> v.isActive())
                .filter(v -> v.getBranch().equals(empleado.getBranch()))
                .filter(v -> v.getModel().equals(reserva.getModel()))
                .filter(v -> !v.hasOngoingReservationToday())
                .findFirst();
        System.out.println("vehiculos disponibles"+ vehiculoDisponible);
        if (vehiculoDisponible.isPresent()) {
            // Asignar el vehículo a la reserva
            reserva.setVehicle(vehiculoDisponible.get());
            reservationRepository.save(reserva);

            return ResponseEntity.ok("../pages/additional.html");
        }

        // No hay vehículo disponible: redirigir a reassign
        Map<String, Object> response = new HashMap<>();
        response.put("redirect", "../pages/reassign.html");
        response.put("branchId", reserva.getBranch().getId());
        response.put("fechaFin", reserva.getEndDate().toString());
        response.put("precioMinimo", reserva.getModel().getPrice());
        response.put("codigoReserva", reserva.getCode());
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{code}/additionals")
    public ResponseEntity<?> getAdditionalsByReservationCode(@PathVariable String code, Authentication auth) {
        Optional<Reservation> optionalReservation = reservationRepository.findByCode(code);
        System.out.println("Código recibido: " + code);
        if (optionalReservation.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reserva no encontrada.");
        }

        Reservation reservation = optionalReservation.get();

        AppUser usuario = appUserRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        boolean esCliente = reservation.getClient().getId() == usuario.getId();
        boolean esEmpleadoSucursal = usuario.getBranch() != null &&
                usuario.getBranch().equals(reservation.getBranch());

        if (!esCliente && !esEmpleadoSucursal) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No tiene permiso para ver estos datos.");
        }

        List<AdditionalDetailDto> adicionales = reservation.getAdditionalDetails().stream()
                .filter(d -> d.getAdicional() != null)
                .map(detalle -> new AdditionalDetailDto(
                        detalle.getId(),
                        detalle.getAdicional().getName(),
                        detalle.getPrice()
                ))
                .toList();

        return ResponseEntity.ok(adicionales);
    }

    @PostMapping("/add-additional")
    public ResponseEntity<?> addAdditionalToReservation(@RequestBody AdditionalDetailCreateDto dto, Authentication auth) {
        Optional<Reservation> optionalReservation = reservationRepository.findByCode(dto.getReservationCode());
        Optional<Additional> optionalAdditional = additionalRepository.findById(dto.getAdditionalId());

        if (optionalReservation.isEmpty() || optionalAdditional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reserva o adicional no encontrado.");
        }

        Reservation reservation = optionalReservation.get();

        AppUser usuario = appUserRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        boolean esCliente = reservation.getClient().getId() == usuario.getId();
        boolean esEmpleadoSucursal = usuario.getBranch() != null &&
                usuario.getBranch().equals(reservation.getBranch());

        if (!esCliente && !esEmpleadoSucursal) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No tiene permiso para modificar esta reserva.");
        }

        AdditionalDetail detalle = new AdditionalDetail();
        detalle.setAdicional(optionalAdditional.get());
        detalle.setPrice(optionalAdditional.get().getPrice());
        reservation.addAdditionalDetail(detalle);

        reservationRepository.save(reservation);

        return ResponseEntity.ok("Adicional agregado con éxito.");
    }

    @PostMapping("/asignar-vehiculo")
    public ResponseEntity<?> asignarVehiculoAReserva(@RequestParam String codigoReserva, @RequestParam Long modelId, Authentication auth) {
        Optional<Reservation> optionalReserva = reservationRepository.findByCode(codigoReserva);
        if (optionalReserva.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reserva no encontrada.");
        }

        Reservation reserva = optionalReserva.get();

        AppUser empleado = appUserRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado."));

        if (!empleado.getBranch().equals(reserva.getBranch())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Sucursal inválida.");
        }

        // Buscar vehículo activo del modelo solicitado y sucursal actual
        Optional<Vehicle> vehiculo = vehicleRepository.findAll().stream()
                .filter(v -> v.isActive())
                .filter(v -> v.getModel().getId() == modelId)
                .filter(v -> v.getBranch().equals(reserva.getBranch()))
                .filter(v -> !v.hasOngoingReservationToday()) // si tenés lógica de reserva activa
                .findFirst();

        if (vehiculo.isPresent()) {
            reserva.setVehicle(vehiculo.get());
            reservationRepository.save(reserva);
            return ResponseEntity.ok("Vehículo asignado correctamente.");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No hay vehículos disponibles para este modelo en la sucursal.");
    }

    @GetMapping("/{code}")
    public ResponseEntity<?> getReservation(@PathVariable String code, Authentication auth) {
        Optional<Reservation> optionalReservation = reservationRepository.findByCode(code);
        if (optionalReservation.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reserva no encontrada.");
        }

        Reservation reserva = optionalReservation.get();
        AppUser usuario = appUserRepository.findByEmail(auth.getName()).orElseThrow();

        boolean esCliente = reserva.getClient().getId() == usuario.getId();

        boolean esEmpleado = usuario.getBranch() != null && usuario.getBranch().equals(reserva.getBranch());

        if (!esCliente && !esEmpleado) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No tiene permiso para ver esta reserva.");
        }

        ReservationSummaryDto dto = new ReservationSummaryDto(reserva);
        return ResponseEntity.ok(dto);
    }







}


