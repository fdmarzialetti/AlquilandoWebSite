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

        AppUser user = appUserRepository.findByEmail(username).orElseThrow(()->new UsernameNotFoundException("No se encontro el usuario con email "+username));

        return User.builder()
                .username(user.getEmail()) // usamos email como username
                .password(user.getPassword()) // debe estar encriptada
                .roles(user.getRol().name()) // ejemplo: ADMIN
                .build();
    }
}
