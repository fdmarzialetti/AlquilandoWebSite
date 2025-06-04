const { createApp } = Vue;

createApp({
  data() {
    return {
      vehicle: {},
      startDate: "",
      endDate: "",
      finalPrice: ""
    };
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get("brand");
    const name = params.get("name");
    this.startDate = params.get("startDate");
    this.endDate = params.get("endDate");
    this.finalPrice = params.get("price");

    this.getVehicleDetail(brand, name);
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
      const params = new URLSearchParams({
        brand: this.vehicle.brand,
        name: this.vehicle.name,
        startDate: this.startDate,
        endDate: this.endDate,
        price: this.finalPrice,
        pricePerDay: this.vehicle.price,
        capacity: this.vehicle.capacity,
        cancelationPolicy: this.vehicle.cancelationPolicy
      });

      window.location.href = `formPay.html?${params.toString()}`;
    }
  }
}).mount("#app");

