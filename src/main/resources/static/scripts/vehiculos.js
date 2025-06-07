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


const { createApp } = Vue;

createApp({
  data() {
    return {
      marca: "",
      modelo: "",
      branch: {},
      fechaInicio: getParam('fechaInicio'),
      fechaFin: getParam('fechaFin'),
      branchId: getParam('sucursal'),
      models: [],
      isAuthenticated: false,
      user: { name: "Cuenta" }
    };
  },
  mounted() {
    this.checkAuth();
    this.getBranchById(this.branchId);
    this.getAvailableModels();
  },
  methods: {
    async getBranchById(id) {
      try {
        const response = await axios.get(`/api/branches/${id}`);
        this.branch = response.data;
      } catch (error) {
        console.log(error);
        document.getElementById("errorMsg").innerHTML = error.response?.data || "Error desconocido";
      }
    },
    async getAvailableModels() {
      try {
        const response = await axios.get(`/api/model/availableModels`, {
          params: {
            startDate: this.fechaInicio,
            endDate: this.fechaFin,
            branchId: this.branchId,
          }
        });

        // Calcular cantidad de días (inclusive)
        const start = new Date(this.fechaInicio);
        const end = new Date(this.fechaFin);
        const timeDiff = end.getTime() - start.getTime();
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

        // Agregar el precio final a cada modelo
        this.models = response.data.map(model => ({
          ...model,
          finalPrice: model.price * days
        }));

        console.log(this.models);
      } catch (error) {
        console.error("Error al obtener vehículos:", error);
      }
    },
    checkAuth() {
      axios.get("/api/user/isAuthenticated")
        .then(response => {
          this.isAuthenticated = response.data === true;
        })
        .then(res => axios.get("/api/user/data")).then(
          res => {
            this.user = res.data;
          }
        )
        .catch(error => {
          console.error("Error al verificar autenticación:", error);
          this.isAuthenticated = false;
        });
    },
    logout() {
    axios.post("/logout")
        .then(() => {
            this.isAuthenticated = false;
            Swal.fire({
                icon: "success",
                title: "Sesión cerrada",
                text: "Has cerrado sesión correctamente. Hasta pronto!",
                confirmButtonText: "Aceptar"
            }).then(() => {
                window.location.href = "/index.html"; // o la página que corresponda
            });
        })
        .catch(error => {
            console.error("Error al cerrar sesión:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al cerrar sesión. Intentalo de nuevo.",
            });
        });
}
  }
}).mount('#app');