package com.devgol53.rent_website.components;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException, ServletException {

        Authentication auth = (Authentication) request.getUserPrincipal();

        if (auth != null) {
            for (GrantedAuthority authority : auth.getAuthorities()) {
                String role = authority.getAuthority();

                switch (role) {
                    case "ROLE_ADMIN":
                        response.sendRedirect("/pages/reportFacturationreportFacturation.html");
                        return;
                    case "ROLE_EMPLOYEE":
                        response.sendRedirect("/pages/employee.html");
                        return;
                    case "ROLE_CLIENT":
                        response.sendRedirect("/pages/client.html");
                        return;
                }
            }
        }

        // Si no tiene ningún rol conocido o no está autenticado
        response.sendRedirect("/index.html");
    }
}
