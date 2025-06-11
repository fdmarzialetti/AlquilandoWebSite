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

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DBRunner implements CommandLineRunner {
    @Autowired
    CardRepository cardRepository;
    @Autowired
    ReservationRepository reservationRepository;
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
        autonuevo2.addModel(modelonuevo2);
        autonuevo3.addModel(modelonuevo2);
        autonuevo4.addModel(modelonuevo2);
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
        //vehicle repository
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

        AppUser client1 = new AppUser("Fernando","Marzialetti","35060094","","fdmarzialetti@gmail.com", passwordEncoder.encode("123456"), UserRol.CLIENT);


        //Reservation repository
        /*Reservation reservation1 = new Reservation("ABCDEF", LocalDate.of(2025, 6, 3), LocalDate.of(2025, 6, 25), 20000.0);
        reservation1.addClient(client1);
        reservation1.addModel(modelonuevo);
        reservation1.addBranch(branch1);

        Reservation reservation2 = new Reservation("ZXCVBN", LocalDate.of(2025, 7, 1), LocalDate.of(2025, 7, 6), 15000.0);
        reservation2.addClient(client1);
        reservation2.addModel(modelonuevo2);
        reservation2.addBranch(branch2);

        Reservation reservation3 = new Reservation("QWERTY", LocalDate.of(2025, 6, 10), LocalDate.of(2025, 6, 14), 18000.0);
        reservation3.addClient(client1);
        reservation3.addModel(modelonuevo3);
        reservation3.addBranch(branch3);

        Reservation reservation4 = new Reservation("LMNOPQ", LocalDate.of(2025, 6, 15), LocalDate.of(2025, 6, 19), 13000.0);
        reservation4.addClient(client1);
        reservation4.addModel(modelonuevo);
        reservation4.addBranch(branch1);

        Reservation reservation5 = new Reservation("GHJKLM", LocalDate.of(2025, 7, 10), LocalDate.of(2025, 7, 14), 17000.0);
        reservation5.addClient(client1);
        reservation5.addModel(modelonuevo2);
        reservation5.addBranch(branch2);

        Reservation reservation6 = new Reservation("ASDFGH", LocalDate.of(2025, 7, 20), LocalDate.of(2025, 7, 24), 16000.0);
        reservation6.addClient(client1);
        reservation6.addModel(modelonuevo3);
        reservation6.addBranch(branch3);

        Reservation reservation7 = new Reservation("POIUYT", LocalDate.of(2025, 8, 1), LocalDate.of(2025, 8, 5), 14000.0);
        reservation7.addClient(client1);
        reservation7.addModel(modelonuevo);
        reservation7.addBranch(branch1);

        Reservation reservation8 = new Reservation("MNBVCX", LocalDate.of(2025, 8, 10), LocalDate.of(2025, 8, 15), 19000.0);
        reservation8.addClient(client1);
        reservation8.addModel(modelonuevo2);
        reservation8.addBranch(branch2);

        Reservation reservation9 = new Reservation("TREWQA", LocalDate.of(2025, 8, 20), LocalDate.of(2025, 8, 25), 21000.0);
        reservation9.addClient(client1);
        reservation9.addModel(modelonuevo3);
        reservation9.addBranch(branch3);

        Reservation reservation10 = new Reservation("YUIOPL", LocalDate.of(2025, 9, 1), LocalDate.of(2025, 9, 5), 15500.0);
        reservation10.addClient(client1);
        reservation10.addModel(modelonuevo2);
        reservation10.addBranch(branch1);*/

        Reservation reservation1 = new Reservation("ABCDEF", LocalDate.of(2025, 6, 3), LocalDate.of(2025, 6, 25), 20000.0);
        reservation1.addClient(client1);
        reservation1.addModel(modelonuevo);
        reservation1.addBranch(branch1);
        reservation1.setVehicle(autonuevo1);



        //appUsers
        userRepository.save(new AppUser("Maria","Ceccato","00000000","","mariaceccato@gmail.com", passwordEncoder.encode("123456"), UserRol.ADMIN));
        userRepository.save(client1);
        userRepository.save(new AppUser("Martin","Esquercia","11111111","","martincito@gmail.com", passwordEncoder.encode("123456"), UserRol.EMPLOYEE));
        userRepository.save(new AppUser("Agustina","Sar","000020001","","agus99cabj12@gmail.com", passwordEncoder.encode("123456"), UserRol.CLIENT));
        userRepository.save(new AppUser("Martin","Sar","000020002","","martinesquercia99@gmail.com", passwordEncoder.encode("123456"), UserRol.CLIENT));
        userRepository.save(new AppUser("Emiliano","Sar","000020003","","emilianoross649@gmail.com", passwordEncoder.encode("123456"), UserRol.CLIENT));

        reservationRepository.save(reservation1);
        /*reservationRepository.saveAll(List.of(
                reservation1, reservation2, reservation3, reservation4, reservation5,
                reservation6, reservation7, reservation8, reservation9, reservation10
        ));*/



        cardRepository.saveAll(Arrays.asList(new Card("1234123412341234"),new Card("4567456745674567"),new Card("1111111111111111")));// Tarjeta Optima, Tarjeta sin saldo, Tarjeta sin conexion.
    }
}
