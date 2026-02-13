const cartItems = document.getElementById("cart-items");
const totalText = document.getElementById("total");
const btnPagarContainer = document.getElementById("btn-pagar-container"); 
const sugerenciasContenedor = document.getElementById("productos-sugeridos");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Identificador: Sincronizar Header
function actualizarHeader() {
    const cartCount = document.getElementById("cart-count");
    const favCount = document.getElementById("fav-count");
    
    // Actualizar Carrito
   let favsActual = JSON.parse(localStorage.getItem("favs")) || [];
    if (favCount) {
        favCount.textContent = favsActual.length;
        favCount.setAttribute("data-count", favsActual.length);
    }
}

const catalogoSugerencias = [
    { nombre: "Labial Glossy Rosa", precio: 120, img: "img/labial2.png" },
    { nombre: "Mascara de Pestañas", precio: 180, img: "img/rimel.png" },
    { nombre: "Set de Brochas Luxe", precio: 350, img: "img/brochas.png" },
    { nombre: "Delineador Pro Negro", precio: 95, img: "img/delineador.png" },
    { nombre: "Iluminador Sun", precio: 210, img: "img/iluminador.png" }
];

function renderCarrito() {
    cartItems.innerHTML = "";

    if (carrito.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align:center; padding: 50px;">
                <h2>Tu carrito está vacío 💄</h2>
                <a href="index.html" style="color: #ff4d6d; font-weight:bold;">Ir de compras</a>
            </div>`;
        totalText.textContent = "Total: $0.00";

        if (btnPagarContainer) btnPagarContainer.style.display = "none";
        cargarSugerencias(); 
        actualizarHeader(); // Identificador: Actualización estado vacío
        return;
    }

    if (btnPagarContainer) btnPagarContainer.style.display = "block";

    const btnVaciar = document.createElement("button");
    btnVaciar.innerText = "Vaciar Carrito 🗑️";
    btnVaciar.style = "background:none; border:none; color:#888; cursor:pointer; margin-bottom:10px; font-size:12px; text-decoration:underline;";
    btnVaciar.onclick = vaciarCarrito;
    cartItems.appendChild(btnVaciar);

    let total = 0;

    carrito.forEach((producto, index) => {
        total += parseFloat(producto.precio) * producto.cantidad;

        let card = document.createElement("div");
        card.classList.add("card");
        
        card.innerHTML = `
          <div style="display: flex; align-items: center; width: 100%; gap: 15px;">
            <img src="${producto.img}" style="width:60px; height:60px; object-fit:contain;">
            <div style="flex: 1;">
                <h3 style="margin:0; font-size:16px;">${producto.nombre}</h3>
                <p style="margin:2px 0; color:#ff4d6d; font-weight:bold;">$${producto.precio}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <button onclick="cambiarCantidad(${index}, -1)" style="width:30px; padding:2px;">➖</button>
                <b>${producto.cantidad}</b>
                <button onclick="cambiarCantidad(${index}, 1)" style="width:30px; padding:2px;">➕</button>
            </div>
            <button onclick="eliminarProducto(${index})" style="background:none; color:red; border:none; width:auto; font-size:18px;">🗑️</button>
          </div>
        `;
        cartItems.appendChild(card);
    });

    totalText.textContent = "Total: $" + total.toFixed(2);
    cargarSugerencias(); 
    actualizarHeader(); // Identificador: Actualización con productos
}

function cargarSugerencias() {
    if (!sugerenciasContenedor) return;
    const sugerenciasFiltradas = catalogoSugerencias.filter(prod => 
        !carrito.some(item => item.nombre === prod.nombre)
    );
    const seleccionadas = sugerenciasFiltradas.sort(() => 0.5 - Math.random()).slice(0, 3);
    sugerenciasContenedor.innerHTML = "";

    seleccionadas.forEach(prod => {
        const div = document.createElement("div");
        div.className = "card";
        div.style = "display:flex; align-items:center; gap:10px; padding:10px; margin-bottom:10px; box-shadow:none; border:1px solid #fff0f3;";
        div.innerHTML = `
            <img src="${prod.img}" style="width:45px; height:45px; object-fit:contain;">
            <div style="flex:1; text-align:left;">
                <h4 style="font-size:12px; margin:0;">${prod.nombre}</h4>
                <p style="color:#ff4d6d; font-size:11px; margin:0;">$${prod.precio}</p>
            </div>
            <button onclick='agregarSugerencia(${JSON.stringify(prod)})' style="width:30px; padding:5px; font-size:14px;">+</button>
        `;
        sugerenciasContenedor.appendChild(div);
    });
}
 
function vaciarCarrito() {
    if(confirm("¿Estás seguro de que quieres vaciar tu carrito? 🧐")) {
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderCarrito();
    }
}

window.agregarSugerencia = function(prod) {
    let carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    prod.cantidad = 1;
    carritoActual.push(prod);
    localStorage.setItem("carrito", JSON.stringify(carritoActual));
    carrito = carritoActual;
    renderCarrito();
}

function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) carrito[index].cantidad = 1;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
}

function eliminarProducto(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
}

renderCarrito();
