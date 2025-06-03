const { createApp } = Vue;

createApp({
  data() {
    return {
      marca: "",
      modelo: "",
      precio: null,
      capacidad: null,
      politica: null,
      imagen: {}
    };
  }, created() { },
  mounted() {

  },
  methods: {
    validarEntero(event) {
      const valor = event.target.value;
      if (!/^\d*$/.test(valor)) {
        event.target.value = this.capacidad || '';
      } else {
        this.capacidad = parseInt(valor);
      }
    },
    handleFileUpload(event) {
      this.image = event.target.files[0];
    },
    async createModel() {
      try {
        const formData = new FormData();
        formData.append("brand", this.marca);
        formData.append("name", this.modelo);
        formData.append("price",this.precio)
        formData.append("image", this.image);
        formData.append("capacity",this.capacidad);
        formData.append("cancelationPolicy",this.politica)
        const res = await axios.post('/api/model/create', formData).then(respuesta => {
          console.log("Modelo creado:", respuesta);
          Swal.fire({
            title: "Modelo creado con exito!",
            icon: "success",
            draggable: true
          }).then(respuesta => {

            window.location.href = "./admin.html";
          });
        })
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error en la carga, debido a que ya existe este modelo en el sistema",
          text: "Intenta con otros datos",
        });
        console.error(error);
      }
    },
    async logout() {
      try {
        const response = await axios.get('/logout').then(window.location.href = "/index.html");

      } catch (error) {
        console.log(error);
      }
    }
  }
}).mount('#app');