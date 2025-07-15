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
    async cargarReserva() {
      try {
        const res = await axios.get(`/api/reservation/${this.codigoReserva}`);
        this.reserva = res.data;
      } catch (error) {
        this.error = "Error al cargar la reserva.";
        console.error(error);
      }
    },
    async cargarAdicionales() {
      try {
        const res = await axios.get(`/api/reservation/${this.codigoReserva}/additionals`);
        this.adicionales = res.data;
      } catch (error) {
        console.error("Error al cargar adicionales", error);
      }
    },
    formatPriceArg(value) {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(value);
    },
    irAlPanelEmpleado() {
      window.location.href = 'employee.html';
    },
    normalizarFecha(fechaStr) {
      if (!fechaStr) return "";
      const [anio, mes, dia] = fechaStr.split("-").map(Number);
      return new Date(anio, mes - 1, dia);
    }
  },
  computed: {
    fechaInicioFormateada() {
      const date = this.normalizarFecha(this.reserva?.startDate);
      return date ? date.toLocaleDateString("es-AR") : "";
    },
    fechaFinFormateada() {
      const date = this.normalizarFecha(this.reserva?.endDate);
      return date ? date.toLocaleDateString("es-AR") : "";
    },
    resumenVehiculo() {
      return this.reserva?.vehicle?.model || "No asignado";
    },
    totalAdicionales() {
      return this.adicionales.reduce((acc, val) => acc + val.price, 0);
    },
    totalFinal() {
      return (this.reserva?.payment || 0) + this.totalAdicionales;
    }
  }
}).mount("#app");
