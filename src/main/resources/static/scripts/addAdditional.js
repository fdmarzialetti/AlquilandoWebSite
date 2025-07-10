const { createApp } = Vue;

createApp({
  data() {
    return {
      adicionales: [],
      idSeleccionado: null,
      codigoReserva: null
    };
  },
  methods: {
    obtenerAdicionales() {
      axios.get('http://localhost:8080/api/additionals/all')
        .then(res => {
          this.adicionales = res.data.filter(a => a.state); // Solo activos
        })
        .catch(err => {
          console.error(err);
          Swal.fire("Error", "No se pudieron obtener los adicionales", "error");
        });
    },
    cargarAdicional() {
        console.log(this.codigoReserva)
      if (!this.idSeleccionado) {
        Swal.fire("Seleccione un adicional", "", "info");
        return;
      }

      axios.post("http://localhost:8080/api/reservation/add-additional", {
        reservationCode: this.codigoReserva,
        additionalId: this.idSeleccionado
      })
      .then(() => {
        Swal.fire({
          title: "Éxito",
          text: "Adicional agregado correctamente",
          icon: "success",
          showConfirmButton: true
        });

        setTimeout(() => {
          window.location.href = `additional.html?code=${this.codigoReserva}`;
        }, 1600);
      })
      .catch(err => {
        const msg = err.response?.data || "No se pudo agregar el adicional";
        Swal.fire("Error", msg, "error");
      });
    },
    obtenerCodigoDesdeURL() {
      const params = new URLSearchParams(window.location.search);
      this.codigoReserva = params.get("code");
    },
    formatPriceArg(value) {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
      }).format(value);
    },
    volver() {
      window.location.href = `additional.html?code=${this.codigoReserva}`; // Ruta relativa desde /pages/
    }
  },
  mounted() {
    this.obtenerCodigoDesdeURL();
    this.obtenerAdicionales();
  }
}).mount("#app");
