package com.devgol53.rent_website.dtos.appUser;

import com.devgol53.rent_website.enums.UserRol;
import lombok.Getter;

@Getter
public class AppUserPostDTO {
    private String name;
    private String lastname;
    private String dni;
    private String email;
    private String password;
    private UserRol rol;
    private String phone;
    private boolean registradoPorEmpleado;
}
