const { createApp } = Vue;

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

createApp({
  data() {
    return {
      codigoReserva: getParam("code"),
      modelo: getParam("modelo"),
      vehicleId: getParam("vehiculoId"),
      adicionales: [],
      addicionalesVehiculo: [],
      cargado: false,
      detalleVehiculo: null,
      fechasReserva: null,
      precioFinal: 0, // <--- NUEVO
      idSeleccionado: "",
    };
  },
  computed: {
    mostrarLista() {
      return this.addicionalesVehiculo.length > 0;
    },
    mostrarMensajeVacio() {
      return this.addicionalesVehiculo.length === 0;
    },
    fechaInicioFormateada() {
      if (!this.fechasReserva) return "";
      return new Date(this.fechasReserva.startDate).toLocaleDateString("es-AR");
    },
    fechaFinFormateada() {
      if (!this.fechasReserva) return "";
      return new Date(this.fechasReserva.endDate).toLocaleDateString("es-AR");
    },
    totalAdicionales() {
      return this.addicionalesVehiculo.reduce((total, adicional) => total + adicional.price, 0);
    },
    precioTotal() {
      return this.precioFinal + this.totalAdicionales;
    },
  },
  methods: {
    obtenerAdicionales() {
      axios.get('/api/additionals/all')
        .then(response => {
          this.adicionales = response.data.filter(a=>a.state==true);
          console.log("Response:", response);
          console.log("Adicionales:", JSON.parse(JSON.stringify(this.adicionales))); // para ver sin proxy
        })
        .catch(error => {
          console.error("Error al obtener adicionales:", error);
          this.adicionales = [];
        });
    }
    ,
    cargarAdicional() {
      this.addicionalesVehiculo.push(this.adicionales.find(({id})=>id==this.idSeleccionado))
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
  // Paso 1: enviar adicionales
  axios.post('/api/reservation/add-additional', {
    adicionales: this.addicionalesVehiculo,
    codigoReserva: this.codigoReserva
  })
  // Paso 2: luego asignar el vehículo
  .then(() => {
    return axios.post('/api/reservation/assign-vehicle', {
      codigoReserva: this.codigoReserva,
      vehicleId: this.vehicleId
    });
  })
  // Paso 3: mostrar éxito y redirigir
  .then(() => {
    Swal.fire({
      title: 'Operación completada',
      text: 'El vehículo fue asignado y los adicionales guardados correctamente.',
      icon: 'success',
      confirmButtonText: 'Ir a confirmación'
    }).then(() => {
      window.location.href = `../pages/confirmation.html?codigoReserva=${this.codigoReserva}`;
    });
  })
  // Paso 4: manejo de errores
  .catch(error => {
    const msg = error.response?.data || 'Ocurrió un error al finalizar la operación.';
    Swal.fire({
      title: 'Error',
      text: msg,
      icon: 'error',
      confirmButtonText: 'Entendido'
    });
    console.error(error);
  });
},
eliminarAdicional(index) {
    this.addicionalesVehiculo.splice(index, 1);
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


