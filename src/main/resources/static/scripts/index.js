
document.getElementById('formularioBuscarVehiculo').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita el envío normal

    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const sucursal = document.getElementById('sucursal').value;

    // Redirección con parámetros
    window.location.href = `./pages/vehiculos.html?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}&sucursal=${encodeURIComponent(sucursal)}`;
});
