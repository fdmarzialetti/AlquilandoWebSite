const { createApp } = Vue;

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

createApp({
  data() {
    return {
      codigoReserva: getParam("code"),
      modelo: getParam("modelo"),
      adicionales: [],
      cargado: false,
      detalleVehiculo: null,
      fechasReserva: null,
      precioFinal: 0, // <--- NUEVO
    };
  },
  computed: {
    mostrarLista() {
      return this.cargado && this.adicionales.length > 0;
    },
    mostrarMensajeVacio() {
      return this.cargado && this.adicionales.length === 0;
    },
    fechaInicioFormateada() {
      if (!this.fechasReserva) return "";
      return new Date(this.fechasReserva.startDate).toLocaleDateString("es-AR");
    },
    fechaFinFormateada() {
      if (!this.fechasReserva) return "";
      return new Date(this.fechasReserva.endDate).toLocaleDateString("es-AR");
    },
  },
  methods: {
    async obtenerAdicionales() {
      try {
        const response = await axios.get(`/api/reservation/${this.codigoReserva}/additionals`);
        this.adicionales = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Error al obtener adicionales:", error);
        this.adicionales = [];
      } finally {
        this.cargado = true;
      }
    },
    async obtenerDatosVehiculo() {
      try {
        const response = await axios.get(`/api/model/by-name`, {
          params: { name: this.modelo }
        });
        this.detalleVehiculo = {
          brand: response.data.brand,
          name: response.data.name,
          image: response.data.image,
          price: response.data.price // por si querés seguir mostrándolo
        };
      } catch (error) {
        console.error("Error al obtener modelo:", error);
      }
    },
    async obtenerFechasReserva() {
      try {
        const response = await axios.get(`/api/reservation/dates/${this.codigoReserva}`);
        this.fechasReserva = {
          startDate: response.data.startDate,
          endDate: response.data.endDate
        };
        this.precioFinal = response.data.price; // <--- NUEVO
      } catch (error) {
        console.error("Error al obtener fechas de reserva:", error);
      }
    },
    irAAgregarAdicional() {
      window.location.href = `addAdditional.html?code=${this.codigoReserva}`;
    },
    finalizar() {
      window.location.href = `../pages/confirmation.html?codigoReserva=${this.codigoReserva}`;
    },
    formatPriceArg(value) {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(value);
    }
  },
  mounted() {
    if (!this.codigoReserva || !this.modelo) {
      Swal.fire("Error", "Faltan parámetros en la URL", "error");
      return;
    }

    this.obtenerAdicionales();
    this.obtenerDatosVehiculo();
    this.obtenerFechasReserva();
  },
}).mount("#app");


