package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.appUser.AppUserGetDTO;
import com.devgol53.rent_website.dtos.email.EmailDTO;
import com.devgol53.rent_website.dtos.reservation.ReservationGetDto;
import com.devgol53.rent_website.entities.AppUser;
import com.devgol53.rent_website.entities.Branch;
import com.devgol53.rent_website.enums.UserRol;
import com.devgol53.rent_website.repositories.AppUserRepository;
import com.devgol53.rent_website.repositories.BranchRepository;
import com.devgol53.rent_website.services.IEmailService;
import com.devgol53.rent_website.utils.CodeGenerator;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/user")
public class AppUserController {

    @Autowired
    private IEmailService iEmailService;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private BranchRepository branchRepository;

    // ------------------ EMPLEADOS ------------------

    @GetMapping("/employees/active")
    public List<AppUserGetDTO> getActiveEmployees() {
        return appUserRepository.findByRolAndStateTrue(UserRol.EMPLOYEE).stream().map(AppUserGetDTO::new).toList();
    }

    @GetMapping("/employees/inactive")
    public List<AppUserGetDTO> getInactiveEmployees() {
        return appUserRepository.findByRolAndStateFalse(UserRol.EMPLOYEE).stream().map(AppUserGetDTO::new).toList();
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable Long id) {
        Optional<AppUser> optional = appUserRepository.findById(id);
        if (optional.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(new AppUserGetDTO(optional.get()));
    }

    @PostMapping("/employees")
    public ResponseEntity<?> createEmployee(@RequestBody AppUser employee) {
        if (appUserRepository.existsByEmail(employee.getEmail())) {
            return ResponseEntity.badRequest().body("Ya existe un empleado con ese email.");
        }
        if (appUserRepository.existsByDni(employee.getDni())) {
            return ResponseEntity.badRequest().body("Ya existe un empleado con ese DNI.");
        }

        if (employee.getBranch() != null && employee.getBranch().getId() != 0) {
            Optional<Branch> optionalBranch = branchRepository.findById(employee.getBranch().getId());
            optionalBranch.ifPresent(employee::setBranch);
        } else {
            employee.setBranch(null);
        }

        employee.setRol(UserRol.EMPLOYEE);
        employee.setState(true);

        return ResponseEntity.ok(new AppUserGetDTO(appUserRepository.save(employee)));
    }

    @PutMapping("/employees/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody AppUser updated) {
        Optional<AppUser> optional = appUserRepository.findById(id);
        if (optional.isEmpty()) return ResponseEntity.notFound().build();

        AppUser employee = optional.get();

        employee.setName(updated.getName());
        employee.setLastname(updated.getLastname());
        employee.setPhone(updated.getPhone());

        if (updated.getBranch() != null && updated.getBranch().getId() != 0) {
            Optional<Branch> optionalBranch = branchRepository.findById(updated.getBranch().getId());
            optionalBranch.ifPresent(employee::setBranch);
        } else {
            employee.setBranch(null);
        }

        return ResponseEntity.ok(new AppUserGetDTO(appUserRepository.save(employee)));
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<?> deactivateEmployee(@PathVariable Long id) {
        Optional<AppUser> optional = appUserRepository.findById(id);
        if (optional.isEmpty()) return ResponseEntity.notFound().build();

        AppUser employee = optional.get();
        employee.setState(false);
        appUserRepository.save(employee);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/employees/{id}/activate")
    public ResponseEntity<?> activateEmployee(@PathVariable Long id) {
        Optional<AppUser> optional = appUserRepository.findById(id);
        if (optional.isEmpty()) return ResponseEntity.notFound().build();

        AppUser employee = optional.get();
        employee.setState(true);
        appUserRepository.save(employee);
        return ResponseEntity.ok().build();
    }

    // ------------------ USUARIO ACTUAL ------------------

    @GetMapping("/reservations")
    public List<ReservationGetDto> getMyReservations(Authentication auth) {
        return appUserRepository.findByEmail(auth.getName())
                .map(user -> user.getReservations().stream().map(ReservationGetDto::new).toList())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/isAuthenticated")
    public Boolean clientIsAuth(Authentication auth) {
        return auth.isAuthenticated();
    }

    @GetMapping("/data")
    public AppUserGetDTO myData(Authentication auth) {
        Optional<AppUser> findAppUser = appUserRepository.findByEmail(auth.getName());
        return findAppUser.map(AppUserGetDTO::new).orElse(new AppUserGetDTO("Cuenta"));
    }

    @GetMapping("/isAdmin")
    public Boolean isAdmin(Authentication auth) throws MessagingException {
        Boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            AppUser admin = appUserRepository.findByEmail(auth.getName()).get();
            int verificationCode = CodeGenerator.generarCodigoNumerico();
            admin.setVerificationCode(verificationCode);
            appUserRepository.save(admin);
            String stringCode = String.valueOf(verificationCode);
            iEmailService.sendMail(new EmailDTO("verificationCode", "alquilandodev53@gmail.com", "Codigo de verificacion: " + stringCode, stringCode));
            return true;
        }
        return false;
    }

    @GetMapping("/isEmployee")
    public Boolean isEmployee(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_EMPLOYEE"));
    }

    @PostMapping("/resetVerificationCode")
    public void resetVerificationCode(Authentication auth) {
        AppUser admin = appUserRepository.findByEmail(auth.getName()).get();
        admin.setVerificationCode(0);
        appUserRepository.save(admin);
    }

    @GetMapping("/codeVerification")
    public boolean codeVerification(@RequestParam int verificationCode, @RequestParam String username) {
        AppUser findAdmin = appUserRepository.findByEmail(username).get();
        return findAdmin.getVerificationCode() == verificationCode;
    }

    @GetMapping("/userRol")
    public ResponseEntity<String> getUserRol(Authentication auth){
        if (auth == null){
            return ResponseEntity.badRequest().body("El usuario no esta autenticado");
        }
        Optional<AppUser> optionalUser = appUserRepository.findByEmail(auth.getName());
        if(optionalUser.isEmpty()){
            return ResponseEntity.badRequest().body("El usuario no esta autenticado");
        }
        AppUser user = optionalUser.get();
        return ResponseEntity.ok(user.getRol().toString());
    }

}
