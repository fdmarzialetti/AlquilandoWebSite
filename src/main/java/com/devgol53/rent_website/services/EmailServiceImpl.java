package com.devgol53.rent_website.services;

import com.devgol53.rent_website.dtos.email.EmailDTO;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailServiceImpl implements IEmailService{
    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    public EmailServiceImpl(JavaMailSender javaMailSender, TemplateEngine templateEngine) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
    }
@Override
    public void sendMail(EmailDTO emailDTO) throws MessagingException {
    try {


    MimeMessage message = javaMailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
    helper.setTo(emailDTO.getDestinatario());
    helper.setSubject(emailDTO.getAsunto());
    Context context = new Context();
    context.setVariable("message", emailDTO.getMensaje());
        context.setVariable("pickupDate", emailDTO.getPickupDate());
        context.setVariable("branch", emailDTO.getBranch());
        context.setVariable("vehicle", emailDTO.getVehicle());
    String contentHTML = templateEngine.process("email", context);
    helper.setText(contentHTML, true);
    javaMailSender.send(message);
    }catch(Exception e){
        throw new RuntimeException("Error al enviar el email", e);
    }
    }
}
