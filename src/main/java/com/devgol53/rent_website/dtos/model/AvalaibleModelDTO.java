package com.devgol53.rent_website.dtos.model;
import com.devgol53.rent_website.entities.Model;
import com.devgol53.rent_website.enums.CancelationPolicy;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AvalaibleModelDTO {
    private long id;
    private String brand;
    private String name;
    private Double price;
    private String image;
    private int capacity;
    private CancelationPolicy cancelationPolicy;

    public AvalaibleModelDTO(Model model){
        this.id = model.getId();
        this.brand = model.getBrand();
        this.name = model.getName();
        this.price = model.getPrice();
        this.image = model.getImage();
        this.capacity = model.getCapacity();
        this.cancelationPolicy = model.getCancelationPolicy();
    }
}
