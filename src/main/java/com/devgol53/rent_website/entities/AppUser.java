package com.devgol53.rent_website.entities;
import com.devgol53.rent_website.dtos.appUser.AppUserPostDTO;
import com.devgol53.rent_website.enums.UserRol;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter(AccessLevel.NONE)
    private long id;
    @Column(unique = true)
    private String dni;
    @Column(unique = true)
    private String email;
    private String name,lastname,phone,password;
    @Enumerated(EnumType.STRING)
    private UserRol rol;
    private int verificationCode;

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;


    @OneToMany(mappedBy = "client", cascade = CascadeType.PERSIST)
    private List<Reservation> reservations = new ArrayList<>();

    public AppUser(String name, String lastname, String dni, String phone, String email, String password, UserRol rol) {
        this.name = name;
        this.lastname = lastname;
        this.dni = dni;
        this.phone = phone;
        this.email = email;
        this.password = password;
        this.rol = rol;
    }

    public AppUser(AppUserPostDTO appUserPostDTO, String password){
        this.name = appUserPostDTO.getName();
        this.lastname = appUserPostDTO.getLastname();
        this.dni = appUserPostDTO.getDni();
        this.phone = appUserPostDTO.getPhone();
        this.email = appUserPostDTO.getEmail();
        this.rol = appUserPostDTO.getRol();
        this.password = password;
    }

    public void addReservation(Reservation reservation){this.reservations.add(reservation);}
}
