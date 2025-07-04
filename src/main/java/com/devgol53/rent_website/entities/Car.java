package com.devgol53.rent_website.entities;

import com.devgol53.rent_website.dtos.car.CarPostDto;
import com.devgol53.rent_website.enums.CarStatus;
import jakarta.persistence.*;
import lombok.*;

import javax.management.ConstructorParameters;
import java.io.IOException;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter(AccessLevel.NONE)
    private long id;
    private String model;
    private String brand;
    @Enumerated(EnumType.STRING)
    private CarStatus status;
    // para subir una imagen
    @Lob
    @Column(columnDefinition = "BLOB")
    private byte[] image;


    public Car(String brand, String model, CarStatus status){
        this.model=model;
        this.brand=brand;
        this.status=status;

    }

    public Car(CarPostDto carPostDto) throws IOException {
        this.model = carPostDto.getModel();
        this.brand = carPostDto.getBrand();
        this.status = carPostDto.getStatus();
        this.image = carPostDto.getImage().getBytes();
    }
}
