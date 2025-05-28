package com.devgol53.rent_website.dtos.model;

import com.devgol53.rent_website.enums.CancelationPolicy;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public class GetModelDTO {
    private long id;
    private String brand;
    private String name;
    private Double price;
    private String image;
    private int capacity;
    private CancelationPolicy cancelationPolicy;
}
