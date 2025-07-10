const { createApp } = Vue;

function getParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

createApp({
  data() {
    return {
      codigoReserva: getParam("codigoReserva"),
      reserva: null,
      adicionales: [],
      error: null,
    };
  },
  mounted() {
    this.cargarReserva();
    this.cargarAdicionales();
  },
  methods: {
    normalizarFecha(fechaStr) {
      if (!fechaStr || typeof fechaStr !== 'string') return null;

      const [anio, mes, dia] = fechaStr.split("-").map(Number);
      return new Date(anio, mes - 1, dia); // ← new Date en horario local
    },
    async cargarReserva() {
      try {
        const response = await axios.get(`/api/reservation/${this.codigoReserva}`);
        this.reserva = response.data;
        this.error = null;
        console.log("Reserva cargada:", response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.error = "No tiene permiso para ver esta reserva.";
        } else if (error.response && error.response.status === 404) {
          this.error = "Reserva no encontrada.";
        } else {
          this.error = "Ocurrió un error al cargar la reserva.";
        }
        console.error("Error al obtener reserva:", error);
      }
    },
    async cargarAdicionales() {
      try {
        const response = await axios.get(`/api/reservation/${this.codigoReserva}/additionals`);
        this.adicionales = response.data;
        console.log("Adicionales cargados:", response.data);
      } catch (error) {
        console.error("Error al obtener adicionales:", error);
      }
    },
    formatPriceArg(value) {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(value);
    },
    volverAAdditional() {
      window.location.href = `additional.html?codigoReserva=${this.codigoReserva}`;
    },
    irAlPanelEmpleado() {
      window.location.href = 'employee.html';
    }
  },
  computed: {
    fechaInicioFormateada() {
      if (!this.reserva) return "";

      const date = this.normalizarFecha(this.reserva.startDate);
      if (!date) return "";

      return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    },

    fechaFinFormateada() {
      if (!this.reserva || !this.reserva.endDate) return "";

      const date = this.normalizarFecha(this.reserva.endDate);
      if (!date) return "";

      return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    },
    resumenVehiculo() {
      if (!this.reserva || !this.reserva.vehicle) return "No asignado";
      return `${this.reserva.vehicle.model}`;
    },
    totalAdicionales() {
      return this.adicionales.reduce((total, adicional) => total + adicional.price, 0);
    }
  }
}).mount("#app");


