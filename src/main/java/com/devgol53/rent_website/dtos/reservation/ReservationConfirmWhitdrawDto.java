package com.devgol53.rent_website.dtos.reservation;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@NoArgsConstructor
@Getter
public class ReservationConfirmWhitdrawDto {
    private String code;
    private LocalDate startDate;


}
