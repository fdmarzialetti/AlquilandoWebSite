const { createApp } = Vue;

createApp({
  data() {
    return {
      model: {
        brand: "",
        name: "",
        price: null,
        capacity: null,
        cancelationPolicy: "",
        image: null
      },
      previewImage: null,
      isEditMode: false,
      id: null,
    };
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    this.id = params.get("id");
    if (this.id) {
      this.isEditMode = true;
      this.fetchModel();
    }
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.model.image = file;
      if (file) {
        this.previewImage = URL.createObjectURL(file);
      }
    },

    async fetchModel() {
      try {
        const response = await axios.get(`/api/model/${this.id}`);
        const data = response.data;
        this.model.brand = data.brand;
        this.model.name = data.name;
        this.model.price = data.price;
        this.model.capacity = data.capacity;
        this.model.cancelationPolicy = data.cancelationPolicy;

        if (data.image) {
          const blob = new Blob([new Uint8Array(data.image)], { type: "image/jpeg" });
          this.previewImage = URL.createObjectURL(blob);
        }

      } catch (error) {
        console.error("Error al cargar modelo:", error);
        Swal.fire("Error", "No se pudo cargar el modelo.", "error");
      }
    },

    async submitModel() {
      try {
        const formData = new FormData();
        formData.append("brand", this.model.brand);
        formData.append("name", this.model.name);
        formData.append("price", this.model.price);
        formData.append("capacity", this.model.capacity);
        formData.append("cancelationPolicy", this.model.cancelationPolicy);
        if (this.model.image) {
          formData.append("image", this.model.image);
        }

        const url = this.isEditMode
          ? `/api/model/update/${this.id}`
          : `/api/model/create`;

        const method = this.isEditMode ? "put" : "post";

        await axios({
          method,
          url,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" }
        });

        Swal.fire({
          icon: "success",
          title: this.isEditMode ? "Modelo actualizado con éxito!" : "Modelo creado con éxito!",
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          window.location.href = "./listModels.html";
        });

      } catch (error) {
        console.error("Error al crear o actualizar el modelo:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data || "No se pudo completar la operación.",
        });
      }
    },

    logout() {
      axios.post("/logout")
        .then(() => {
          Swal.fire("Sesión cerrada", "Has cerrado sesión correctamente.", "success").then(() => {
            window.location.href = "/index.html";
          });
        })
        .catch(() => {
          Swal.fire("Error", "No se pudo cerrar sesión.", "error");
        });
    }
  }
}).mount("#appModel");
