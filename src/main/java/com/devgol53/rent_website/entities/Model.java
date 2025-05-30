package com.devgol53.rent_website.entities;


import com.devgol53.rent_website.dtos.model.CreateModelDTO;
import com.devgol53.rent_website.enums.CancelationPolicy;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class Model {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter(AccessLevel.NONE)
    private long id;
    private String brand;
    private String name;
    private Double price;
    private String image;
    private int capacity;
    @Enumerated(EnumType.STRING)
    private CancelationPolicy cancelationPolicy;

    @OneToMany (mappedBy = "model", cascade = CascadeType.PERSIST)
    private List<Reservation> reservations = new ArrayList<>();

    @OneToMany (mappedBy = "model", cascade = CascadeType.PERSIST)
    private List<Vehicle> vehicles = new ArrayList<>();

    public Model(String brand, String name, Double price, String image, int capacity, CancelationPolicy cancelationPolicy) {
        this.brand = brand;
        this.name = name;
        this.price = price;
        this.image = image;
        this.capacity = capacity;
        this.cancelationPolicy = cancelationPolicy;
    }

    public Model(CreateModelDTO modelDto){
        this.brand = modelDto.getBrand();
        this.name = modelDto.getName();
        this.price = modelDto.getPrice();
        this.image = modelDto.getImage();
        this.capacity = modelDto.getCapacity();
        this.cancelationPolicy = modelDto.getCancelationPolicy();
    }

    public void addVehicle(Vehicle vehicle){
        this.vehicles.add(vehicle);
    }
    public void addReservation(Reservation reservation){
        this.reservations.add(reservation);
    }
}
