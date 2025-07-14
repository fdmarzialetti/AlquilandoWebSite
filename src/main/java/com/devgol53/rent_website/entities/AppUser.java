package com.devgol53.rent_website.entities;

import com.devgol53.rent_website.dtos.appUser.AppUserPostDTO;
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


    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;


    @Column(unique = true)
    private String dni;

    @Column(unique = true)
    private String email;

    private String name;
    private String lastname;
    private String phone;
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRol rol;

    private int verificationCode;

    private boolean state = true;

    private boolean mustChangePassword = false;

    @OneToMany(mappedBy = "client", cascade = CascadeType.PERSIST)
    private List<Reservation> reservations = new ArrayList<>();

    @OneToMany(mappedBy = "employee")
    private List<EmployeeComment> employeeComments = new ArrayList<>();

    public AppUser(String name, String lastname, String dni, String phone, String email, String password, UserRol rol) {
        this.name = name;
        this.lastname = lastname;
        this.dni = dni;
        this.phone = phone;
        this.email = email;
        this.password = password;
        this.rol = rol;
    }

    public AppUser(AppUserPostDTO dto, String password) {
        this.name = dto.getName();
        this.lastname = dto.getLastname();
        this.dni = dto.getDni();
        this.phone = dto.getPhone();
        this.email = dto.getEmail();
        this.rol = dto.getRol();
        this.password = password;
    }

    public void addReservation(Reservation reservation) {
        this.reservations.add(reservation);
    }


    public void addEmployeeComment(EmployeeComment comment) {
        this.employeeComments.add(comment);
        comment.setEmployee(this);
    }
}
