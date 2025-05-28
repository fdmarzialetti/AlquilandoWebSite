package com.devgol53.rent_website.dtos.model;

import com.devgol53.rent_website.enums.CancelationPolicy;
import lombok.Getter;

@Getter

public class CreateModelDTO {
    private String brand;
    private String name;
    private Double price;
    private String image;
    private int capacity;
    private CancelationPolicy cancelationPolicy;

    public void createModel(){

    }
}
