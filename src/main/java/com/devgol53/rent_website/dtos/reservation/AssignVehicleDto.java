package com.devgol53.rent_website.dtos.reservation;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AssignVehicleDto {
    private String codigoReserva;
    private Long vehicleId;

}

