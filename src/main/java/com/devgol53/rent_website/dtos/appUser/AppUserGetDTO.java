package com.devgol53.rent_website.dtos.appUser;

import com.devgol53.rent_website.entities.AppUser;

public class AppUserGetDTO {
    public Long id;
    public String name;
    public String lastname;
    public String email;
    public String dni;
    public String phone;
    public String rol;
    public Long branchId;
    public String branchAddress; // 👈 NUEVO
    public String branchCity;    // 👈 (opcional)

    public AppUserGetDTO(AppUser e) {
        this.id = e.getId();
        this.name = e.getName();
        this.lastname = e.getLastname();
        this.email = e.getEmail();
        this.dni = e.getDni();
        this.phone = e.getPhone();
        this.rol = e.getRol() != null ? e.getRol().name() : null;
        this.branchId = e.getBranch() != null ? e.getBranch().getId() : null;
        this.branchAddress = e.getBranch() != null ? e.getBranch().getAddress() : null;
        this.branchCity = e.getBranch() != null ? e.getBranch().getCity() : null;
    }

    public AppUserGetDTO(String name) {
        this.name = name;
    }
}
