package com.devgol53.rent_website.entities;

import com.devgol53.rent_website.dtos.valoration.ValorationDTO;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Valoration {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter(AccessLevel.NONE)
    private long id;
    private int score;
    private String comment;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    public Valoration(ValorationDTO valorationDTO) {
        this.score= valorationDTO.getScore();
        this.comment = valorationDTO.getComment();
    }

    public void addReservation(Reservation reservation){
        this.reservation = reservation;
    }
}
