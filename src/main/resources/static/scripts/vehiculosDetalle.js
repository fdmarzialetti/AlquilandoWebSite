const { createApp } = Vue;

createApp({
  data() {
    return {
      vehicle: null,
    };
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get("brand");
    const name = params.get("name");

    // Llamada al nuevo endpoint correcto en ModelController
    axios
      .get(`/api/model/detalle?brand=${encodeURIComponent(brand)}&name=${encodeURIComponent(name)}`)
      .then((res) => {
        console.log("Respuesta del backend:", res.data);
        this.vehicle = res.data;
      })
      .catch((err) => {
        console.error("Error al obtener el modelo:", err);
      });
  },
}).mount("#app");

