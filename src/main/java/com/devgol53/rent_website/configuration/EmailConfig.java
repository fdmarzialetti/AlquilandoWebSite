package com.devgol53.rent_website.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
@PropertySource("classpath:email.properties")
public class EmailConfig {
    @Value("${email.username}")
    private String username;
    @Value("${email.password}")
    private String password;

    private Properties getMailProperties(){
        Properties properties = new Properties();
        properties.put("mail.smtp.auth","true");
        properties.put("mail.smtp.starttls"+".enable", "true");
        properties.put("mail.smtp.host","smtp"+".gmail.com");
        properties.put("mail.smtp.port","587");
        return properties;
    }

    @Bean
    public JavaMailSender javaMailSender(){
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setJavaMailProperties(getMailProperties());
        mailSender.setUsername(this.username);
        mailSender.setPassword(this.password);
        return mailSender;
    }

    @Bean
    public ResourceLoader resourceLoader(){
        return new DefaultResourceLoader();
    }
}
