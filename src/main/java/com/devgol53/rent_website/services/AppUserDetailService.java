package com.devgol53.rent_website.services;

import com.devgol53.rent_website.entities.AppUser;
import com.devgol53.rent_website.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AppUserDetailService implements UserDetailsService {
    @Autowired
    private AppUserRepository appUserRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("🟡 Buscando usuario: " + username);

        AppUser user = appUserRepository.findByEmail(username)
                .orElseThrow(() -> {
                    System.out.println("🔴 Usuario no encontrado: " + username);
                    return new UsernameNotFoundException("No se encontró el usuario con email " + username);
                });

        System.out.println("🟢 Usuario encontrado: " + user.getEmail());

        return User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRol().name())
                .build();
    }
}
