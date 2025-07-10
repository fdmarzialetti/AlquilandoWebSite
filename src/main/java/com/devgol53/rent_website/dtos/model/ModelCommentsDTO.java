package com.devgol53.rent_website.dtos.model;

import com.devgol53.rent_website.dtos.valoration.ValorationDTO;
import com.devgol53.rent_website.entities.Model;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Objects;
@Getter
@NoArgsConstructor
public class ModelCommentsDTO {
    private long id;
    private String brand;
    private String name;
    private byte[] image;
    private List<ValorationDTO> valorations;
    public ModelCommentsDTO(Model model){
        this.id = model.getId();
        this.brand = model.getBrand();
        this.name = model.getName();
        this.image = model.getImage();
        this.valorations = model.getReservations().stream()
                .map(r -> r.getValoration())
                .filter(Objects::nonNull)
                .map(ValorationDTO::new)
                .toList();
    }
}
