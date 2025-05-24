package com.devgol53.rent_website.entities;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter(AccessLevel.NONE)
    private long id;
    private String patent;
    private String status;
    private int yearV;

    public Vehicle(){};

    public Vehicle(String patent, String status, int year) {
        this.patent = patent;
        this.status = status;
        this.yearV = year;
    }
}
