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
        // Models
        Model model1 = new Model("Renault", "12", 20000.0,
                ImageReader.readImage("static/images/Vehicles/Renault12.JPG"), 5, CancelationPolicy.FULL);

        Model model2 = new Model("Peugeot", "206", 25000.0,
                ImageReader.readImage("static/images/Vehicles/Peugeot206.JPG"), 5, CancelationPolicy.TWENTY);

        Model model3 = new Model("VolksWagen", "Gol Trend", 28000.0,
                ImageReader.readImage("static/images/Vehicles/VolksWagenGolTrend.JPG"), 4, CancelationPolicy.ZERO);

        Model model4 = new Model("Toyota", "Corolla", 45000.0,
                ImageReader.readImage("static/images/Vehicles/ToyotaCorolla.JPG"), 5, CancelationPolicy.FULL);

        Model model5 = new Model("Chevrolet", "Spin", 48000.0,
                ImageReader.readImage("static/images/Vehicles/ChevroletSpin.JPG"), 6, CancelationPolicy.TWENTY);

        Model model6 = new Model("Ford", "EcoSport", 50000.0,
                ImageReader.readImage("static/images/Vehicles/FordEcoSport.JPG"), 5, CancelationPolicy.ZERO);

        Model model7 = new Model("Nissan", "Versa", 42000.0,
                ImageReader.readImage("static/images/Vehicles/NissanVersa.JPG"), 5, CancelationPolicy.FULL);

        Model model8 = new Model("Fiat", "Cronos", 35000.0,
                ImageReader.readImage("static/images/Vehicles/FiatCronos.JPG"), 5, CancelationPolicy.TWENTY);

        Model model9 = new Model("VolksWagen", "T-Cross", 52000.0,
                ImageReader.readImage("static/images/Vehicles/VolksWagenTCross.JPG"), 5, CancelationPolicy.ZERO);

        Model model10 = new Model("Fiat", "Argo", 34000.0,
                ImageReader.readImage("static/images/Vehicles/FiatArgo.JPG"), 5, CancelationPolicy.FULL);

        autonuevo1.addModel(model1);
        autonuevo2.addModel(model2);
        autonuevo3.addModel(model3);
        autonuevo4.addModel(model4);
        autonuevo5.addModel(model5);
        autonuevo6.addModel(model6);
        autonuevo7.addModel(model7);
        autonuevo8.addModel(model8);
        autonuevo9.addModel(model9);
        autonuevo10.addModel(model10);

        autonuevo1.addBranch(branch1);
        autonuevo2.addBranch(branch1);
        autonuevo3.addBranch(branch1);
        autonuevo4.addBranch(branch1);
        autonuevo5.addBranch(branch1);
        autonuevo6.addBranch(branch1);
        autonuevo7.addBranch(branch1);
        autonuevo8.addBranch(branch1);
        autonuevo9.addBranch(branch1);
        autonuevo10.addBranch(branch1);

        // Guardarlos en el repositorio


        modelRepository.saveAll(Arrays.asList(
                model1,model2,model3,model4,model5,model6,model7,model8
        ));

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

        Reservation reservation1 = new Reservation("ABCDEF", LocalDate.of(2025, 6, 3), LocalDate.of(2025, 6, 25), 20000.0);
        reservation1.addClient(client1);
        reservation1.addModel(model1);
        reservation1.addBranch(branch1);
        reservation1.setVehicle(autonuevo1);

        Reservation reservation2 = new Reservation("AAAAAA", LocalDate.now(), LocalDate.of(2025, 7, 25), 20000.0);
        reservation2.addClient(client1);
        reservation2.addModel(model1);
        reservation2.addBranch(branch1);
        




        //appUsers
        userRepository.save(new AppUser("Maria","Ceccato","00000000","","mariaceccato@gmail.com", passwordEncoder.encode("123456"), UserRol.ADMIN));
        userRepository.save(client1);
        AppUser empleadoM = new AppUser("Martin","Esquercia","11111111","","martincito@gmail.com", passwordEncoder.encode("123456"), UserRol.EMPLOYEE);
        empleadoM.setBranch(branch1);
        userRepository.save(empleadoM);


        userRepository.save(new AppUser("Agustina","Sar","000020001","","agus99cabj12@gmail.com", passwordEncoder.encode("123456"), UserRol.CLIENT));
        userRepository.save(new AppUser("Emiliano","Sar","000020003","","emilianoross649@gmail.com", passwordEncoder.encode("123456"), UserRol.CLIENT));

        reservationRepository.save(reservation1);
        /*reservationRepository.saveAll(List.of(
                reservation1, reservation2, reservation3, reservation4, reservation5,
                reservation6, reservation7, reservation8, reservation9, reservation10
        ));*/



        cardRepository.saveAll(Arrays.asList(new Card("1234123412341234","123","FERNANDO MARZIALETTI"),new Card("4567456745674567","456","AGUSTIN SARGIOTTI")));// Tarjeta Optima, Tarjeta sin saldo, Tarjeta sin conexion.
    }
}
