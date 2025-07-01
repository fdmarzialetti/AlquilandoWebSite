document.addEventListener("DOMContentLoaded", () => {
  const inputCodigo = document.getElementById("codigoReserva");
  const btnVerificar = document.getElementById("btn-verificar");

  btnVerificar.addEventListener("click", () => {
    const codigo = inputCodigo.value.trim();

    if (codigo.length !== 6) {
      alert("El código debe tener 6 caracteres.");
      return;
    }

    // Obtener la fecha actual en formato YYYY-MM-DD
    const hoy = new Date().toISOString().split("T")[0];

    // Llamada a la API para validar
    fetch("/api/reservas/validar-codigo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo: codigo,
        fecha: hoy
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo verificar el código");
        }
        return response.json();
      })
      .then((data) => {
        if (data.valido) {
          alert("Código correcto. Puede retirar el vehículo.");
          // Acá podrías redirigir si querés: window.location.href = '/retirar.html'
        } else {
          alert("Código inválido o no corresponde al día de hoy.");
        }
      })
      .catch((error) => {
        console.error("Error en la verificación:", error);
        alert("Ocurrió un error al verificar el código.");
      });
  });
});