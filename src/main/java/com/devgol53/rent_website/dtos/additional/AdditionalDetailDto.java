package com.devgol53.rent_website.dtos.additional;

import com.devgol53.rent_website.entities.Additional;
import com.devgol53.rent_website.entities.AdditionalDetail;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AdditionalDetailDto {
    private Long id;
    private String name;
    private Double price;
    private Boolean state ;

    public AdditionalDetailDto(Long id, String name, Double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public AdditionalDetailDto(Additional additional){
        this.id = additional.getId();
        this.name = additional.getName();
        this.price = additional.getPrice();
        this.state= additional.isState();
    }


}
