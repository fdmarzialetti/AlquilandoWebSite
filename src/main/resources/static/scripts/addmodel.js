const { createApp } = Vue;

createApp({
  data() {
    return {
      marca: "",
      modelo: "",
      precio: null,
      capacidad: null,
      politica: null,
      imagen: null
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
      this.imagen = "imegen autito";
    },
    async createModel() {
      try {
        let modelo = {
          brand: this.marca,
          name: this.modelo,
          price: this.precio,
          image: this.imagen,
          capacity: this.capacidad,
          cancelationPolicy: this.politica
        }
        const res = await axios.post('/api/model/create', modelo).then(respuesta => {
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

    async logout(){
            try {
                const response = await axios.get('/logout').then(window.location.href="/index.html");
                
            } catch (error) {
                console.log(error);
            }
        }

  }
}).mount('#app');