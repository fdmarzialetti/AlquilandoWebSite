const { createApp } = Vue;

function getParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

createApp({
  data() {
    return {
      codigoReserva: getParam("code"),
      adicionales: [],
      cargado: false, // bandera para saber si ya intentó cargar
    };
  },
  mounted() {
    this.obtenerAdicionales();
  },
  methods: {
    async obtenerAdicionales() {
      try {
        const response = await axios.get(`/api/reservation/${this.codigoReserva}/additionals`);
        this.adicionales = Array.isArray(response.data) ? response.data : [];
        console.log(this.adicionales);
      } catch (error) {
        console.error("Error al obtener adicionales:", error);
        this.adicionales = [];
      } finally {
        this.cargado = true;
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
  computed: {
    mostrarLista() {
      return this.cargado && this.adicionales.length > 0;
    },
    mostrarMensajeVacio() {
      return this.cargado && this.adicionales.length === 0;
    }
  }
}).mount("#app");
