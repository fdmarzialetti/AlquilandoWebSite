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
public class AdditionalDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter(AccessLevel.NONE)
    private long id;
    @ManyToOne
    private Additional adicional;
    @ManyToOne
    private Reservation reserva;
    private Double price;

    public void addReservation(Reservation reservation){
        this.reserva=reservation;
    }

    public void addAdditional(Additional additional){
        this.adicional=additional;
    }
}
