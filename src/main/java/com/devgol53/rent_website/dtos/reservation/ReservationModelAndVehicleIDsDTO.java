package com.devgol53.rent_website.dtos.reservation;

import com.devgol53.rent_website.entities.Reservation;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReservationModelAndVehicleIDsDTO {
    private String model;
    private long vehicleId;

    public ReservationModelAndVehicleIDsDTO(Reservation reservation, long vehicleId){
        this.model = reservation.getModel().getName();
        this.vehicleId = vehicleId;
    }
}
