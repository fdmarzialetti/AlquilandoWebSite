const { createApp } = Vue;

createApp({
  data() {
    return {
      id: null,
      marca: "",
      modelo: "",
      precio: null,
      capacidad: null,
      politica: null,
      image: null,
      isEdit: false
    };
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    this.id = params.get("id");
    if (this.id) {
      this.isEdit = true;
      this.fetchModel();
    }
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
    async fetchModel() {
      try {
        const response = await axios.get(`/api/model/${this.id}`);
        const data = response.data;

        this.marca = data.brand;
        this.modelo = data.name;
        this.precio = data.price;
        this.capacidad = data.capacity;
        this.politica = data.cancelationPolicy;
      } catch (error) {
        console.error("Error al cargar modelo:", error);
        Swal.fire("Error", "No se pudo cargar el modelo.", "error");
      }
    },
    async createOrUpdateModel() {
      try {
        const formData = new FormData();
        formData.append("brand", this.marca);
        formData.append("name", this.modelo);
        formData.append("price", this.precio);
        formData.append("capacity", this.capacidad);
        formData.append("cancelationPolicy", this.politica);
        if (this.image) {
          formData.append("image", this.image);
        }

        const url = this.isEdit
          ? `/api/model/update/${this.id}`
          : `/api/model/create`;

        const method = this.isEdit ? 'put' : 'post';

        await axios({
          method,
          url,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" }
        });

        Swal.fire({
          icon: "success",
          title: this.isEdit ? "Modelo actualizado con éxito!" : "Modelo creado con éxito!",
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          window.location.href = "./listModels.html";
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: this.isEdit
            ? "No se pudo actualizar el modelo."
            : "Error al crear el modelo, probablemente ya exista.",
        });
      }
    },
    logout() {
      axios.post("/logout")
        .then(() => {
          this.isAuthenticated = false;
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
}).mount('#app');