package com.devgol53.rent_website.utils;

import java.security.SecureRandom;

public class CodeGenerator {
    private static final String CARACTERES = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int LONGITUD = 8;
    private static final SecureRandom random = new SecureRandom();

    public static String generarCodigoAlfanumerico() {
        StringBuilder sb = new StringBuilder(LONGITUD);
        for (int i = 0; i < LONGITUD; i++) {
            int index = random.nextInt(CARACTERES.length());
            sb.append(CARACTERES.charAt(index));
        }
        return sb.toString();
    }
}
