const desdeInput = document.getElementById('precio-desde');
const hastaInput = document.getElementById('precio-hasta');
const botonAplicar = document.getElementById('aplicar-precio');

function checkInputs() {
  // Habilita el botón si alguno de los dos tiene valor no vacío
  if (desdeInput.value.trim() !== "" || hastaInput.value.trim() !== "") {
    botonAplicar.disabled = false;
  } else {
    botonAplicar.disabled = true;
  }
}

// Escuchar cambios en ambos inputs
desdeInput.addEventListener('input', checkInputs);
hastaInput.addEventListener('input', checkInputs);

// Función para obtener parámetros de URL
  function getParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Obtener valores de la URL
  const fechaInicio = getParam('fechaInicio');
  const fechaFin = getParam('fechaFin');
  const sucursal = getParam('sucursal');

  const contenedorFiltros = document.getElementById('filtros-fecha-sucursal');

  // Crear y agregar elementos solo si existen los valores
  if (fechaInicio) {
    const spanInicio = document.createElement('span');
     spanInicio.className = 'filtro-resumen';
    spanInicio.textContent = `Inicio: ${fechaInicio}`;
    contenedorFiltros.appendChild(spanInicio);
  }

  if (fechaFin) {
    const spanFin = document.createElement('span');
    spanFin.className = 'filtro-resumen';
    spanFin.textContent = `Fin: ${fechaFin}`;
    contenedorFiltros.appendChild(spanFin);
  }

  if (sucursal) {
    const spanSucursal = document.createElement('span');
    spanSucursal.className = 'filtro-resumen';
    spanSucursal.textContent = `Sucursal: ${sucursal}`;
    contenedorFiltros.appendChild(spanSucursal);
  }