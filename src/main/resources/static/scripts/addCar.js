const { createApp } = Vue;

createApp({
  data() {
    return {
      patente: '',
      anio: '',
      modeloId: '',
      sucursalId: '',
      modelos: [],
      sucursales: []
    };
  },
  methods: {
    async darDeAltaAuto() {
      try {
        const formData = new FormData();
        formData.append('plate', this.patente);
        formData.append('yearV', this.anio);
        formData.append('modelId', this.modeloId);
        formData.append('branchId', this.sucursalId);

        const response = await axios.post('/api/vehicle/createVehicle', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        Swal.fire('Éxito', 'Vehículo dado de alta correctamente.', 'success');

        // Limpiar formulario
        this.patente = '';
        this.anio = '';
        this.modeloId = '';
        this.sucursalId = '';
      } catch (error) {
        if (error.response && error.response.status === 409) {
          Swal.fire('Error', 'Ya existe un auto con esa patente.', 'error');
        } else {
          Swal.fire('Error', 'Ocurrió un error al dar de alta el auto.', 'error');
        }
      }
    },

    async cargarModelos() {
      try {
        const res = await axios.get('/api/model/listModels');
        this.modelos = res.data;
      } catch (error) {
        console.error('Error al cargar modelos:', error);
      }
    },

    async cargarSucursales() {
      try {
        const res = await axios.get('/api/branches');
        this.sucursales = res.data;
      } catch (error) {
        console.error('Error al cargar sucursales:', error);
      }
    }
  },

  mounted() {
    this.cargarModelos();
    this.cargarSucursales();
  }
}).mount('#app');
