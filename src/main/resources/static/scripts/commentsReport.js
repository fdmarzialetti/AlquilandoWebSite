const { createApp } = Vue;

createApp({
  data() {
    return {
      models: [],
      modeloSeleccionado: null
    };
  },
  mounted() {
    this.getModelsComments();
  },
  methods: {
    getModelsComments() {
      axios.get("/api/model/allModelsComments")
        .then(response => {
          this.models = response.data.map(modelo => {
            const valorations = modelo.valorations || [];
            const total = valorations.reduce((acc, val) => acc + val.score, 0);
            const promedio = valorations.length > 0 ? total / valorations.length : 0;
            return {
              ...modelo,
              averageScore: promedio.toFixed(2),
              imagen: this.convertirABase64(modelo.image)
            };
          });
        })
        .catch(error => {
          console.error("Error al obtener los modelos:", error);
        });
    },
    seleccionarModelo(modelo) {
      this.modeloSeleccionado = modelo;
    },
    convertirABase64(bytes) {
      return bytes;
    },
    logout() {
      axios.post("/logout")
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Sesión cerrada",
            text: "Has cerrado sesión correctamente. Hasta pronto!",
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
    }
  }
}).mount("#app");
