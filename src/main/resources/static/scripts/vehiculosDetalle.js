const { createApp } = Vue;

createApp({
  data() {
    return {
      vehicle: {},
      startDate: "",
      endDate: "",
      finalPrice: "",
      branchId:"",
      modelId:"",
      isAuthenticated: false
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
    // Redirige al login con return para evitar que siga el flujo
    window.location.href = "/login.html";
    return;
  }

  // Si está autenticado, continúa con la redirección al pago
  const params = new URLSearchParams({
    brand: this.vehicle.brand,
    name: this.vehicle.name,
    startDate: this.startDate,
    endDate: this.endDate,
    price: this.finalPrice,
    modelId:this.modelId,
    branchId:this.branchId
  });

  window.location.href = `formPay.html?${params.toString()}`;
},
    checkAuth() {
            axios.get("/api/user/isAuthenticated")
                .then(response => {
                    this.isAuthenticated = response.data === true;
                })
                .catch(error => {
                    console.error("Error al verificar autenticación:", error);
                    this.isAuthenticated = false;
                });
        },
        logout() {
            axios.post("/logout") // Cambiá este endpoint si usás otro.
                .then(() => {
                    this.isAuthenticated = false;
                    window.location.href = "/index.html"; // o donde quieras redirigir después del logout
                })
                .catch(error => {
                    console.error("Error al cerrar sesión:", error);
                });
        }
  }
}).mount("#app");

