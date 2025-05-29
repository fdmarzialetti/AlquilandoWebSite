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
        Vehicle autonuevo1=new Vehicle("abd323","disponible",2012);
        Model modelonuevo = new Model("Renault","12",100.0,"imgendelautito",5, CancelationPolicy.FULL);
        Model modelonuevo2 = new Model("Peugeot","206",1000.0,"imgendelautito2",300, CancelationPolicy.TWENTY);
        Model modelonuevo3 = new Model("VolksWagen","Gol Trend",2000.0,"imgendelautito3",200, CancelationPolicy.ZERO);

        modelRepository.saveAll(Arrays.asList(modelonuevo,modelonuevo2,modelonuevo3));
        vehicleRepository.save(autonuevo1);
        branchRepository.saveAll(Arrays.asList(branch1,branch2,branch3));

        carRepositorie.saveAll(
                Arrays.asList(
                    new Car("Ford","Fiesta", CarStatus.MAINTENANCE),
                    new Car("Ford","Eco Sport",CarStatus.MAINTENANCE),
                    new Car("Renault","Logan",CarStatus.MAINTENANCE)
                )
        );
        carRepositorie.save(new Car("VolksWagen","Suran",CarStatus.MAINTENANCE));
        userRepository.save(new AppUser("Maria","Ceccato","00000000","","mariaceccato@gmail.com", passwordEncoder.encode("Alquilando"), UserRol.ADMIN));
        userRepository.save(new AppUser("Fernando","Marzialetti","35060094","","fdmarzialetti@gmail.com", passwordEncoder.encode("DevGol53"), UserRol.CLIENT));
        userRepository.save(new AppUser("Martin","Esquercia","11111111","","martincito@gmail.com", passwordEncoder.encode("aguantelafalopa"), UserRol.EMPLOYEE));
    }
}
