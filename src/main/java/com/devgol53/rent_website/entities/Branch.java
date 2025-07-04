package com.devgol53.rent_website.entities;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter(AccessLevel.NONE)
    private long id;
    private String address;
    private String city;
    private boolean state = true; // Campo de estado inicializado en true


    @OneToMany(mappedBy = "branch", cascade = CascadeType.PERSIST)
    private List<Reservation> reservations = new ArrayList<>();

    @OneToMany(mappedBy = "branch", cascade = CascadeType.PERSIST)
    private List<Vehicle> vehicles = new ArrayList<>();

    @OneToMany(mappedBy = "branch", cascade = CascadeType.PERSIST)
    private List<AppUser> employees = new ArrayList<>();


    public Branch() {
    }
    public Branch(String city, String address) {
        this.city = city;
        this.address = address;
    }


    public void addVehicle(Vehicle vehicle){
        this.vehicles.add(vehicle);
    }
    public void addReservation(Reservation reservation){
        this.reservations.add(reservation);
    }
    public boolean hasActiveVehicles() {
        return vehicles.stream().anyMatch(Vehicle::isActive);
    }

}
