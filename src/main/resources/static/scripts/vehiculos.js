const desdeInput = document.getElementById('precio-desde');
const hastaInput = document.getElementById('precio-hasta');
const botonAplicar = document.getElementById('aplicar-precio');

function checkInputs() {
  if (desdeInput.value.trim() !== "" || hastaInput.value.trim() !== "") {
    botonAplicar.disabled = false;
  } else {
    botonAplicar.disabled = true;
  }
}

desdeInput.addEventListener('input', checkInputs);
hastaInput.addEventListener('input', checkInputs);

function getParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const fechaInicio = getParam('fechaInicio');
const fechaFin = getParam('fechaFin');
const sucursal = getParam('sucursal');

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
      vehiculosConFiltroPrecio: [],
      isAuthenticated: false,
      user: { name: "Cuenta" },
      marcas: [],
      modelos: [],
      capacidades: [],
      filtroMarca: null,
      filtroModelo: null,
      filtroCapacidad: null,
      precioDesde: null,
      precioHasta: null,
      filtroSeleccionado: "Todos los disponibles",
      ordenSeleccionado: "marca-asc"
    };
  },
  mounted() {
    this.checkAuth();
    this.getBranchById(this.branchId);
    this.getAvailableModels();
  },
  watch: {
    ordenSeleccionado(nuevoOrden) {
      this.ordenarVehiculos(nuevoOrden);
    }
  },
  methods: {
    formatPriceArg(value) {
      return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
    },
    ordenarVehiculos(criterio) {

      this.vehiculosConFiltroPrecio.sort((a, b) => {
        switch (criterio) {
          case "precio-asc":
            console.log(this.models)
            return a.finalPrice - b.finalPrice;
          case "precio-desc":
            return b.finalPrice - a.finalPrice;
          case "marca-asc":
            return a.brand.localeCompare(b.brand);
          case "marca-desc":
            return b.brand.localeCompare(a.brand);
          case "modelo-asc":
            return a.name.localeCompare(b.name);
          case "modelo-desc":
            return b.name.localeCompare(a.name);
          case "capacidad-asc":

            return a.capacity - b.capacity;
          case "capacidad-desc":

            return b.capacity - a.capacity;
          default:
            return 0;
        }
      });
    },
    resetearFiltros() {
      this.filtroMarca = null;
      this.filtroModelo = null;
      this.filtroCapacidad = null;
      this.precioDesde = null;
      this.precioHasta = null;
      this.vehiculosConFiltroPrecio = this.models;
      this.filtroSeleccionado = "Todos los disponibles";
    },
    seleccionarMarca(valor) {
      // Reseteo todos los filtros menos el de marca
      this.filtroModelo = null;
      this.filtroCapacidad = null;
      this.precioDesde = null;
      this.precioHasta = null;

      this.filtroMarca = valor || null;
      this.filtroSeleccionado = "Marca " + valor + " disponibles";

      // Aplico filtro solo por marca sobre la lista completa
      this.vehiculosConFiltroPrecio = this.models.filter(v => v.brand === valor);
    },
    seleccionarModelo(valor) {
      this.filtroMarca = null;
      this.filtroCapacidad = null;
      this.precioDesde = null;
      this.precioHasta = null;

      this.filtroModelo = valor || null;
      this.filtroSeleccionado = "Modelo " + valor + " disponibles";

      this.vehiculosConFiltroPrecio = this.models.filter(v => v.name === valor);
    },
    seleccionarCapacidad(valor) {
      this.filtroMarca = null;
      this.filtroModelo = null;
      this.precioDesde = null;
      this.precioHasta = null;

      this.filtroCapacidad = valor ? Number(valor) : null;
      this.filtroSeleccionado = "Capacidad " + valor + " disponibles";

      this.vehiculosConFiltroPrecio = this.models.filter(v => v.capacity === this.filtroCapacidad);
    },
    aplicarFiltroPrecio() {
      this.filtroMarca = null;
      this.filtroModelo = null;
      this.filtroCapacidad = null;

      // Verificar también si los campos están vacíos
      const desde = (this.precioDesde !== null && this.precioDesde !== "") ? Number(this.precioDesde) : null;
      const hasta = (this.precioHasta !== null && this.precioHasta !== "") ? Number(this.precioHasta) : null;

      this.vehiculosConFiltroPrecio = this.models.filter(v => {
        const coincideDesde = desde === null || v.finalPrice >= desde;
        const coincideHasta = hasta === null || v.finalPrice <= hasta;
        return coincideDesde && coincideHasta;
      });

      // Construcción clara del string de filtro
      if (desde !== null && hasta !== null) {
        this.filtroSeleccionado = `Precio entre ${this.formatPriceArg(desde)} y ${this.formatPriceArg(hasta)} disponibles`;
      } else if (desde !== null) {
        this.filtroSeleccionado = `Precio desde ${this.formatPriceArg(desde)} disponibles`;
      } else if (hasta !== null) {
        this.filtroSeleccionado = `Precio hasta ${this.formatPriceArg(hasta)} disponibles`;
      } else {
        this.filtroSeleccionado = `Todos los precios disponibles`;
      }
    },
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

        const start = new Date(this.fechaInicio);
        const end = new Date(this.fechaFin);
        const timeDiff = end.getTime() - start.getTime();
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

        this.models = response.data.map(model => ({
          ...model,
          finalPrice: model.price * days
        }));

        this.vehiculosConFiltroPrecio = this.models;
        this.marcas = this.marcasUnicas();
        this.capacidades = this.capacidadesUnicas();
        this.modelos = this.modelosUnicos();
        this.ordenarVehiculos(this.ordenSeleccionado);
        console.log(this.models)
      } catch (error) {
        console.error("Error al obtener vehículos:", error);
      }
    },
    checkAuth() {
      axios.get("/api/user/isAuthenticated")
        .then(response => {
          this.isAuthenticated = response.data === true;
        })
        .then(() => axios.get("/api/user/data"))
        .then(res => {
          this.user = res.data;
        })
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
            window.location.href = "/index.html";
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
    },
    marcasUnicas() {
      const counts = {};
      this.models.forEach(modelo => {
        const marca = modelo.brand;
        counts[marca] = (counts[marca] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([valor, cantidad]) => ({ valor, cantidad }))
        .sort((a, b) => a.valor.localeCompare(b.valor));
    },
    modelosUnicos() {
      const counts = {};
      this.models.forEach(modelo => {
        const name = modelo.name;
        counts[name] = (counts[name] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([valor, cantidad]) => ({ valor, cantidad }))
        .sort((a, b) => a.valor.localeCompare(b.valor));
    },
    capacidadesUnicas() {
      const counts = {};
      this.models.forEach(modelo => {
        const cap = modelo.capacity;
        counts[cap] = (counts[cap] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([valor, cantidad]) => ({ valor: Number(valor), cantidad }))
        .sort((a, b) => a.valor - b.valor);
    }
  },
  computed: {
    vehiculosFiltrados() {
      // Devuelve el arreglo ya filtrado con un solo filtro activo, sin combinaciones
      return this.vehiculosConFiltroPrecio;
    },
    fechaInicioFormateada() {
      if (!this.fechaInicio) return null;
      const date = new Date(this.fechaInicio);
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')
        }/${date.getFullYear()}`;
    },
    fechaFinFormateada() {
      if (!this.fechaFin) return null;
      const date = new Date(this.fechaFin);
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')
        }/${date.getFullYear()}`;
    }
  }
}).mount('#app');