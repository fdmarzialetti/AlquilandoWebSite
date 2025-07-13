const { createApp } = Vue;

createApp({
  data() {
    return {
      activeModels: [],
      inactiveModels: [],
    };
  },
  computed: {
    activeModelsSorted() {
      return this.activeModels.sort((a, b) => a.brand.localeCompare(b.brand));
    },
    inactiveModelsSorted() {
      return this.inactiveModels.sort((a, b) => a.brand.localeCompare(b.brand));
    },
  },
  methods: {
    async fetchModels() {
      try {
        const response = await axios.get("/api/model/listModels");
        this.activeModels = response.data.filter((model) => model.status === true);
        this.inactiveModels = response.data.filter((model) => model.status === false);
      } catch (error) {
        console.error("Error al cargar modelos:", error);
        Swal.fire("Error", "No se pudieron cargar los modelos.", "error");
      }
    },

    getCancelationText(policy) {
      switch (policy) {
        case "ZERO": return "0%";
        case "TWENTY": return "20%";
        case "FULL": return "100%";
        default: return "-";
      }
    },

    editModel(id) {
      window.location.href = `../pages/addModel.html?id=${id}`;
    },

    async deactivateModel(id) {
      const confirm = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción dará de baja el modelo.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, dar de baja",
        cancelButtonText: "Cancelar",
      });

      if (confirm.isConfirmed) {
        try {
          await axios.put(`/api/model/${id}/deactivate`);
          await this.fetchModels();
          Swal.fire("Modelo dado de baja", "", "success");
        } catch (error) {
          let msg = "Error al dar de baja el modelo.";
          if (error.response?.data) msg = error.response.data;
          Swal.fire("Error", msg, "error");
        }
      }
    },

    async activateModel(id) {
      const confirm = await Swal.fire({
        title: "¿Activar modelo?",
        text: "Esta acción reactivará el modelo.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, activar",
        cancelButtonText: "Cancelar",
      });

      if (confirm.isConfirmed) {
        try {
          await axios.put(`/api/model/${id}/activate`);
          await this.fetchModels();
          Swal.fire("Modelo reactivado", "", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo reactivar el modelo.", "error");
        }
      }
    },

    logout() {
      axios.post("/logout").then(() => {
        Swal.fire("Sesión cerrada", "Has cerrado sesión correctamente.", "success").then(() => {
          window.location.href = "/index.html";
        });
      }).catch(() => {
        Swal.fire("Error", "No se pudo cerrar sesión.", "error");
      });
    },
  },
  mounted() {
    this.fetchModels();
  },
}).mount("#appList");
