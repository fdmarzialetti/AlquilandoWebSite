package com.devgol53.rent_website.entities;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class EmployeeComment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter(AccessLevel.NONE)
    private long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private AppUser employee;
    private String comment;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id",
            nullable = false,
            unique   = true)
    private Reservation reservation;

    public EmployeeComment(AppUser employee, String comment) {
        this.employee = employee;
        this.comment = comment;
    }

    public void addReservation(Reservation reservation){
        this.reservation = reservation;
    }

}
