package com.devgol53.rent_website.dtos.valoration;

import com.devgol53.rent_website.entities.Reservation;
import com.devgol53.rent_website.entities.Valoration;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class ValorationDTO {
    private int score;
    private String comment;
    public ValorationDTO(Valoration valoration){
        this.score = valoration.getScore();
        this.comment = valoration.getComment();
    }
}

