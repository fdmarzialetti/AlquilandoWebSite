package com.devgol53.rent_website.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Additional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private double price;

    private boolean state = true;

    public Additional() {}

    public Additional(String name, double price) {
        this.name = name;
        this.price = price;
    }
}
