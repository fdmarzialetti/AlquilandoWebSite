package com.devgol53.rent_website.utils;

import com.devgol53.rent_website.entities.*;
import com.devgol53.rent_website.enums.CancelationPolicy;
import com.devgol53.rent_website.enums.CarStatus;
import com.devgol53.rent_website.enums.UserRol;
import com.devgol53.rent_website.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DBRunner implements CommandLineRunner {
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    CarRepositorie carRepositorie;
    @Autowired
    AppUserRepository userRepository;
    @Autowired
    ModelRepository modelRepository;
    @Autowired
    VehicleRepository vehicleRepository;
    @Autowired
    BranchRepository branchRepository;



    @Override
    public void run(String... args) throws Exception {
        Branch branch1= new Branch("Coronel Brandsen","Las Heras 555");
        Branch branch2= new Branch("Berazategui","Los Alamos 666");
        Branch branch3= new Branch("La Plata","18 e 16 y 17");

        // Crear varios vehículos
        Vehicle autonuevo1 = new Vehicle("abd323", "disponible", 2012);
        Vehicle autonuevo2 = new Vehicle("xyz789", "disponible", 2018);
        Vehicle autonuevo3 = new Vehicle("qwe456", "ocupado", 2015);
        Vehicle autonuevo4 = new Vehicle("rty987", "disponible", 2020);
        Vehicle autonuevo5 = new Vehicle("uio654", "mantenimiento", 2017);
        Vehicle autonuevo6 = new Vehicle("asd321", "disponible", 2019);
        Vehicle autonuevo7 = new Vehicle("fgh852", "ocupado", 2013);
        Vehicle autonuevo8 = new Vehicle("jkl963", "disponible", 2021);
        Vehicle autonuevo9 = new Vehicle("zxc741", "disponible", 2014);
        Vehicle autonuevo10 = new Vehicle("vbn258", "disponible", 2016);


        Model modelonuevo = new Model("Renault","12",100.0,ImageReader.readImage("static/images/Vehicles/Renault12.JPG"),5, CancelationPolicy.FULL);
        Model modelonuevo2 = new Model("Peugeot","206",1000.0,ImageReader.readImage("static/images/Vehicles/Peugeot206.JPG"),300, CancelationPolicy.TWENTY);
        Model modelonuevo3 = new Model("VolksWagen","Gol Trend",2000.0,ImageReader.readImage("static/images/Vehicles/VolksWagenGolTrend.JPG"),200, CancelationPolicy.ZERO);

        autonuevo1.addModel(modelonuevo);
        autonuevo2.addModel(modelonuevo);
        autonuevo3.addModel(modelonuevo);
        autonuevo4.addModel(modelonuevo);
        autonuevo5.addModel(modelonuevo2);
        autonuevo5.addModel(modelonuevo2);
        autonuevo6.addModel(modelonuevo2);
        autonuevo7.addModel(modelonuevo3);
        autonuevo8.addModel(modelonuevo3);
        autonuevo9.addModel(modelonuevo3);
        autonuevo10.addModel(modelonuevo3);

        autonuevo1.addBranch(branch1);
        autonuevo2.addBranch(branch2);
        autonuevo3.addBranch(branch3);
        autonuevo4.addBranch(branch1);
        autonuevo5.addBranch(branch2);
        autonuevo5.addBranch(branch3);
        autonuevo6.addBranch(branch1);
        autonuevo7.addBranch(branch2);
        autonuevo8.addBranch(branch3);
        autonuevo9.addBranch(branch1);
        autonuevo10.addBranch(branch2);

        // Guardarlos en el repositorio


        modelRepository.saveAll(Arrays.asList(modelonuevo,modelonuevo2,modelonuevo3));

        branchRepository.saveAll(Arrays.asList(branch1,branch2,branch3));

        vehicleRepository.save(autonuevo1);
        vehicleRepository.save(autonuevo2);
        vehicleRepository.save(autonuevo3);
        vehicleRepository.save(autonuevo4);
        vehicleRepository.save(autonuevo5);
        vehicleRepository.save(autonuevo6);
        vehicleRepository.save(autonuevo7);
        vehicleRepository.save(autonuevo8);
        vehicleRepository.save(autonuevo9);
        vehicleRepository.save(autonuevo10);

        userRepository.save(new AppUser("Maria","Ceccato","00000000","","mariaceccato@gmail.com", passwordEncoder.encode("123456"), UserRol.ADMIN));
        userRepository.save(new AppUser("Fernando","Marzialetti","35060094","","fdmarzialetti@gmail.com", passwordEncoder.encode("123456"), UserRol.CLIENT));
        userRepository.save(new AppUser("Martin","Esquercia","11111111","","martincito@gmail.com", passwordEncoder.encode("aguantelaMERKAAAA"), UserRol.EMPLOYEE));
    }
}
