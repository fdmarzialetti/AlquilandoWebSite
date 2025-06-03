package com.devgol53.rent_website.dtos.appUser;

import com.devgol53.rent_website.entities.AppUser;
import com.devgol53.rent_website.enums.UserRol;

import lombok.Getter;

@Getter
public class AppUserGetDTO {
    private long id;
    private String dni;
    private String email;
    private String name,lastname,phone,password;
    private UserRol rol;

    public AppUserGetDTO(AppUser appUser){
        this.id = appUser.getId();
        this.dni = appUser.getDni();
        this.email = appUser.getEmail();
        this.name = appUser.getName();
        this.lastname = appUser.getLastname();
        this.phone = appUser.getPhone();
        this.password = appUser.getPassword();
        this.rol = appUser.getRol();
    }
}
