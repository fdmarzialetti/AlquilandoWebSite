package com.devgol53.rent_website.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class CarExeptionHandler {

    @ExceptionHandler(CarNotFoundExeption.class)
    public ResponseEntity<String> handleCarNotFound(CarNotFoundExeption ex){
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}
