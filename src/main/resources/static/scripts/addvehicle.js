const { createApp } = Vue;

createApp({
  data() {
    return {
      vehicleId: null,
      car_id: "",
      year: "",
      selectedBranchId: "",
      selectedModelId: "",
      branches: [],
      models: []
    };
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    this.vehicleId = params.get("id");

    this.loadModels();
    this.loadBranches();

    if (this.vehicleId) {
      this.loadVehicleData(this.vehicleId);
    }
  },
  methods: {
    loadBranches() {
      axios.get("/api/branches")
        .then(res => this.branches = res.data)
        .catch(err => console.error("Error al cargar sucursales:", err));
    },
    loadModels() {
      axios.get("/api/model/listModels")
        .then(res => this.models = res.data)
        .catch(err => console.error("Error al cargar modelos:", err));
    },
    loadVehicleData(id) {
      axios.get(`/api/vehicle/${id}`)
        .then(res => {
          const v = res.data;
          this.car_id = v.patent;
          this.year = v.yearV;
          this.selectedBranchId = v.branchId;
          this.selectedModelId = v.modelId;
        })
        .catch(err => {
          console.error("Error al cargar el vehículo:", err);
          Swal.fire("Error", "No se pudo cargar el vehículo", "error");
        });
    },
    createOrUpdateVehicle() {
      const payload = {
        patent: this.car_id,
        yearV: parseInt(this.year),
        modelId: this.selectedModelId,
        branchId: this.selectedBranchId
      };

      const url = this.vehicleId
        ? `/api/vehicle/${this.vehicleId}/updateVehicle`
        : `/api/vehicle/createVehicle`;

      const request = this.vehicleId
        ? axios.put(url, payload)
        : axios.post(url, payload);

      request.then(() => {
        Swal.fire({
          icon: "success",
          title: this.vehicleId ? "Vehículo actualizado" : "Vehículo creado",
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          window.location.href = "./listVehicles.html";
        });
      }).catch(error => {
        const msg = error.response?.data || "Ocurrió un error inesperado";
        Swal.fire("Error", msg, "error");
      });
    },
    logout() {
      Swal.fire("Sesión cerrada").then(() => {
        window.location.href = "/index.html";
      });
    }
  }
}).mount("#app");
