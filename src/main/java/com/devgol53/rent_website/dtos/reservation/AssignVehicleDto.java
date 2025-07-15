package com.devgol53.rent_website.dtos.reservation;

public class AssignVehicleDto {
    private String codigoReserva;
    private Long vehicleId;

    // Getters y setters
    public String getCodigoReserva() {
        return codigoReserva;
    }

    public void setCodigoReserva(String codigoReserva) {
        this.codigoReserva = codigoReserva;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }
}

