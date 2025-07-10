package com.devgol53.rent_website.dtos.additional;

public class AdditionalDetailCreateDto {
    private Long additionalId;
    private String reservationCode;

    public Long getAdditionalId() {
        return additionalId;
    }

    public void setAdditionalId(Long additionalId) {
        this.additionalId = additionalId;
    }

    public String getReservationCode() {
        return reservationCode;
    }

    public void setReservationCode(String reservationCode) {
        this.reservationCode = reservationCode;
    }
}
