package com.devgol53.rent_website.dtos.additional;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class AdditionalDetailListDto {
    private List<AdditionalDetailDto> adicionales;
    private String codigoReserva;

}
