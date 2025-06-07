package com.devgol53.rent_website.services;

import com.devgol53.rent_website.dtos.email.EmailDTO;
import jakarta.mail.MessagingException;

public interface IEmailService{
    void sendMail(EmailDTO emailDTO) throws MessagingException;
}
