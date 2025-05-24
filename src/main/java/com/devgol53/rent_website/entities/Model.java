package com.devgol53.rent_website.entities;

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

    @OneToMany (mappedBy = "model")
    private List<Vehicle> vehicles = new ArrayList<>();

    public Model(String brand, String name, Double price, String image, int capacity, CancelationPolicy cancelationPolicy) {
        this.brand = brand;
        this.name = name;
        this.price = price;
        this.image = image;
        this.capacity = capacity;
        this.cancelationPolicy = cancelationPolicy;
    }

    public void addVehicle(Vehicle vehicle){
        this.vehicles.add(vehicle);
    }
}
