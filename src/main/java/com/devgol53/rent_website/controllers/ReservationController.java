package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.additional.AdditionalDetailCreateDto;
import com.devgol53.rent_website.dtos.additional.AdditionalDetailDto;
import com.devgol53.rent_website.dtos.additional.AdditionalDetailListDto;
import com.devgol53.rent_website.dtos.email.EmailDTO;
import com.devgol53.rent_website.dtos.reservation.*;
import com.devgol53.rent_website.dtos.valoration.ValorationDTO;
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
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.text.NumberFormat;
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
        public List<ReservationGetDto> getMyReservations(Authentication auth){
            AppUser client = appUserRepository.findByEmail(auth.getName()).get();
            return client.getReservations().stream().map(ReservationGetDto::new).toList();
        }

    @GetMapping("/employeeReservations")
    public List<ReservationGetDto> getEmployeeReservations(
            Authentication auth,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {
        Optional<AppUser> optionalUser = appUserRepository.findByEmail(auth.getName());
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Empleado no encontrado");
        }

        AppUser employee = optionalUser.get();
        Branch branch = employee.getBranch();
        if (branch == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Empleado sin sucursal asignada");
        }

        return reservationRepository.findAll().stream()
                .filter(Objects::nonNull)
                .filter(r -> r.getBranch() != null && r.getBranch().equals(branch))
                .filter(r -> {
                    LocalDate start = r.getStartDate();
                    LocalDate end = r.getEndDate();
                    return (start != null && !start.isBefore(startDate) && !start.isAfter(endDate)) ||
                            (end != null && !end.isBefore(startDate) && !end.isAfter(endDate));
                })
                .map(ReservationGetDto::new)
                .toList();
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
        if(reserva.getCancelled()){
            return ResponseEntity.badRequest().body("El codigo corresponde a una reserva cancelada.");
        }

        if(reserva.getVehicle()!= null){
            return ResponseEntity.badRequest().body("El codigo de reserva ya fue registrado anteriormente");
        }

        System.out.println("empleado rama disponibles"+ empleado.getBranch());
        // Buscar vehículo disponible en la sucursal, del mismo modelo, que no tenga reserva activa hoy
        Optional<Vehicle> vehiculoDisponible = vehicleRepository.findAll().stream()
                .filter(v->v.getMaintence()==false)
                .filter(v -> v.isActive())
                .filter(v -> v.getBranch().equals(empleado.getBranch()))
                .filter(v -> v.getModel().equals(reserva.getModel()))
                .filter(v -> !v.hasOngoingReservationToday())
                .findFirst();
        System.out.println("vehiculos disponibles"+ vehiculoDisponible);
        if (vehiculoDisponible.isPresent()) {
            // Redirigir a la carga de adicionales
            return ResponseEntity.ok("../pages/additional.html");
        }

        Optional<Vehicle> vehiculosDisponibles = vehicleRepository.findAll().stream()
                .filter(v->v.getMaintence()==false)
                .filter(v -> v.isActive())
                .filter(v -> v.getBranch().equals(empleado.getBranch()))
                .filter(v -> !v.hasOngoingReservationToday())
                .findAny();

        if(vehiculosDisponibles.isEmpty()){
            return ResponseEntity.badRequest().body("No hay ningun vehiculo disponible en esta sucursal");
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
        Optional<Reservation> optionalReservation = reservationRepository.findByCode(code.toUpperCase());
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
    public ResponseEntity<?> addAdditionalToReservation(@RequestBody AdditionalDetailListDto dto, Authentication auth) {
        Optional<Reservation> optionalReservation = reservationRepository.findByCode(dto.getCodigoReserva());



        Reservation reservation = optionalReservation.get();

        AppUser usuario = appUserRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        boolean esCliente = reservation.getClient().getId() == usuario.getId();
        boolean esEmpleadoSucursal = usuario.getBranch() != null &&
                usuario.getBranch().equals(reservation.getBranch());

        if (!esCliente && !esEmpleadoSucursal) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No tiene permiso para modificar esta reserva.");
        }
        dto.getAdicionales().forEach(a->{
            AdditionalDetail detalle = new AdditionalDetail();
            detalle.setAdicional(additionalRepository.findById(a.getId()).get());
            detalle.setPrice(a.getPrice());
            reservation.addAdditionalDetail(detalle);
        });


        reservationRepository.save(reservation);

        return ResponseEntity.ok("Adicional agregado con éxito.");
    }
    @PostMapping("/addValoration/{reservationId}")
    public ResponseEntity<?> addValoration(@PathVariable long reservationId, @RequestBody ValorationDTO valorationDTO){
            Optional<Reservation> reservationOptional = reservationRepository.findById(reservationId);
            if(!reservationOptional.isPresent()){
                return ResponseEntity.badRequest().body("No se encuentra la reserva");
            }
            reservationOptional.get().addValoration(new Valoration(valorationDTO));
            reservationRepository.save(reservationOptional.get());
            return ResponseEntity.ok().body("¡Gracias por compartir tu experiencia!");
    }


    @PostMapping("/asignar-vehiculo")
    public ResponseEntity<?> obtenerVehiculoDisponible(
            @RequestParam String codigoReserva,
            @RequestParam Long modelId,
            Authentication auth) {

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

        // Buscar vehículo activo, sin mantenimiento, del modelo y sucursal correspondiente, sin reservas activas
        Optional<Vehicle> vehiculo = vehicleRepository.findAll().stream()
                .filter(v -> !v.getMaintence())
                .filter(Vehicle::isActive)
                .filter(v -> v.getModel().getId()==(modelId))
                .filter(v -> v.getBranch().equals(reserva.getBranch()))
                .filter(v -> !v.hasOngoingReservationToday()) // si tenés lógica para esto
                .findFirst();

        if (vehiculo.isPresent()) {
            Vehicle v = vehiculo.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", v.getId());
            response.put("modelo", v.getModel().getName()); // o `getModel().getFullName()` si tenés marca + modelo
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("No hay vehículos disponibles para este modelo en la sucursal.");
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

    @PostMapping("/registrar-devolucion/{reservationCode}")
    public ResponseEntity<?> registerReturn(
            @PathVariable String reservationCode,
            @RequestParam String comentarioDevolucion,
            Authentication auth) {

        Reservation reservation = reservationRepository
                .findByCode(reservationCode)
                .orElse(null);

        if (reservation == null)
            return ResponseEntity.badRequest()
                    .body("El codigo ingresado no corresponde a una reserva registrada.");

        if(reservation.getEmployeeComment()!=null){
            return ResponseEntity.badRequest()
                    .body("El codigo ingresado corresponde a una reserva con una devolucion ya registrada");
        }

        if(reservation.getVehicle() == null){
            return ResponseEntity.badRequest()
                    .body("El codigo ingresado no corresponde a una reserva con retiro pendiente");
        }

        Vehicle vehicle = vehicleRepository.findByPatent(reservation.getVehicle().getPatent()).get();
        vehicle.setMaintence(true);
        vehicleRepository.save(vehicle);

        AppUser employee = appUserRepository
                .findByEmail(auth.getName())
                .orElseThrow();

        EmployeeComment comment = new EmployeeComment(employee, comentarioDevolucion);
        reservation.addEmployeeComment(comment);
        employee.addEmployeeComment(comment);
        reservationRepository.save(reservation);

        return ResponseEntity.ok("Devolución registrada correctamente!");
    }

    @GetMapping("/dates/{codigo}")
    public ResponseEntity<?> getReservationDates(@PathVariable String codigo) {
        Optional<Reservation> optional = reservationRepository.findByCode(codigo);

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reserva no encontrada");
        }

        Reservation r = optional.get();

        Map<String, Object> response = new HashMap<>();
        response.put("startDate", r.getStartDate());
        response.put("endDate", r.getEndDate());
        response.put("price",r.getPayment());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/assign-vehicle")
    public ResponseEntity<?> assignVehicleToReservation(@RequestBody AssignVehicleDto dto, Authentication auth) {
        Optional<Reservation> optionalReservation = reservationRepository.findByCode(dto.getCodigoReserva());
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(dto.getVehicleId());

        if (optionalReservation.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reserva no encontrada.");
        }

        if (optionalVehicle.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vehículo no encontrado.");
        }

        Reservation reserva = optionalReservation.get();
        Vehicle vehiculo = optionalVehicle.get();

        // Verificación: sucursal del empleado debe coincidir con la reserva
        AppUser empleado = appUserRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado."));

        if (!empleado.getBranch().equals(reserva.getBranch())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No tiene permiso para asignar un vehículo a esta reserva.");
        }

        // Asignar vehículo y modelo
        reserva.addVehicle(vehiculo);
        reserva.addModel(vehiculo.getModel()); // Actualizar el modelo de la reserva (por si no estaba)
        reservationRepository.save(reserva);

        return ResponseEntity.ok("Vehículo asignado correctamente a la reserva.");
    }

    @GetMapping("/estaRegistrada/{codigo}")
    public ResponseEntity<Boolean> reservaEstaRegistrada(@PathVariable String codigo) {

        return reservationRepository.findByCode(codigo)          // Optional<Reservation>
                .map(reserva -> ResponseEntity.ok(               // 200 OK + body true/false
                        reserva.getEmployeeComment() != null
                ))
                .orElseGet(() -> ResponseEntity.notFound().build()); // 404 si no existe
    }

    @GetMapping("/reservationModelId/{code}")
    public ResponseEntity<?> getReservationModelId(@PathVariable String code, Authentication auth) {
        Optional<Reservation> optionalReservation = reservationRepository.findByCode(code);
        if(optionalReservation.isEmpty()){
            return ResponseEntity.badRequest().body("No se encuentra la reserva con codigo "+code);
        }
        Reservation reserva = optionalReservation.get();
        Optional<Vehicle> vehiculo = vehicleRepository.findAll().stream()
                .filter(v -> !v.getMaintence())
                .filter(Vehicle::isActive)
                .filter(v -> v.getModel().getId()==(reserva.getModel().getId()))
                .filter(v -> v.getBranch().equals(reserva.getBranch()))
                .filter(v -> !v.hasOngoingReservationToday()) // si tenés lógica para esto
                .findFirst();
        ReservationModelAndVehicleIDsDTO reservationModelAndVehicleIDsDTO = new ReservationModelAndVehicleIDsDTO(reserva,vehiculo.get().getId());
        return ResponseEntity.ok().body(reservationModelAndVehicleIDsDTO);
    }

}


