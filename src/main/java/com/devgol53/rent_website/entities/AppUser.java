package com.devgol53.rent_website.entities;
import com.devgol53.rent_website.enums.UserRol;
import jakarta.persistence.*;
import lombok.*;

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

    public void addReservation(Reservation reservation){this.reservations.add(reservation);}
}
