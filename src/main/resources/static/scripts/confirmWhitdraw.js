document.addEventListener("DOMContentLoaded", () => {
  const inputCodigo = document.getElementById("codigoReserva");
  const btnVerificar = document.getElementById("btn-verificar");

  btnVerificar.addEventListener("click", () => {
    const codigo = inputCodigo.value.trim();

    if (codigo.length !== 6) {
      Swal.fire({
        icon: "warning",
        title: "Código inválido",
        text: "El código debe tener 6 caracteres.",
      });
      return;
    }

    const hoy = new Date().toISOString().split("T")[0];

    axios.post("/api/reservation/validar-codigo", {
      code: codigo,
      startDate: hoy,
    })
    .then((response) => {
      const data = response.data;
      console.log(data)
      if (data && data === "../pages/reassign.html") {
        const params = new URLSearchParams({
          startDate: hoy,
          branchId: data.branchId,
          fechaFin: data.fechaFin,
        });

        window.location.href = `${data}?${params.toString()}`;
      } else if (data && data === "../pages/additional.html") {
        const params = new URLSearchParams({
          code: codigo,
        });

        window.location.href = `${data}?${params.toString()}`;
      } else {
        Swal.fire({
          icon: "success",
          title: "Código válido",
          text: "Código válido, pero no se indicó una redirección válida.",
        });
      }
    })
    .catch((error) => {
      console.error("Error en la verificación:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El código que intentas ingresar no corresponde a una reserva válida.",
      });
    });
  });
});


