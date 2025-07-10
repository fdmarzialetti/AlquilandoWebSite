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

        Reservation reservation3 = new Reservation("BBBBBB", LocalDate.of(2025, 7, 1), LocalDate.of(2025, 7, 25), 45000.0);
        reservation3.addClient(client1);
        reservation3.addModel(model4);
        reservation3.addBranch(branch1);
        reservation3.setVehicle(autonuevo4);

        Reservation reservation4 = new Reservation("ZZZZZZ", LocalDate.now(), LocalDate.of(2025, 7, 25), 45000.0);
        reservation4.addClient(client1);
        reservation4.addModel(model5);
        reservation4.addBranch(branch1);

        Reservation reservation6 = new Reservation("CODE006", LocalDate.of(2025, 6, 6), LocalDate.of(2025, 6, 10), 15000.0);
        reservation6.addValoration(new Valoration(4, "Buena atención en la sucursal y el auto estaba limpio y en buen estado."));

        Reservation reservation7 = new Reservation("CODE007", LocalDate.of(2025, 6, 8), LocalDate.of(2025, 6, 12), 18000.0);
        reservation7.addValoration(new Valoration(5, "Excelente atención, el proceso fue rápido y el auto era prácticamente nuevo."));

        Reservation reservation8 = new Reservation("CODE008", LocalDate.of(2025, 6, 10), LocalDate.of(2025, 6, 14), 17000.0);
        reservation8.addValoration(new Valoration(3, "Todo estuvo bien, aunque el auto presentaba algunos rayones en la carrocería."));

        Reservation reservation9 = new Reservation("CODE009", LocalDate.of(2025, 6, 12), LocalDate.of(2025, 6, 18), 22000.0);
        reservation9.addValoration(new Valoration(2, "La entrega demoró más de 40 minutos y no ofrecieron ninguna compensación."));

        Reservation reservation10 = new Reservation("CODE010", LocalDate.of(2025, 6, 14), LocalDate.of(2025, 6, 19), 19500.0);
        reservation10.addValoration(new Valoration(4, "Rápido y sin complicaciones. El vehículo cumplió con lo prometido y estaba limpio."));

        Reservation reservation11 = new Reservation("CODE011", LocalDate.of(2025, 6, 16), LocalDate.of(2025, 6, 20), 16000.0);
        reservation11.addValoration(new Valoration(5, "Perfecto para un viaje corto. Auto cómodo y económico en combustible."));

        Reservation reservation12 = new Reservation("CODE012", LocalDate.of(2025, 6, 18), LocalDate.of(2025, 6, 22), 21000.0);
        reservation12.addValoration(new Valoration(1, "El auto se apagó dos veces en plena ruta, lo que generó una experiencia muy negativa."));

        Reservation reservation13 = new Reservation("CODE013", LocalDate.of(2025, 6, 20), LocalDate.of(2025, 6, 24), 20000.0);
        reservation13.addValoration(new Valoration(3, "El servicio fue regular, no explicaron bien los términos del contrato y faltó comunicación."));

        Reservation reservation14 = new Reservation("CODE014", LocalDate.of(2025, 6, 22), LocalDate.of(2025, 6, 26), 18500.0);
        reservation14.addValoration(new Valoration(4, "Buena atención y entrega a tiempo. El auto funcionaba sin inconvenientes."));

        Reservation reservation15 = new Reservation("CODE015", LocalDate.of(2025, 6, 24), LocalDate.of(2025, 6, 28), 17500.0);
        reservation15.addValoration(new Valoration(5, "Muy recomendable, personal amable y auto en excelente estado."));

        Reservation reservation16 = new Reservation("CODE016", LocalDate.of(2025, 6, 26), LocalDate.of(2025, 6, 30), 16000.0);
        reservation16.addValoration(new Valoration(2, "El tanque no estaba lleno al momento de la entrega, lo cual fue decepcionante."));

        Reservation reservation17 = new Reservation("CODE017", LocalDate.of(2025, 6, 28), LocalDate.of(2025, 7, 2), 19000.0);
        reservation17.addValoration(new Valoration(3, "Aceptable, pero la limpieza del vehículo podría mejorar para futuras reservas."));

        Reservation reservation18 = new Reservation("CODE018", LocalDate.of(2025, 6, 30), LocalDate.of(2025, 7, 4), 22000.0);
        reservation18.addValoration(new Valoration(4, "Auto nuevo y con excelente rendimiento. Muy buena experiencia general."));

        Reservation reservation19 = new Reservation("CODE019", LocalDate.of(2025, 7, 1), LocalDate.of(2025, 7, 5), 17000.0);
        reservation19.addValoration(new Valoration(1, "Problemas con la reserva, la confirmación tardó demasiado y casi pierdo el viaje."));

        Reservation reservation20 = new Reservation("CODE020", LocalDate.of(2025, 7, 2), LocalDate.of(2025, 7, 6), 16500.0);
        reservation20.addValoration(new Valoration(5, "Impecable todo, desde la atención hasta el vehículo entregado."));

        Reservation reservation21 = new Reservation("CODE021", LocalDate.of(2025, 7, 3), LocalDate.of(2025, 7, 7), 19000.0);
        reservation21.addValoration(new Valoration(4, "Servicio correcto, sin mayores inconvenientes y buena comunicación."));

        Reservation reservation22 = new Reservation("CODE022", LocalDate.of(2025, 7, 4), LocalDate.of(2025, 7, 8), 18000.0);
        reservation22.addValoration(new Valoration(3, "Satisfactorio, pero el vehículo no estaba tan limpio como esperaba."));

        Reservation reservation23 = new Reservation("CODE023", LocalDate.of(2025, 7, 5), LocalDate.of(2025, 7, 9), 18500.0);
        reservation23.addValoration(new Valoration(5, "Todo salió perfecto, el auto y el servicio superaron mis expectativas."));

        Reservation reservation24 = new Reservation("CODE024", LocalDate.of(2025, 7, 6), LocalDate.of(2025, 7, 10), 20000.0);
        reservation24.addValoration(new Valoration(4, "Buena atención y rápida gestión al momento de retirar el auto."));

        Reservation reservation25 = new Reservation("CODE025", LocalDate.of(2025, 7, 7), LocalDate.of(2025, 7, 11), 19500.0);
        reservation25.addValoration(new Valoration(2, "El auto presentaba algunos detalles estéticos que no me gustaron."));

        Reservation reservation26 = new Reservation("CODE026", LocalDate.of(2025, 7, 8), LocalDate.of(2025, 7, 12), 21000.0);
        reservation26.addValoration(new Valoration(3, "Bien en general, aunque podrían mejorar el proceso de entrega."));

        Reservation reservation27 = new Reservation("CODE027", LocalDate.of(2025, 7, 9), LocalDate.of(2025, 7, 13), 20000.0);
        reservation27.addValoration(new Valoration(5, "Servicio rápido y eficiente, auto en excelente estado."));

        Reservation reservation28 = new Reservation("CODE028", LocalDate.of(2025, 7, 10), LocalDate.of(2025, 7, 14), 17500.0);
        reservation28.addValoration(new Valoration(4, "Buena experiencia, personal amable y vehículo cómodo."));

        Reservation reservation29 = new Reservation("CODE029", LocalDate.of(2025, 7, 11), LocalDate.of(2025, 7, 15), 16500.0);
        reservation29.addValoration(new Valoration(1, "No fue lo que esperaba, el vehículo tenía fallas menores que afectaron el viaje."));

        Reservation reservation30 = new Reservation("CODE030", LocalDate.of(2025, 7, 12), LocalDate.of(2025, 7, 16), 19000.0);
        reservation30.addValoration(new Valoration(5, "Todo excelente, sin contratiempos y con buena atención al cliente."));

        Reservation reservation31 = new Reservation("CODE031", LocalDate.of(2025, 7, 13), LocalDate.of(2025, 7, 17), 18000.0);
        reservation31.addValoration(new Valoration(2, "El auto tenía problemas mecánicos que fueron molestos durante el viaje."));

        Reservation reservation32 = new Reservation("CODE032", LocalDate.of(2025, 7, 14), LocalDate.of(2025, 7, 18), 17500.0);
        reservation32.addValoration(new Valoration(3, "Aceptable, aunque esperaba mejor mantenimiento del vehículo."));

        Reservation reservation33 = new Reservation("CODE033", LocalDate.of(2025, 7, 15), LocalDate.of(2025, 7, 19), 20000.0);
        reservation33.addValoration(new Valoration(4, "Muy bien en general, auto cómodo y buen servicio."));

        Reservation reservation34 = new Reservation("CODE034", LocalDate.of(2025, 7, 16), LocalDate.of(2025, 7, 20), 18500.0);
        reservation34.addValoration(new Valoration(5, "Todo impecable, desde la reserva hasta la devolución."));

        Reservation reservation35 = new Reservation("CODE035", LocalDate.of(2025, 7, 17), LocalDate.of(2025, 7, 21), 17000.0);
        reservation35.addValoration(new Valoration(4, "Buena atención y servicio durante todo el proceso."));

        Reservation reservation36 = new Reservation("CODE036", LocalDate.of(2025, 7, 18), LocalDate.of(2025, 7, 22), 18500.0);
        reservation36.addValoration(new Valoration(5, "El mejor alquiler que hice hasta ahora. Auto nuevo, atención excelente."));

        Reservation reservation37 = new Reservation("CODE037", LocalDate.of(2025, 7, 19), LocalDate.of(2025, 7, 23), 19000.0);
        reservation37.addValoration(new Valoration(4, "Todo bien salvo que no tenía GPS como se prometía."));

        Reservation reservation38 = new Reservation("CODE038", LocalDate.of(2025, 7, 20), LocalDate.of(2025, 7, 24), 17000.0);
        reservation38.addValoration(new Valoration(3, "Entrega rápida pero el aire acondicionado no funcionaba correctamente."));

        Reservation reservation39 = new Reservation("CODE039", LocalDate.of(2025, 7, 21), LocalDate.of(2025, 7, 25), 20000.0);
        reservation39.addValoration(new Valoration(5, "Excelente trato, el auto estaba limpio, cómodo y rendidor."));

        Reservation reservation40 = new Reservation("CODE040", LocalDate.of(2025, 7, 22), LocalDate.of(2025, 7, 26), 16000.0);
        reservation40.addValoration(new Valoration(2, "El personal fue amable, pero el vehículo tenía mal olor y estaba sucio."));

        Reservation reservation41 = new Reservation("CODE041", LocalDate.of(2025, 7, 23), LocalDate.of(2025, 7, 27), 17500.0);
        reservation41.addValoration(new Valoration(3, "El auto cumplió su función, pero esperaba más por ese precio."));

        Reservation reservation42 = new Reservation("CODE042", LocalDate.of(2025, 7, 24), LocalDate.of(2025, 7, 28), 18500.0);
        reservation42.addValoration(new Valoration(4, "Muy buena experiencia. Solo demoraron en devolver el depósito."));

        Reservation reservation43 = new Reservation("CODE043", LocalDate.of(2025, 7, 25), LocalDate.of(2025, 7, 29), 20000.0);
        reservation43.addValoration(new Valoration(5, "Auto nuevo, con pocos kilómetros y excelente consumo."));

        Reservation reservation44 = new Reservation("CODE044", LocalDate.of(2025, 7, 26), LocalDate.of(2025, 7, 30), 19000.0);
        reservation44.addValoration(new Valoration(1, "El auto se quedó sin frenos. Un peligro."));

        Reservation reservation45 = new Reservation("CODE045", LocalDate.of(2025, 7, 27), LocalDate.of(2025, 7, 31), 17000.0);
        reservation45.addValoration(new Valoration(4, "Buena experiencia general. Me ofrecieron extender el tiempo sin cargo."));

        Reservation reservation46 = new Reservation("CODE046", LocalDate.of(2025, 7, 28), LocalDate.of(2025, 8, 1), 16000.0);
        reservation46.addValoration(new Valoration(2, "El auto tenía un ruido extraño al frenar."));

        Reservation reservation47 = new Reservation("CODE047", LocalDate.of(2025, 7, 29), LocalDate.of(2025, 8, 2), 21000.0);
        reservation47.addValoration(new Valoration(5, "Muy fácil de reservar, buena atención al cliente y coche de calidad."));

        Reservation reservation48 = new Reservation("CODE048", LocalDate.of(2025, 7, 30), LocalDate.of(2025, 8, 3), 16500.0);
        reservation48.addValoration(new Valoration(3, "Auto justo, no es como el de las fotos."));

        Reservation reservation49 = new Reservation("CODE049", LocalDate.of(2025, 7, 31), LocalDate.of(2025, 8, 4), 18000.0);
        reservation49.addValoration(new Valoration(4, "Todo bien, pero tardaron en confirmar la reserva."));

        Reservation reservation50 = new Reservation("CODE050", LocalDate.of(2025, 8, 1), LocalDate.of(2025, 8, 5), 17500.0);
        reservation50.addValoration(new Valoration(5, "Perfecto, lo voy a volver a usar sin dudas."));

        Reservation reservation51 = new Reservation("CODE051", LocalDate.of(2025, 8, 2), LocalDate.of(2025, 8, 6), 19000.0);
        reservation51.addValoration(new Valoration(1, "Se rompió la cerradura y me quedé afuera del coche."));

        Reservation reservation52 = new Reservation("CODE052", LocalDate.of(2025, 8, 3), LocalDate.of(2025, 8, 7), 18500.0);
        reservation52.addValoration(new Valoration(2, "Podrían haber limpiado mejor el interior."));

        Reservation reservation53 = new Reservation("CODE053", LocalDate.of(2025, 8, 4), LocalDate.of(2025, 8, 8), 18000.0);
        reservation53.addValoration(new Valoration(4, "Muy buen consumo de combustible. Ideal para viajes largos."));

        Reservation reservation54 = new Reservation("CODE054", LocalDate.of(2025, 8, 5), LocalDate.of(2025, 8, 9), 20000.0);
        reservation54.addValoration(new Valoration(5, "El mejor precio y la mejor calidad. Muy conforme."));

        Reservation reservation55 = new Reservation("CODE055", LocalDate.of(2025, 8, 6), LocalDate.of(2025, 8, 10), 19500.0);
        reservation55.addValoration(new Valoration(3, "Todo correcto, aunque esperaba más amabilidad del personal."));

        reservation6.addModel(model6);
        reservation7.addModel(model7);
        reservation8.addModel(model8);
        reservation9.addModel(model9);
        reservation10.addModel(model10);
        reservation11.addModel(model1);
        reservation12.addModel(model2);
        reservation13.addModel(model3);
        reservation14.addModel(model4);
        reservation15.addModel(model5);
        reservation16.addModel(model6);
        reservation17.addModel(model7);
        reservation18.addModel(model8);
        reservation19.addModel(model9);
        reservation20.addModel(model10);
        reservation21.addModel(model1);
        reservation22.addModel(model2);
        reservation23.addModel(model3);
        reservation24.addModel(model4);
        reservation25.addModel(model5);
        reservation26.addModel(model6);
        reservation27.addModel(model7);
        reservation28.addModel(model8);
        reservation29.addModel(model9);
        reservation30.addModel(model10);
        reservation31.addModel(model1);
        reservation32.addModel(model2);
        reservation33.addModel(model3);
        reservation34.addModel(model4);
        reservation35.addModel(model5);
        reservation36.addModel(model6);
        reservation37.addModel(model7);
        reservation38.addModel(model8);
        reservation39.addModel(model9);
        reservation40.addModel(model10);
        reservation41.addModel(model1);
        reservation42.addModel(model2);
        reservation43.addModel(model3);
        reservation44.addModel(model4);
        reservation45.addModel(model5);
        reservation46.addModel(model6);
        reservation47.addModel(model7);
        reservation48.addModel(model8);
        reservation49.addModel(model9);
        reservation50.addModel(model10);
        reservation51.addModel(model1);
        reservation52.addModel(model2);
        reservation53.addModel(model3);
        reservation54.addModel(model4);
        reservation55.addModel(model5);

        //appUsers
        userRepository.save(new AppUser("Maria","Ceccato","00000000","","mariaceccato@gmail.com", passwordEncoder.encode("123456"), UserRol.ADMIN));
        userRepository.save(client1);
        AppUser empleadoM = new AppUser("Martin","Esquercia","11111111","","martincito@gmail.com", passwordEncoder.encode("123456"), UserRol.EMPLOYEE);
        empleadoM.setBranch(branch1);
        userRepository.save(empleadoM);


        userRepository.save(new AppUser("Agustina","Sar","000020001","","agus99cabj12@gmail.com", passwordEncoder.encode("123456"), UserRol.CLIENT));
        userRepository.save(new AppUser("Emiliano","Sar","000020003","","emilianoross649@gmail.com", passwordEncoder.encode("123456"), UserRol.CLIENT));

        reservationRepository.saveAll(List.of(
                reservation1, reservation2, reservation3, reservation4,
                reservation6, reservation7, reservation8, reservation9, reservation10,
                reservation11, reservation12, reservation13, reservation14, reservation15,
                reservation16, reservation17, reservation18, reservation19, reservation20,
                reservation21, reservation22, reservation23, reservation24, reservation25,
                reservation26, reservation27, reservation28, reservation29, reservation30,
                reservation31, reservation32, reservation33, reservation34, reservation35,
                reservation36, reservation37, reservation38, reservation39, reservation40,
                reservation41, reservation42, reservation43, reservation44, reservation45,
                reservation46, reservation47, reservation48, reservation49, reservation50,
                reservation51, reservation52, reservation53, reservation54, reservation55
        ));



        cardRepository.saveAll(Arrays.asList(new Card("1234123412341234","123","FERNANDO MARZIALETTI"),new Card("4567456745674567","456","AGUSTIN SARGIOTTI")));// Tarjeta Optima, Tarjeta sin saldo, Tarjeta sin conexion.
    }
}
