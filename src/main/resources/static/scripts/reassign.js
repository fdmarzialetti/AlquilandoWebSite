const { createApp } = Vue;

function getParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

createApp({
  data() {
    return {
      marca: "",
      modelo: "",
      branch: {},
      fechaInicio: getParam("startDate"),
      fechaFin: getParam("fechaFin"),
      branchId: getParam("branchId"),
      precioMinimo: Number(getParam("precioMinimo")),
      codigoReserva: getParam("codigoReserva"),
      models: [],
      vehiculosConFiltro: [],
      marcas: [],
      modelos: [],
      capacidades: [],
      filtroMarca: null,
      filtroModelo: null,
      filtroCapacidad: null,
      filtroSeleccionado: "Todos los disponibles",
      ordenSeleccionado: "marca-asc",
      precioDesde: null,
      precioHasta: null,
    };
  },
  mounted() {
    if (!this.fechaInicio || !this.fechaFin || !this.branchId || !this.precioMinimo || !this.codigoReserva) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Faltan parámetros en la URL. No se puede continuar.",
      });
      return;
    }

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
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(value);
    },
    ordenarVehiculos(criterio) {
      this.vehiculosConFiltro.sort((a, b) => {
        switch (criterio) {
          case "precio-asc": return a.finalPrice - b.finalPrice;
          case "precio-desc": return b.finalPrice - a.finalPrice;
          case "marca-asc": return a.brand.localeCompare(b.brand);
          case "marca-desc": return b.brand.localeCompare(a.brand);
          case "modelo-asc": return a.name.localeCompare(b.name);
          case "modelo-desc": return b.name.localeCompare(a.name);
          case "capacidad-asc": return a.capacity - b.capacity;
          case "capacidad-desc": return b.capacity - a.capacity;
          default: return 0;
        }
      });
    },
    resetearFiltros() {
      this.filtroMarca = null;
      this.filtroModelo = null;
      this.filtroCapacidad = null;
      this.vehiculosConFiltro = this.models;
      this.filtroSeleccionado = "Todos los disponibles";
    },
    seleccionarMarca(valor) {
      this.filtroModelo = null;
      this.filtroCapacidad = null;
      this.filtroMarca = valor;
      this.filtroSeleccionado = `Marca ${valor} disponibles`;
      this.vehiculosConFiltro = this.models.filter((v) => v.brand === valor);
    },
    seleccionarModelo(valor) {
      this.filtroMarca = null;
      this.filtroCapacidad = null;
      this.filtroModelo = valor;
      this.filtroSeleccionado = `Modelo ${valor} disponibles`;
      this.vehiculosConFiltro = this.models.filter((v) => v.name === valor);
    },
    seleccionarCapacidad(valor) {
      this.filtroMarca = null;
      this.filtroModelo = null;
      this.filtroCapacidad = Number(valor);
      this.filtroSeleccionado = `Capacidad ${valor} disponibles`;
      this.vehiculosConFiltro = this.models.filter((v) => v.capacity === this.filtroCapacidad);
    },
    aplicarFiltroPrecio() {
      this.vehiculosConFiltro = this.models.filter((v) => {
        return (!this.precioDesde || v.finalPrice >= this.precioDesde) &&
               (!this.precioHasta || v.finalPrice <= this.precioHasta);
      });
      this.filtroSeleccionado = "Por precio personalizado";
    },
    async getBranchById(id) {
      try {
        const response = await axios.get(`/api/branches/${id}`);
        this.branch = response.data;
      } catch (error) {
        console.error("Error obteniendo sucursal:", error);
      }
    },
    async getAvailableModels() {
      try {
        const response = await axios.get(`/api/model/availableModels`, {
          params: {
            startDate: this.fechaInicio,
            endDate: this.fechaFin,
            branchId: this.branchId,
          },
        });

        const start = new Date(this.fechaInicio);
        const end = new Date(this.fechaFin);
        const timeDiff = end.getTime() - start.getTime();
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

        this.models = response.data.map((model) => ({
          ...model,
          finalPrice: model.price * days,
        }));

        this.models = this.models.filter((model) => model.finalPrice > this.precioMinimo);
        this.vehiculosConFiltro = this.models;
        this.marcas = this.marcasUnicas();
        this.capacidades = this.capacidadesUnicas();
        this.modelos = this.modelosUnicos();
        this.ordenarVehiculos(this.ordenSeleccionado);
      } catch (error) {
        console.error("Error al obtener vehículos:", error);
      }
    },
    marcasUnicas() {
      const counts = {};
      this.models.forEach((modelo) => {
        const marca = modelo.brand;
        counts[marca] = (counts[marca] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([valor, cantidad]) => ({ valor, cantidad }))
        .sort((a, b) => a.valor.localeCompare(b.valor));
    },
    modelosUnicos() {
      const counts = {};
      this.models.forEach((modelo) => {
        const name = modelo.name;
        counts[name] = (counts[name] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([valor, cantidad]) => ({ valor, cantidad }))
        .sort((a, b) => a.valor.localeCompare(b.valor));
    },
    capacidadesUnicas() {
      const counts = {};
      this.models.forEach((modelo) => {
        const cap = modelo.capacity;
        counts[cap] = (counts[cap] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([valor, cantidad]) => ({ valor: Number(valor), cantidad }))
        .sort((a, b) => a.valor - b.valor);
    },
    async asignarVehiculo(model) {
      try {
        const response = await axios.post('/api/reservation/asignar-vehiculo', null, {
          params: {
            codigoReserva: this.codigoReserva,
            modelId: model.id
          }
        });

        await Swal.fire({
          icon: 'success',
          title: 'Vehículo asignado con éxito',
          text: 'Ahora podés agregar adicionales a la reserva.',
          showConfirmButton: true
        });

        window.location.href = `additional.html?code=${this.codigoReserva}`;
      } catch (error) {
        console.error("Error al asignar vehículo:", error);
        Swal.fire({
          icon: 'error',
          title: 'No se pudo asignar el vehículo',
          text: error.response?.data || 'Ocurrió un error inesperado.',
        });
      }
    }
  },
  computed: {
    vehiculosFiltrados() {
      return this.vehiculosConFiltro;
    },
    fechaInicioFormateada() {
      if (!this.fechaInicio) return null;
      const date = new Date(this.fechaInicio);
      return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    },
    fechaFinFormateada() {
      if (!this.fechaFin) return null;
      const date = new Date(this.fechaFin);
      return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    },
  },
}).mount("#app");

