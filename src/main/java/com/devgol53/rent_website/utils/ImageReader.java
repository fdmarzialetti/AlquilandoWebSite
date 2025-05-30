package com.devgol53.rent_website.utils;

import java.nio.file.Files;
import java.nio.file.Paths;

public class ImageReader {
    public static byte[] readImage(String path) {
        try {
            return Files.readAllBytes(Paths.get(ClassLoader.getSystemResource(path).toURI()));
        } catch (Exception e) {
            throw new RuntimeException("No se pudo leer la imagen: " + path, e);
        }
    }
}
