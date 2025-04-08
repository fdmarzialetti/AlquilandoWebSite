package com.devgol53.rent_website.exceptions;

public class CarNotFoundExeption extends RuntimeException{
    public CarNotFoundExeption(Long id){
        super("Auto con ID " + id + " no encontrado.");
    }
}
