package com.devgol53.rent_website.configuration;

import com.devgol53.rent_website.components.CustomAccessDeniedHandler;
import com.devgol53.rent_website.components.CustomLoginSuccessHandler;
import com.devgol53.rent_website.services.AppUserDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    @Autowired
    private CustomAccessDeniedHandler customAccessDeniedHandler;
    @Autowired
    private CustomLoginSuccessHandler customLoginSuccessHandler;
    @Autowired
    private AppUserDetailService appUserDetailService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        //Rutas Publicas
                        .requestMatchers("/", "/index.html","/pages/vehiculos.html","/styles/**", "/scripts/**", "/images/**").permitAll()
                        //Rutas ADMIN
                        .requestMatchers("/pages/admin.html","/h2-console/**").hasRole("ADMIN")
                        .requestMatchers("/api/car/all").hasRole("ADMIN")
                        .requestMatchers("/api/car/create").hasRole("ADMIN")
                        //Rutas CLIENT
                        .requestMatchers("/pages/client.html").hasRole("CLIENT")
                        //Rutas EMPLOYEE
                        .requestMatchers("/pages/employee.html").hasRole("EMPLOYEE")
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .successHandler(customLoginSuccessHandler)
                        .permitAll()
                )
                .exceptionHandling(ex -> ex
                        .accessDeniedHandler(customAccessDeniedHandler) // 👈 clave para tu caso
                )
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()));

        return http.build();
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http, PasswordEncoder encoder) throws Exception {
        AuthenticationManagerBuilder auth = http.getSharedObject(AuthenticationManagerBuilder.class);
        auth.userDetailsService(appUserDetailService).passwordEncoder(encoder);
        return auth.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
