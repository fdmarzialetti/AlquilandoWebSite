package com.devgol53.rent_website.components;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;

@Component
public class CustomLoginSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // Obtené los roles del usuario
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        // Redirigí según el rol
        for (GrantedAuthority authority : authorities) {
            String role = authority.getAuthority();

            switch (role) {
                case "ADMIN":
                    response.sendRedirect("/pages/admin.html");
                    return;
                case "EMPLOYEE":
                    response.sendRedirect("/pages/employee.html");
                    return;
                case "CLIENT":
                    response.sendRedirect("/pages/client.html");
                    return;
            }
        }

        // Redirección por defecto
        response.sendRedirect("/default.html");
    }
}
