const metodoPago = document.getElementById("metodoPago");
const tarjetaBox = document.getElementById("tarjetaBox");
const paypalBox = document.getElementById("paypalBox");
const btnPagar = document.getElementById("btnPagar");

// Control de visibilidad de métodos de pago
metodoPago.addEventListener("change", () => {
  tarjetaBox.style.display = "none";
  paypalBox.style.display = "none";

  if (metodoPago.value === "tarjeta") {
    tarjetaBox.style.display = "block";
  }

  if (metodoPago.value === "paypal") {
    paypalBox.style.display = "block";
  }
});

// Auto rellenar correo si existe login
let user = JSON.parse(localStorage.getItem("user"));
if (user) {
  document.getElementById("correo").value = user.correo;
}

btnPagar.addEventListener("click", () => {
  // 1. Validar login
  let user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("⚠️ Debes iniciar sesión antes de pagar");
    window.location.href = "login.html";
    return;
  }

  // 2. Obtener valores de los campos
  let nombre = document.getElementById("nombre").value;
  let direccion = document.getElementById("direccion").value;
  let correo = document.getElementById("correo").value;
  let metodo = metodoPago.value;

  // 3. Validaciones generales
  if (nombre === "" || direccion === "" || correo === "" || !correo.includes("@")) {
    alert("⚠️ Completa tus datos correctamente");
    return;
  }

  if (metodo === "") {
    alert("⚠️ Selecciona un método de pago");
    return;
  }

  // 4. Validar detalles de pago específicos
  if (metodo === "tarjeta") {
    let numTarjeta = document.getElementById("numeroTarjeta").value;
    let cvv = document.getElementById("cvvTarjeta").value;

    if (numTarjeta.length < 12 || cvv.length < 3) {
      alert("⚠️ Datos de tarjeta inválidos");
      return;
    }
  }

  if (metodo === "paypal") {
    let correoPaypal = document.getElementById("correoPaypal").value;

    if (correoPaypal === "" || !correoPaypal.includes("@")) {
      alert("⚠️ Ingresa un correo PayPal válido");
      return;
    }
  }

  // 5. Verificar carrito
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
    alert("⚠️ Tu carrito está vacío");
    return;
  }

  // 6. Calcular total corregido
  // Usamos parseFloat para asegurar que el precio sea número. 
  // Si no usas 'cantidad' en tu objeto, lo multiplicamos por 1 por defecto.
  let total = carrito.reduce((acc, item) => {
    let precio = parseFloat(item.precio);
    let cantidad = item.cantidad || 1;
    return acc + (precio * cantidad);
  }, 0);

  // 7. Crear el objeto del pedido con estructura completa
  let nuevoPedido = {
    id: Date.now(), // Añadimos ID único
    fecha: new Date().toLocaleString(),
    total: total.toFixed(2),
    metodoPago: metodo,
    correo: correo,
    cliente: nombre,
    direccion: direccion,
    productos: carrito
  };

  // 8. Guardar en historial de pedidos
  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  pedidos.push(nuevoPedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  // 9. Guardar para el ticket actual
  localStorage.setItem("ticket", JSON.stringify(nuevoPedido));

  // 10. Finalizar proceso
  localStorage.removeItem("carrito");

  alert("✅ Compra realizada con éxito 💖");
  window.location.href = "ticket.html";
});