package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.appUser.AppUserGetDTO;
import com.devgol53.rent_website.dtos.email.EmailDTO;
import com.devgol53.rent_website.dtos.reservation.ReservationGetDto;
import com.devgol53.rent_website.entities.AppUser;
import com.devgol53.rent_website.repositories.AppUserRepository;
import com.devgol53.rent_website.services.IEmailService;
import com.devgol53.rent_website.utils.CodeGenerator;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
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
    AppUserRepository appUserRepository;
    @GetMapping("/reservations")
    public List<ReservationGetDto> getMyReservations(Authentication auth) {
        System.out.println(auth.getName());
        return appUserRepository.findByEmail(auth.getName())
                .map(user -> user.getReservations().stream()
                        .map(ReservationGetDto::new)
                        .toList())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    @GetMapping("/isAuthenticated")
    public Boolean clientIsAuth(Authentication auth){
        return auth.isAuthenticated();
    }

    @GetMapping("/data")
    public AppUserGetDTO myData(Authentication auth){
        Optional<AppUser> findAppUser = appUserRepository.findByEmail(auth.getName());
        if(!findAppUser.isPresent()){
            return new AppUserGetDTO("Cuenta");
        }
        return new AppUserGetDTO(findAppUser.get());
    }

    @GetMapping("/isAdmin")
    public Boolean isAdmin(Authentication auth) throws MessagingException {
        Boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        if(isAdmin){
            AppUser admin = appUserRepository.findByEmail(auth.getName()).get();
            int verificationCode=CodeGenerator.generarCodigoNumerico();
            admin.setVerificationCode(verificationCode);
            appUserRepository.save(admin);
            String stringCode = String.valueOf(verificationCode);
            iEmailService.sendMail(new EmailDTO("verificationCode","alquilandodev53@gmail.com","Codigo de verificacion: "+stringCode,stringCode));
            return true;
        }
        return false;
    }


    @GetMapping("/isEmployee")
    public Boolean isEmployee(Authentication auth) throws MessagingException {
        Boolean isEmployee = auth.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_EMPLOYEE"));

        return isEmployee;
    }

    @PostMapping("/resetVerificationCode")
    public void resetVerificationCode(Authentication auth){
        AppUser admin = appUserRepository.findByEmail(auth.getName()).get();
        admin.setVerificationCode(0);
        appUserRepository.save(admin);
    }

    @GetMapping("/codeVerification")
    public boolean codeVerification(@RequestParam int verificationCode, @RequestParam String username){
        AppUser findAdmin = appUserRepository.findByEmail(username).get();
        return findAdmin.getVerificationCode() == verificationCode;
    }
}
