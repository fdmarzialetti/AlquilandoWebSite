package com.devgol53.rent_website.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter(AccessLevel.NONE)
    private long id;
    private String number;
    private String titular;
    private String code;

    public Card(String number, String code, String titular) {
        this.number = number;
        this.titular = titular;
        this.code = code;
    }
}
