package com.devgol53.rent_website.utils;

import com.devgol53.rent_website.entities.*;
import com.devgol53.rent_website.enums.CancelationPolicy;
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
    @Autowired
    AdditionalRepository additionalRepository;



    @Override
    public void run(String... args) throws Exception {
        Branch branch1= new Branch("Coronel Brandsen","Las Heras 555");
        Branch branch2= new Branch("Berazategui","Los Alamos 666");
        Branch branch3= new Branch("La Plata","18 e 16 y 17");

        // Crear varios vehículos
        Vehicle autonuevo1 = new Vehicle("abd323", false, 2012);
        Vehicle autonuevo2 = new Vehicle("xyz789", false, 2018);
        Vehicle autonuevo3 = new Vehicle("qwe456", true, 2015);
        Vehicle autonuevo4 = new Vehicle("rty987", false, 2020);
        Vehicle autonuevo5 = new Vehicle("uio654", true, 2017);
        Vehicle autonuevo6 = new Vehicle("asd321", false, 2019);
        Vehicle autonuevo7 = new Vehicle("fgh852", true, 2013);
        Vehicle autonuevo8 = new Vehicle("jkl963", false, 2021);
        Vehicle autonuevo9 = new Vehicle("zxc741", false, 2014);
        Vehicle autonuevo10 = new Vehicle("vbn258", false, 2016);
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
        autonuevo8.addBranch(branch2);
        autonuevo9.addBranch(branch2);
        autonuevo10.addBranch(branch2);

        Vehicle autonuevo11 = new Vehicle("hjk111", true, 2017);
        Vehicle autonuevo12 = new Vehicle("lmn222", false, 2019);
        Vehicle autonuevo13 = new Vehicle("opq333", true, 2016);
        Vehicle autonuevo14 = new Vehicle("rst444", false, 2022);
        Vehicle autonuevo15 = new Vehicle("uvw555", true, 2015);
        Vehicle autonuevo16 = new Vehicle("cde666", false, 2020);
        Vehicle autonuevo17 = new Vehicle("bgt777", true, 2014);
        Vehicle autonuevo18 = new Vehicle("nhy888", false, 2018);
        Vehicle autonuevo19 = new Vehicle("mju999", true, 2013);
        Vehicle autonuevo20 = new Vehicle("ikl000", false, 2021);

// Asociar modelos (model2 a model10 en bucle)
        autonuevo11.addModel(model2);
        autonuevo12.addModel(model3);
        autonuevo13.addModel(model4);
        autonuevo14.addModel(model5);
        autonuevo15.addModel(model6);
        autonuevo16.addModel(model7);
        autonuevo17.addModel(model8);
        autonuevo18.addModel(model9);
        autonuevo19.addModel(model10);
        autonuevo20.addModel(model2); // vuelve a empezar

// Asociar branch1
        autonuevo11.addBranch(branch1);
        autonuevo12.addBranch(branch1);
        autonuevo13.addBranch(branch1);
        autonuevo14.addBranch(branch1);
        autonuevo15.addBranch(branch1);
        autonuevo16.addBranch(branch1);
        autonuevo17.addBranch(branch1);
        autonuevo18.addBranch(branch1);
        autonuevo19.addBranch(branch1);
        autonuevo20.addBranch(branch1);

// Guardar en el repositorio
        vehicleRepository.saveAll(List.of(
                autonuevo11, autonuevo12, autonuevo13, autonuevo14, autonuevo15,
                autonuevo16, autonuevo17, autonuevo18, autonuevo19, autonuevo20
        ));


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
        AppUser client2  = new AppUser("Lucía",   "González",   "37111222", "", "lucia.gonzalez@gmail.com",   passwordEncoder.encode("123456"), UserRol.CLIENT);
        AppUser client3  = new AppUser("Marcos",  "Pereyra",    "29877456", "", "marcos.pereyra@hotmail.com", passwordEncoder.encode("123456"), UserRol.CLIENT);
        AppUser client4  = new AppUser("Sofía",   "Quiroga",    "41002345", "", "sofia.quiroga@yahoo.com",    passwordEncoder.encode("123456"), UserRol.CLIENT);
        AppUser client5  = new AppUser("Bruno",   "Fernández",  "33219876", "", "bruno.fernandez@mail.com",   passwordEncoder.encode("123456"), UserRol.CLIENT);
        AppUser client6  = new AppUser("Valeria", "Sosa",       "38900112", "", "val.sosa@gmail.com",         passwordEncoder.encode("123456"), UserRol.CLIENT);
        AppUser client7  = new AppUser("Diego",   "Lopez",      "34566789", "", "d.lopez@gmail.com",          passwordEncoder.encode("123456"), UserRol.CLIENT);
        AppUser client8  = new AppUser("Carla",   "Ramírez",    "36055444", "", "carla.ramirez@outlook.com",  passwordEncoder.encode("123456"), UserRol.CLIENT);
        AppUser client9  = new AppUser("Julián",  "Torres",     "40338765", "", "julian.torres@mail.com",     passwordEncoder.encode("123456"), UserRol.CLIENT);
        AppUser client10 = new AppUser("Agustina","Méndez",     "32789012", "", "agus.mendez@gmail.com",      passwordEncoder.encode("123456"), UserRol.CLIENT);
        AppUser client11 = new AppUser("Leandro", "Rivas",      "39122458", "", "leandro.rivas@hotmail.com",  passwordEncoder.encode("123456"), UserRol.CLIENT);

        Reservation reservation1 = new Reservation("ABCDEF", LocalDate.of(2025, 6, 3), LocalDate.of(2025, 6, 25), 20000.0);
        reservation1.addClient(client2);
        reservation1.addModel(model1);
        reservation1.addBranch(branch1);
        reservation1.addVehicle(autonuevo1);

        Reservation reservation2 = new Reservation("AAAAAA", LocalDate.now(), LocalDate.of(2025, 7, 25), 20000.0);
        reservation2.addClient(client2);
        reservation2.addModel(model1);
        reservation2.addBranch(branch1);

        Reservation reservation3 = new Reservation("BBBBBB", LocalDate.of(2025, 7, 1), LocalDate.of(2025, 7, 25), 45000.0);
        reservation3.addClient(client2);
        reservation3.addModel(model4);
        reservation3.addBranch(branch2);
        reservation3.setVehicle(autonuevo4);


        Reservation reservation4 = new Reservation("ZZZZZZ", LocalDate.now(), LocalDate.of(2025, 7, 25), 45000.0);
        reservation4.addClient(client2);
        reservation4.addModel(model5);
        reservation4.addBranch(branch2);
        reservation4.addBranch(branch3);


        Reservation reservation6  = new Reservation("RES006", LocalDate.of(2025, 6,  6), LocalDate.of(2025, 6, 10), 15000.0);
        reservation6.addValoration(new Valoration(4, "Buena atención en la sucursal y el auto estaba limpio y en buen estado."));

        Reservation reservation7  = new Reservation("RES007", LocalDate.of(2025, 6,  8), LocalDate.of(2025, 6, 12), 18000.0);
        reservation7.addValoration(new Valoration(5, "Excelente atención, el proceso fue rápido y el auto era prácticamente nuevo."));

        Reservation reservation8  = new Reservation("RES008", LocalDate.of(2025, 6, 10), LocalDate.of(2025, 6, 14), 17000.0);
        reservation8.addValoration(new Valoration(3, "Todo estuvo bien, aunque el auto presentaba algunos rayones en la carrocería."));

        Reservation reservation9  = new Reservation("RES009", LocalDate.of(2025, 6, 12), LocalDate.of(2025, 6, 18), 22000.0);
        reservation9.addValoration(new Valoration(2, "La entrega demoró más de 40 minutos y no ofrecieron ninguna compensación."));

        Reservation reservation10 = new Reservation("RES010", LocalDate.of(2025, 6, 14), LocalDate.of(2025, 6, 19), 19500.0);
        reservation10.addValoration(new Valoration(4, "Rápido y sin complicaciones. El vehículo cumplió con lo prometido y estaba limpio."));

        Reservation reservation11 = new Reservation("RES011", LocalDate.of(2025, 6, 16), LocalDate.of(2025, 6, 20), 16000.0);
        reservation11.addValoration(new Valoration(5, "Perfecto para un viaje corto. Auto cómodo y económico en combustible."));

        Reservation reservation12 = new Reservation("RES012", LocalDate.of(2025, 6, 18), LocalDate.of(2025, 6, 22), 21000.0);
        reservation12.addValoration(new Valoration(1, "El auto se apagó dos veces en plena ruta, lo que generó una experiencia muy negativa."));

        Reservation reservation13 = new Reservation("RES013", LocalDate.of(2025, 6, 20), LocalDate.of(2025, 6, 24), 20000.0);
        reservation13.addValoration(new Valoration(3, "El servicio fue regular, no explicaron bien los términos del contrato y faltó comunicación."));

        Reservation reservation14 = new Reservation("RES014", LocalDate.of(2025, 6, 22), LocalDate.of(2025, 6, 26), 18500.0);
        reservation14.addValoration(new Valoration(4, "Buena atención y entrega a tiempo. El auto funcionaba sin inconvenientes."));

        Reservation reservation15 = new Reservation("RES015", LocalDate.of(2025, 6, 24), LocalDate.of(2025, 6, 28), 17500.0);
        reservation15.addValoration(new Valoration(5, "Muy recomendable, personal amable y auto en excelente estado."));

        Reservation reservation16 = new Reservation("RES016", LocalDate.of(2025, 6, 26), LocalDate.of(2025, 6, 30), 16000.0);
        reservation16.addValoration(new Valoration(2, "El tanque no estaba lleno al momento de la entrega, lo cual fue decepcionante."));

        Reservation reservation17 = new Reservation("RES017", LocalDate.of(2025, 6, 28), LocalDate.of(2025, 7,  2), 19000.0);
        reservation17.addValoration(new Valoration(3, "Aceptable, pero la limpieza del vehículo podría mejorar para futuras reservas."));

        Reservation reservation18 = new Reservation("RES018", LocalDate.of(2025, 6, 30), LocalDate.of(2025, 7,  4), 22000.0);
        reservation18.addValoration(new Valoration(4, "Auto nuevo y con excelente rendimiento. Muy buena experiencia general."));

        Reservation reservation19 = new Reservation("RES019", LocalDate.of(2025, 7,  1), LocalDate.of(2025, 7,  5), 17000.0);
        reservation19.addValoration(new Valoration(1, "Problemas con la reserva, la confirmación tardó demasiado y casi pierdo el viaje."));

        Reservation reservation20 = new Reservation("RES020", LocalDate.of(2025, 7,  2), LocalDate.of(2025, 7,  6), 16500.0);
        reservation20.addValoration(new Valoration(5, "Impecable todo, desde la atención hasta el vehículo entregado."));

        Reservation reservation21 = new Reservation("RES021", LocalDate.of(2025, 7,  3), LocalDate.of(2025, 7,  7), 19000.0);
        reservation21.addValoration(new Valoration(4, "Servicio correcto, sin mayores inconvenientes y buena comunicación."));

        Reservation reservation22 = new Reservation("RES022", LocalDate.of(2025, 7,  4), LocalDate.of(2025, 7,  8), 18000.0);
        reservation22.addValoration(new Valoration(3, "Satisfactorio, pero el vehículo no estaba tan limpio como esperaba."));

        Reservation reservation23 = new Reservation("RES023", LocalDate.of(2025, 7,  5), LocalDate.of(2025, 7,  9), 18500.0);
        reservation23.addValoration(new Valoration(5, "Todo salió perfecto, el auto y el servicio superaron mis expectativas."));

        Reservation reservation24 = new Reservation("RES024", LocalDate.of(2025, 7,  6), LocalDate.of(2025, 7, 10), 20000.0);
        reservation24.addValoration(new Valoration(4, "Buena atención y rápida gestión al momento de retirar el auto."));

        Reservation reservation25 = new Reservation("RES025", LocalDate.of(2025, 7,  7), LocalDate.now(), 19500.0);
        reservation25.addValoration(new Valoration(2, "El auto presentaba algunos detalles estéticos que no me gustaron."));

        Reservation reservation26 = new Reservation("RES026", LocalDate.of(2025, 7,  8), LocalDate.of(2025, 7, 12), 21000.0);
        reservation26.addValoration(new Valoration(3, "Bien en general, aunque podrían mejorar el proceso de entrega."));

        Reservation reservation27 = new Reservation("RES027", LocalDate.of(2025, 7,  9), LocalDate.of(2025, 7, 13), 20000.0);
        reservation27.addValoration(new Valoration(5, "Servicio rápido y eficiente, auto en excelente estado."));

        Reservation reservation28 = new Reservation("RES028", LocalDate.of(2025, 7, 10), LocalDate.of(2025, 7, 14), 17500.0);
        reservation28.addValoration(new Valoration(4, "Buena experiencia, personal amable y vehículo cómodo."));

        Reservation reservation29 = new Reservation("RES029", LocalDate.of(2025, 7, 11), LocalDate.of(2025, 7, 15), 16500.0);
        reservation29.addValoration(new Valoration(1, "No fue lo que esperaba, el vehículo tenía fallas menores que afectaron el viaje."));

        Reservation reservation30 = new Reservation("RES030", LocalDate.of(2025, 7, 12), LocalDate.of(2025, 7, 16), 19000.0);
        reservation30.addValoration(new Valoration(5, "Todo excelente, sin contratiempos y con buena atención al cliente."));

        Reservation reservation31 = new Reservation("RES031", LocalDate.of(2025, 7, 13), LocalDate.of(2025, 7, 17), 18000.0);
        reservation31.addValoration(new Valoration(2, "El auto tenía problemas mecánicos que fueron molestos durante el viaje."));

        Reservation reservation32 = new Reservation("RES032", LocalDate.of(2025, 7, 14), LocalDate.of(2025, 7, 18), 17500.0);
        reservation32.addValoration(new Valoration(3, "Aceptable, aunque esperaba mejor mantenimiento del vehículo."));

        Reservation reservation33 = new Reservation("RES033", LocalDate.of(2025, 7, 15), LocalDate.of(2025, 7, 19), 20000.0);
        reservation33.addValoration(new Valoration(4, "Muy bien en general, auto cómodo y buen servicio."));

        Reservation reservation34 = new Reservation("RES034", LocalDate.of(2025, 7, 16), LocalDate.of(2025, 7, 20), 18500.0);
        reservation34.addValoration(new Valoration(5, "Todo impecable, desde la reserva hasta la devolución."));

        Reservation reservation35 = new Reservation("RES035", LocalDate.of(2025, 7, 17), LocalDate.of(2025, 7, 21), 17000.0);
        reservation35.addValoration(new Valoration(4, "Buena atención y servicio durante todo el proceso."));

        Reservation reservation36 = new Reservation("RES036", LocalDate.of(2025, 7, 18), LocalDate.of(2025, 7, 22), 18500.0);
        reservation36.addValoration(new Valoration(5, "El mejor alquiler que hice hasta ahora. Auto nuevo, atención excelente."));

        Reservation reservation37 = new Reservation("RES037", LocalDate.of(2025, 7, 19), LocalDate.of(2025, 7, 23), 19000.0);
        reservation37.addValoration(new Valoration(4, "Todo bien salvo que no tenía GPS como se prometía."));

        Reservation reservation38 = new Reservation("RES038", LocalDate.of(2025, 7, 20), LocalDate.of(2025, 7, 24), 17000.0);
        reservation38.addValoration(new Valoration(3, "Entrega rápida pero el aire acondicionado no funcionaba correctamente."));

        Reservation reservation39 = new Reservation("RES039", LocalDate.of(2025, 7, 21), LocalDate.of(2025, 7, 25), 20000.0);
        reservation39.addValoration(new Valoration(5, "Excelente trato, el auto estaba limpio, cómodo y rendidor."));

        Reservation reservation40 = new Reservation("RES040", LocalDate.of(2025, 7, 22), LocalDate.of(2025, 7, 26), 16000.0);
        reservation40.addValoration(new Valoration(2, "El personal fue amable, pero el vehículo tenía mal olor y estaba sucio."));

        Reservation reservation41 = new Reservation("RES041", LocalDate.of(2025, 7, 23), LocalDate.of(2025, 7, 27), 17500.0);
        reservation41.addValoration(new Valoration(3, "El auto cumplió su función, pero esperaba más por ese precio."));

        Reservation reservation42 = new Reservation("RES042", LocalDate.of(2025, 7, 24), LocalDate.of(2025, 7, 28), 18500.0);
        reservation42.addValoration(new Valoration(4, "Muy buena experiencia. Solo demoraron en devolver el depósito."));

        Reservation reservation43 = new Reservation("RES043", LocalDate.of(2025, 7, 25), LocalDate.of(2025, 7, 29), 20000.0);
        reservation43.addValoration(new Valoration(5, "Auto nuevo, con pocos kilómetros y excelente consumo."));

        Reservation reservation44 = new Reservation("RES044", LocalDate.of(2025, 7, 26), LocalDate.of(2025, 7, 30), 19000.0);
        reservation44.addValoration(new Valoration(1, "El auto se quedó sin frenos. Un peligro."));

        Reservation reservation45 = new Reservation("RES045", LocalDate.of(2025, 7, 27), LocalDate.of(2025, 7, 31), 17000.0);
        reservation45.addValoration(new Valoration(4, "Buena experiencia general. Me ofrecieron extender el tiempo sin cargo."));

        Reservation reservation46 = new Reservation("RES046", LocalDate.of(2025, 7, 28), LocalDate.of(2025, 8,  1), 16000.0);
        reservation46.addValoration(new Valoration(2, "El auto tenía un ruido extraño al frenar."));

        Reservation reservation47 = new Reservation("RES047", LocalDate.of(2025, 7, 29), LocalDate.of(2025, 8,  2), 21000.0);
        reservation47.addValoration(new Valoration(5, "Muy fácil de reservar, buena atención al cliente y coche de calidad."));

        Reservation reservation48 = new Reservation("RES048", LocalDate.of(2025, 7, 30), LocalDate.of(2025, 8,  3), 16500.0);
        reservation48.addValoration(new Valoration(3, "Auto justo, no es como el de las fotos."));

        Reservation reservation49 = new Reservation("RES049", LocalDate.of(2025, 7, 31), LocalDate.of(2025, 8,  4), 18000.0);
        reservation49.addValoration(new Valoration(4, "Todo bien, pero tardaron en confirmar la reserva."));

        Reservation reservation50 = new Reservation("RES050", LocalDate.of(2025, 8,  1), LocalDate.of(2025, 8,  5), 17500.0);
        reservation50.addValoration(new Valoration(5, "Perfecto, lo voy a volver a usar sin dudas."));

        Reservation reservation51 = new Reservation("RES051", LocalDate.of(2025, 8,  2), LocalDate.of(2025, 8,  6), 19000.0);
        reservation51.addValoration(new Valoration(1, "Se rompió la cerradura y me quedé afuera del coche."));

        Reservation reservation52 = new Reservation("RES052", LocalDate.of(2025, 8,  3), LocalDate.of(2025, 8,  7), 18500.0);
        reservation52.addValoration(new Valoration(2, "Podrían haber limpiado mejor el interior."));

        Reservation reservation53 = new Reservation("RES053", LocalDate.of(2025, 8,  4), LocalDate.of(2025, 8,  8), 18000.0);
        reservation53.addValoration(new Valoration(4, "Muy buen consumo de combustible. Ideal para viajes largos."));

        Reservation reservation54 = new Reservation("RES054", LocalDate.of(2025, 8,  5), LocalDate.of(2025, 8,  9), 20000.0);
        reservation54.addValoration(new Valoration(5, "El mejor precio y la mejor calidad. Muy conforme."));

        Reservation reservation55 = new Reservation("RES055", LocalDate.of(2025, 8,  6), LocalDate.now(), 19500.0);
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
        reservation6.addBranch(branch2);
        reservation7.addBranch(branch2);
        reservation8.addBranch(branch2);
        reservation9.addBranch(branch2);
        reservation10.addBranch(branch2);
        reservation11.addBranch(branch2);
        reservation12.addBranch(branch2);
        reservation13.addBranch(branch2);
        reservation14.addBranch(branch2);
        reservation15.addBranch(branch2);
        reservation16.addBranch(branch2);
        reservation17.addBranch(branch2);
        reservation18.addBranch(branch2);
        reservation19.addBranch(branch2);
        reservation20.addBranch(branch2);
        reservation21.addBranch(branch2);
        reservation22.addBranch(branch2);
        reservation23.addBranch(branch2);
        reservation24.addBranch(branch2);
        reservation25.addBranch(branch2);
        reservation26.addBranch(branch2);
        reservation27.addBranch(branch2);
        reservation28.addBranch(branch2);
        reservation29.addBranch(branch2);
        reservation30.addBranch(branch2);

        reservation31.addBranch(branch3);
        reservation32.addBranch(branch3);
        reservation33.addBranch(branch3);
        reservation34.addBranch(branch3);
        reservation35.addBranch(branch3);
        reservation36.addBranch(branch3);
        reservation37.addBranch(branch3);
        reservation38.addBranch(branch3);
        reservation39.addBranch(branch3);
        reservation40.addBranch(branch3);
        reservation41.addBranch(branch3);
        reservation42.addBranch(branch3);
        reservation43.addBranch(branch3);
        reservation44.addBranch(branch3);
        reservation45.addBranch(branch3);
        reservation46.addBranch(branch3);
        reservation47.addBranch(branch3);
        reservation48.addBranch(branch3);
        reservation49.addBranch(branch3);
        reservation50.addBranch(branch3);
        reservation51.addBranch(branch3);
        reservation52.addBranch(branch3);
        reservation53.addBranch(branch3);
        reservation54.addBranch(branch3);
        reservation55.addBranch(branch3);


        reservation6.addClient(client2);
        reservation7.addClient(client2);
        reservation8.addClient(client3);
        reservation9.addClient(client4);
        reservation10.addClient(client5);
        reservation11.addClient(client6);
        reservation12.addClient(client7);
        reservation13.addClient(client8);
        reservation14.addClient(client9);
        reservation15.addClient(client10);
        reservation16.addClient(client11);

        reservation17.addClient(client2);
        reservation18.addClient(client2);
        reservation19.addClient(client3);
        reservation20.addClient(client4);
        reservation21.addClient(client5);
        reservation22.addClient(client6);
        reservation23.addClient(client7);
        reservation24.addClient(client8);
        reservation25.addClient(client9);
        reservation26.addClient(client10);
        reservation27.addClient(client11);
        Reservation reservation5 = new Reservation("XXXXXX", LocalDate.of(2025, 6, 3), LocalDate.of(2025, 7, 25), 20000.0);
        reservation5.addClient(client2);
        reservation5.addModel(model1);
        reservation5.addBranch(branch1);
        reservation5.setVehicle(autonuevo1);


        reservation28.addClient(client2);
        reservation29.addClient(client2);
        reservation30.addClient(client3);
        reservation31.addClient(client4);
        reservation32.addClient(client5);
        reservation33.addClient(client6);
        reservation34.addClient(client7);
        reservation35.addClient(client8);
        reservation36.addClient(client9);
        reservation37.addClient(client10);
        reservation38.addClient(client11);

        reservation39.addClient(client2);
        reservation40.addClient(client2);
        reservation41.addClient(client3);
        reservation42.addClient(client4);
        reservation43.addClient(client5);
        reservation44.addClient(client6);
        reservation45.addClient(client7);
        reservation46.addClient(client8);
        reservation47.addClient(client9);
        reservation48.addClient(client10);
        reservation49.addClient(client11);

        reservation50.addClient(client2);
        reservation51.addClient(client2);
        reservation52.addClient(client3);
        reservation53.addClient(client4);
        reservation54.addClient(client5);
        reservation55.addClient(client6);

        reservation25.addVehicle(autonuevo5);

        // --- Asignar sucursal a TODAS las reservas ---
        reservation6.addBranch(branch2);
        reservation7.addBranch(branch2);
        reservation8.addBranch(branch2);
        reservation9.addBranch(branch2);
        reservation10.addBranch(branch2);
        reservation11.addBranch(branch2);
        reservation12.addBranch(branch2);
        reservation13.addBranch(branch2);
        reservation14.addBranch(branch2);
        reservation15.addBranch(branch2);
        reservation16.addBranch(branch2);
        reservation17.addBranch(branch2);
        reservation18.addBranch(branch2);
        reservation19.addBranch(branch2);
        reservation20.addBranch(branch2);
        reservation21.addBranch(branch2);
        reservation22.addBranch(branch2);
        reservation23.addBranch(branch2);
        reservation24.addBranch(branch2);
        reservation25.addBranch(branch2);
        reservation26.addBranch(branch2);
        reservation27.addBranch(branch2);
        reservation28.addBranch(branch2);
        reservation29.addBranch(branch2);
        reservation30.addBranch(branch2);
        reservation31.addBranch(branch2);
        reservation32.addBranch(branch2);
        reservation33.addBranch(branch2);
        reservation34.addBranch(branch2);
        reservation35.addBranch(branch2);
        reservation36.addBranch(branch2);
        reservation37.addBranch(branch2);
        reservation38.addBranch(branch2);
        reservation39.addBranch(branch2);
        reservation40.addBranch(branch2);
        reservation41.addBranch(branch2);
        reservation42.addBranch(branch2);
        reservation43.addBranch(branch2);
        reservation44.addBranch(branch2);
        reservation45.addBranch(branch2);
        reservation46.addBranch(branch2);
        reservation47.addBranch(branch2);
        reservation48.addBranch(branch2);
        reservation49.addBranch(branch2);
        reservation50.addBranch(branch2);
        reservation51.addBranch(branch2);
        reservation52.addBranch(branch2);
        reservation53.addBranch(branch2);
        reservation54.addBranch(branch2);
        reservation55.addBranch(branch2);

        //appUsers
        userRepository.save(new AppUser("Maria","Ceccato","00000000","","mariaceccato@gmail.com", passwordEncoder.encode("123456"), UserRol.ADMIN));
        userRepository.save(client1);
        AppUser empleadoM = new AppUser("Martin","Esquercia","11111111","","martincito@gmail.com", passwordEncoder.encode("123456"), UserRol.EMPLOYEE);
        empleadoM.setBranch(branch1);
        userRepository.save(empleadoM);
        AppUser empleado2 = new AppUser("Augusto","Esquercia","11111112","","augusto@gmail.com", passwordEncoder.encode("123456"), UserRol.EMPLOYEE);
        empleado2.setBranch(branch3);
        userRepository.save(empleado2);
        userRepository.save(new AppUser("Emiliano","Sar","000020003","","emilianoross649@gmail.com", passwordEncoder.encode("123456"), UserRol.CLIENT));

        userRepository.saveAll(List.of(client2,client3,client4,client5,client6,client7,client8,client9,client10,client11));
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
        Additional adicional2 = new Additional("Seguro",6000.0);
        Additional adicional1 = new Additional("Silla de bebe",2000.0);
        additionalRepository.save(adicional1);
        additionalRepository.save(adicional2);
        cardRepository.saveAll(Arrays.asList(new Card("1234123412341234","123","FERNANDO MARZIALETTI"),new Card("4567456745674567","456","AGUSTIN SARGIOTTI")));// Tarjeta Optima, Tarjeta sin saldo, Tarjeta sin conexion.


        //HU: REGISTRAR DEVOLUCION

        //Reserva sin vehiculo asignado ("SINVEH")
        Reservation reservaSinVehiculoAsignado = new Reservation("SINVEH", LocalDate.now().plusDays(5), LocalDate.now().plusDays(10), 20000.0);
        reservaSinVehiculoAsignado.addClient(client3);
        reservaSinVehiculoAsignado.addModel(model1);
        reservaSinVehiculoAsignado.addBranch(branch1);
        reservationRepository.save(reservaSinVehiculoAsignado);

        //Reserva con fecha de entrega hoy ("RESHOY")
        Reservation reservaFechaEntregaHoy = new Reservation("RESHOY", LocalDate.now().minusDays(20), LocalDate.now(), 20000.0);
        reservaFechaEntregaHoy.addClient(client3);
        reservaFechaEntregaHoy.addModel(model8);
        reservaFechaEntregaHoy.addBranch(branch1);
        reservaFechaEntregaHoy.addVehicle(autonuevo8);
        reservationRepository.save(reservaFechaEntregaHoy);

        //Reserva con fecha de entrega futura ("FUTURA")
        Reservation reservaFechaEntregaFutura = new Reservation("FUTURA", LocalDate.now().minusDays(5), LocalDate.now().plusDays(5), 20000.0);
        reservaFechaEntregaFutura.addClient(client3);
        reservaFechaEntregaFutura.addModel(model7);
        reservaFechaEntregaFutura.addBranch(branch1);
        reservaFechaEntregaFutura.addVehicle(autonuevo7);
        reservationRepository.save(reservaFechaEntregaFutura);

        //Reserva con devolucion registrada ("YAREGI")
        Reservation reservaYaRegistrada = new Reservation("YAREGI", LocalDate.now().minusDays(5), LocalDate.now().minusDays(1), 20000.0);
        reservaYaRegistrada.addClient(client3);
        reservaYaRegistrada.addModel(model7);
        reservaYaRegistrada.addBranch(branch1);
        reservaYaRegistrada.addVehicle(autonuevo7);
        EmployeeComment comment = new EmployeeComment(empleadoM, "Devolucion ya registrada");
        reservaYaRegistrada.addEmployeeComment(comment);
        empleadoM.addEmployeeComment(comment);
        reservationRepository.save(reservaYaRegistrada);

        //HU CANCELAR Y VALORAR

        //Reserva a Valorar
        Reservation reservaAValorar = new Reservation("AVALOR", LocalDate.now().minusDays(5), LocalDate.now().minusDays(1), 20000.0);
        reservaAValorar.addClient(client1);
        reservaAValorar.addBranch(branch1);
        reservaAValorar.addModel(model1);
        reservaAValorar.addVehicle(autonuevo1);
        EmployeeComment comment2 = new EmployeeComment(empleadoM, "Devolucion ya registrada");
        reservaAValorar.addEmployeeComment(comment2);
        reservationRepository.save(reservaAValorar);

        //Reserva a Cancelar
        Reservation reservaACancelar = new Reservation("CANCEL", LocalDate.now().plusDays(5), LocalDate.now().plusDays(10), 20000.0);
        reservaACancelar.addClient(client1);
        reservaACancelar.addBranch(branch1);
        reservaACancelar.addModel(model1);
        reservationRepository.save(reservaACancelar);

        // Reserva en curso para client2
        Reservation reservaEnCurso = new Reservation("ENCUR2", LocalDate.now().minusDays(2), LocalDate.now().plusDays(3), 18000.0);
        reservaEnCurso.addClient(client2);
        reservaEnCurso.addModel(model1);
        reservaEnCurso.addBranch(branch1);
        reservaEnCurso.addVehicle(autonuevo2);
        reservationRepository.save(reservaEnCurso);

// Reserva futura para client3
        Reservation reservaFuturaC3 = new Reservation("FUTC31", LocalDate.now().plusDays(10), LocalDate.now().plusDays(15), 25000.0);
        reservaFuturaC3.addClient(client3);
        reservaFuturaC3.addModel(model1);
        reservaFuturaC3.addBranch(branch1);
        reservationRepository.save(reservaFuturaC3);

// Reserva sin vehículo para client4
        Reservation reservaSinVehC4 = new Reservation("SINVE8", LocalDate.now().plusDays(4), LocalDate.now().plusDays(8), 19000.0);
        reservaSinVehC4.addClient(client4);
        reservaSinVehC4.addModel(model1);
        reservaSinVehC4.addBranch(branch1);
        reservationRepository.save(reservaSinVehC4);

// Reserva entregada hoy para client5
        Reservation reservaHoyC5 = new Reservation("HOYC52", LocalDate.now().minusDays(5), LocalDate.now(), 17000.0);
        reservaHoyC5.addClient(client5);
        reservaHoyC5.addModel(model1);
        reservaHoyC5.addBranch(branch1);
        reservaHoyC5.addVehicle(autonuevo3);
        reservationRepository.save(reservaHoyC5);

// Reserva finalizada sin devolución registrada (para probar botón de valorar sin devolución)
        Reservation reservaFinalSinDev = new Reservation("FINALS", LocalDate.now().minusDays(10), LocalDate.now().minusDays(3), 23000.0);
        reservaFinalSinDev.addClient(client2);
        reservaFinalSinDev.addModel(model1);
        reservaFinalSinDev.addBranch(branch1);
        reservaFinalSinDev.addVehicle(autonuevo4);
        reservationRepository.save(reservaFinalSinDev);

// Reserva finalizada con devolución registrada
        Reservation reservaFinalConDev = new Reservation("CONDEV", LocalDate.now().minusDays(7), LocalDate.now().minusDays(1), 22000.0);
        reservaFinalConDev.addClient(client4);
        reservaFinalConDev.addModel(model1);
        reservaFinalConDev.addBranch(branch1);
        reservaFinalConDev.addVehicle(autonuevo5);
        EmployeeComment commentFinalDev = new EmployeeComment(empleadoM, "Todo en orden en la devolución.");
        reservaFinalConDev.addEmployeeComment(commentFinalDev);
        empleadoM.addEmployeeComment(commentFinalDev);
        reservationRepository.save(reservaFinalConDev);

// Reserva cancelada por anticipado
        Reservation reservaCancelada = new Reservation("CANCEL5", LocalDate.now().plusDays(6), LocalDate.now().plusDays(9), 21000.0);
        reservaCancelada.addClient(client5);
        reservaCancelada.addModel(model1);
        reservaCancelada.addBranch(branch1);
        reservaCancelada.setCancelled(true);
        reservationRepository.save(reservaCancelada);

        // Reserva que empieza hoy (CLIENT2)
        Reservation reservaInicioHoy1 = new Reservation("INIHOY", LocalDate.now(), LocalDate.now().plusDays(3), 18000.0);
        reservaInicioHoy1.addClient(client2);
        reservaInicioHoy1.addModel(model1);
        reservaInicioHoy1.addBranch(branch1);
        reservationRepository.save(reservaInicioHoy1);

// Reserva que termina hoy (CLIENT3)
        Reservation reservaFinHoy1 = new Reservation("INHOY5", LocalDate.now().minusDays(7), LocalDate.now(), 22000.0);
        reservaFinHoy1.addClient(client3);
        reservaFinHoy1.addModel(model1);
        reservaFinHoy1.addBranch(branch1);
        reservationRepository.save(reservaFinHoy1);

// Reserva de 1 día hoy (CLIENT4)
        Reservation reservaSoloHoy = new Reservation("SOLHOY", LocalDate.now(), LocalDate.now(), 10000.0);
        reservaSoloHoy.addClient(client4);
        reservaSoloHoy.addModel(model1);
        reservaSoloHoy.addBranch(branch1);
        reservationRepository.save(reservaSoloHoy);

// Reserva empieza hoy y dura 5 días (CLIENT5)
        Reservation reservaInicioHoy2 = new Reservation("INIHO2", LocalDate.now(), LocalDate.now().plusDays(5), 25000.0);
        reservaInicioHoy2.addClient(client5);
        reservaInicioHoy2.addModel(model1);
        reservaInicioHoy2.addBranch(branch1);
        reservationRepository.save(reservaInicioHoy2);

// Reserva termina hoy y empezó hace 10 días (CLIENT2)
        Reservation reservaFinHoy2 = new Reservation("FIHOY2", LocalDate.now().minusDays(10), LocalDate.now(), 27000.0);
        reservaFinHoy2.addClient(client2);
        reservaFinHoy2.addModel(model1);
        reservaFinHoy2.addBranch(branch1);
        reservationRepository.save(reservaFinHoy2);

// Reserva larga que termina hoy (CLIENT3)
        Reservation reservaFinHoy3 = new Reservation("FNHOY3", LocalDate.now().minusDays(30), LocalDate.now(), 50000.0);
        reservaFinHoy3.addClient(client3);
        reservaFinHoy3.addModel(model1);
        reservaFinHoy3.addBranch(branch1);
        reservationRepository.save(reservaFinHoy3);

// Reserva futura que empieza hoy (CLIENT4)
        Reservation reservaInicioHoy3 = new Reservation("I5HOY3", LocalDate.now(), LocalDate.now().plusDays(7), 21000.0);
        reservaInicioHoy3.addClient(client4);
        reservaInicioHoy3.addModel(model1);
        reservaInicioHoy3.addBranch(branch1);
        reservationRepository.save(reservaInicioHoy3);

// Reserva empieza hoy y termina mañana (CLIENT5)
        Reservation reservaInicioHoy4 = new Reservation("INIHOR", LocalDate.now(), LocalDate.now().plusDays(1), 12000.0);
        reservaInicioHoy4.addClient(client5);
        reservaInicioHoy4.addModel(model1);
        reservaInicioHoy4.addBranch(branch1);
        reservationRepository.save(reservaInicioHoy4);

// Reserva con devolución hoy registrada (CLIENT2)
        Reservation reservaDevolucionHoy = new Reservation("REGHOP", LocalDate.now().minusDays(4), LocalDate.now(), 19000.0);
        reservaDevolucionHoy.addClient(client2);
        reservaDevolucionHoy.addModel(model1);
        reservaDevolucionHoy.addBranch(branch1);
        reservaDevolucionHoy.addVehicle(autonuevo1);
        EmployeeComment devolucionHoy = new EmployeeComment(empleadoM, "Devolución realizada hoy");
        reservaDevolucionHoy.addEmployeeComment(devolucionHoy);
        reservationRepository.save(reservaDevolucionHoy);

// Reserva inicia hoy sin vehículo (CLIENT3)
        Reservation reservaInicioHoySinVehiculo = new Reservation("SIRTTT", LocalDate.now(), LocalDate.now().plusDays(4), 15000.0);
        reservaInicioHoySinVehiculo.addClient(client3);
        reservaInicioHoySinVehiculo.addModel(model1);
        reservaInicioHoySinVehiculo.addBranch(branch1);
        reservationRepository.save(reservaInicioHoySinVehiculo);

    }
}
