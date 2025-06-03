const { createApp } = Vue;

createApp({
  data() {
    return {
      vehicle: {},
    };
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get("brand");
    const name = params.get("name");
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
  },
}).mount("#app");
