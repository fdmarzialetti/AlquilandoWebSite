const { createApp } = Vue;

createApp({
  data() {
    return {
      vehicle: {},
      startDate: "",
      endDate: "",
      finalPrice: "",
      branchId: "",
      modelId: "",
      isAuthenticated: false,
      user: { name: "Cuenta" },
      score:0,
    };
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get("brand");
    const name = params.get("name");
    this.startDate = params.get("startDate");
    this.endDate = params.get("endDate");
    this.finalPrice = params.get("price");
    this.branchId = params.get("branchId");
    this.modelId = params.get("modelId");
    this.score = params.get("score")
    this.getVehicleDetail(brand, name);
    this.checkAuth();
  },
  methods: {
    async getVehicleDetail(brand, name) {
      try {
        const response = await axios.get(`/api/model/detalle?brand=${encodeURIComponent(brand)}&name=${encodeURIComponent(name)}`);
        console.log("Respuesta del backend:", response.data);
        this.vehicle = response.data;
      } catch (error) {
        console.error("Error al obtener el modelo:", error);
      }
    },

    confirmarReserva() {
      if (!this.isAuthenticated) {
        window.location.href = "/login.html";
        return;
      }

      const params = new URLSearchParams({
        brand: this.vehicle.brand,
        name: this.vehicle.name,
        startDate: this.startDate,
        endDate: this.endDate,
        price: this.finalPrice,
        modelId: this.modelId,
        branchId: this.branchId
      });

      window.location.href = `formPay.html?${params.toString()}`;
    },

    checkAuth() {
      axios.get("/api/user/isAuthenticated")
        .then(response => {
          this.isAuthenticated = response.data === true;
          return axios.get("/api/user/data");
        })
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
            text: "Has cerrado sesión correctamente. ¡Hasta pronto!",
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
            text: "Hubo un problema al cerrar sesión. Inténtalo de nuevo.",
          });
        });
    },

    redirigirAVehiculos() {
      const urlParams = new URLSearchParams(window.location.search);
      const branchId = urlParams.get('branchId');
      const startDate = urlParams.get('startDate');
      const endDate = urlParams.get('endDate');

      let url = 'vehiculos.html?';
      const params = [];

      if (branchId) {
        params.push(`sucursal=${encodeURIComponent(branchId)}`);
      }
      if (startDate) {
        params.push(`fechaInicio=${encodeURIComponent(startDate)}`);
      }
      if (endDate) {
        params.push(`fechaFin=${encodeURIComponent(endDate)}`);
      }

      return url + params.join('&');
    },
    formatPriceArg(value) {
      return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
    }
  }
}).mount("#app");


