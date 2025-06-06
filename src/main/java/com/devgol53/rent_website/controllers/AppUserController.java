package com.devgol53.rent_website.controllers;

import com.devgol53.rent_website.dtos.appUser.AppUserGetDTO;
import com.devgol53.rent_website.dtos.reservation.ReservationGetDto;
import com.devgol53.rent_website.entities.AppUser;
import com.devgol53.rent_website.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/user")
public class AppUserController {
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
}
