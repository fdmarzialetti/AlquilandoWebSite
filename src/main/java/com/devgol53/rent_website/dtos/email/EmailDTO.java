package com.devgol53.rent_website.dtos.email;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailDTO {
    private String destinatario;
    private String asunto;
    private String mensaje;
    private String branch;
    private String pickupDate;
    private String vehicle;
    private String template;

    public EmailDTO(String template,String destinatario, String asunto, String mensaje, String branch, String pickupDate, String vehicle) {
        this.destinatario = destinatario;
        this.asunto = asunto;
        this.mensaje = mensaje;
        this.branch = branch;
        this.pickupDate = pickupDate;
        this.vehicle = vehicle;
        this.template = template;
    }

    public EmailDTO( String template, String destinatario, String asunto, String mensaje) {
        this.destinatario = destinatario;
        this.asunto = asunto;
        this.mensaje = mensaje;
        this.template = template;
    }
}

