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
    @ManyToOne
    private AppUser employee;
    private String comment;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;
}
