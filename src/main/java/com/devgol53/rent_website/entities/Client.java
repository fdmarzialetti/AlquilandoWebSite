package com.devgol53.rent_website.entities;

import com.devgol53.rent_website.enums.UserRol;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter(AccessLevel.NONE)
    private long id;
    private String name;
    private String lastname;
    private String dni;
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private UserRol rol;

    public Client() {
    }

    public Client(String password, String name, String lastname, String email, String dni) {
        this.password = password;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.dni = dni;
    }
}
