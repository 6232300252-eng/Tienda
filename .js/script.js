let products = [];
let filtered = [];

const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");
const favCount = document.getElementById("fav-count");

if (search) {
  search.addEventListener("input", () => {
    let text = search.value.toLowerCase();
    filtered = products.filter(p => p.name.toLowerCase().includes(text));
    renderProducts();
  });
}

/* ==========================
   TOAST
========================== */

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

/* ==========================
   CARGAR PRODUCTOS
========================== */

async function loadProducts() {
  const res = await fetch("data/productos.json");
  products = await res.json();
  filtered = products;
  renderProducts();
  renderBestSellers();

}

function renderBestSellers() {
  const bestContainer = document.getElementById("best-products");
  if (!bestContainer) return;

  const best = [...products].sort((a,b) => b.price - a.price).slice(0,3);

  best.forEach(p => {
    bestContainer.innerHTML += `
      <div class="card badge-best">
        <span class="badge">Más Vendido</span>
        <img src="${p.img}">
        <h4>${p.name}</h4>
        <p>$${p.price}</p>
        <button onclick="openQuickView(${p.id})">Vista rápida</button>
      </div>
    `;
  });
}


/* ==========================
   MOSTRAR PRODUCTOS
========================== */

function renderProducts() {
  
  productList.innerHTML = "";

  if (filtered.length === 0) {
    productList.innerHTML = "<h2>No se encontraron productos 😥</h2>";
    return;
  }

  filtered.forEach(p => {
    productList.innerHTML += `
      <div class="card">
        <a href="producto.html?id=${p.id}">
          <img src="${p.img}">
          <h4>${p.name}</h4>
        </a>
        <p>$${p.price}</p>
        <button onclick="addToCart(${p.id})">Agregar 🛒</button>
        <button onclick="addToFav(${p.id})">❤️ Favorito</button>
      </div>
    `;
  });
}
/*masvendido*/
function openQuickView(id){
  const modal = document.getElementById("quickModal");
  const body = document.getElementById("quick-body");

  const product = products.find(p => p.id === id);

  body.innerHTML = `
    <img src="${product.img}" style="width:200px">
    <h2>${product.name}</h2>
    <p>${product.desc}</p>
    <p>$${product.price}</p>
    <button onclick="addToCart(${product.id})">Agregar al carrito</button>
  `;

  modal.style.display = "flex";
  
}

function closeQuickView(){
  document.getElementById("quickModal").style.display = "none";
}
/*look*/ 
function openLook(){

  const lookProducts = products.filter(p => p.look === "iconic");
  const container = document.getElementById("look-products");

  container.innerHTML = "";

  let total = 0;

  lookProducts.forEach(p => {
    total += p.price;

    container.innerHTML += `
      <div class="card">
        <img src="${p.img}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p>$${p.price}</p>
        <button onclick="addToCart(${p.id})">Agregar</button>
      </div>
    `;
  });

  container.innerHTML += `
    <div class="look-total">
      <h3>Total del look: $${total}</h3>
    </div>
  `;

  // Guardamos productos actuales
  window.currentLook = lookProducts;

  document.getElementById("lookModal").style.display = "flex";
}

function completeLook(){
  if (!window.currentLook) return;

  window.currentLook.forEach(p => addToCart(p.id));
  showToast("Look completo agregado 💄✨");
  closeLook();
}

function closeLook(){
  document.getElementById("lookModal").style.display = "none";
}

/* ==========================
   CARRITO (CON ANIMACIÓN)
========================== */

function updateCartCounter() {
  let cart = JSON.parse(localStorage.getItem("carrito")) || [];
  
  // Identificador: Lógica de pulso y visibilidad
  if (cartCount) {
    const total = cart.length;
    cartCount.setAttribute("data-count", total);

    if (total > 0) {
      cartCount.innerText = total;
      // Disparar pulso
      cartCount.classList.remove("pulse");
      void cartCount.offsetWidth; 
      cartCount.classList.add("pulse");
    } else {
      cartCount.innerText = "";
    }
  }
}

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("carrito")) || [];
  let product = products.find(p => p.id === id);
  let existing = cart.find(x => x.id === id);

  if (existing) {
    existing.cantidad += 1;
    showToast("Cantidad actualizada ➕");
  } else {
    cart.push({
      id: product.id,
      nombre: product.name,
      precio: product.price,
img: product.img.startsWith('http') ? product.img : '/' + product.img,      cantidad: 1
    });
    showToast("Producto agregado 🛒");
  }

  localStorage.setItem("carrito", JSON.stringify(cart));
  updateCartCounter(); // Identificador: Llamada a animación
}

/* ==========================
   FAVORITOS (CON ANIMACIÓN)
========================== */

function updateFavCounter() {
  let favs = JSON.parse(localStorage.getItem("favs")) || [];
  
  if (favCount) {
    const total = favs.length;
    favCount.setAttribute("data-count", total);

    if (total > 0) {
      favCount.innerText = total;
      // Pulso para favoritos también
      favCount.classList.remove("pulse");
      void favCount.offsetWidth;
      favCount.classList.add("pulse");
    } else {
      favCount.innerText = "";
    }
  }
}

function addToFav(id) {
  let favs = JSON.parse(localStorage.getItem("favs")) || [];
  let product = products.find(p => p.id === id);
  let exists = favs.find(x => x.id === id);

  if (exists) {
    showToast("Ya está en favoritos ❤️");
    return;
  }

  favs.push(product);
  localStorage.setItem("favs", JSON.stringify(favs));

  showToast("Agregado a favoritos ✨");
  updateFavCounter(); // Identificador: Llamada a animación
}

/* ==========================
   BUSCADOR, FILTROS Y ORDEN
========================== */


function filterCategory(cat) {
  filtered = cat === "all"
    ? products
    : products.filter(p => p.category === cat);

  renderProducts();

  document.querySelectorAll(".category-menu button")
    .forEach(btn => btn.classList.remove("active"));

  event.target.classList.add("active");

};

function showOnlyFavs() {
  let favs = JSON.parse(localStorage.getItem("favs")) || [];
  if (favs.length === 0) {
    showToast("No tienes favoritos 💔");
    return;
  }
  filtered = favs;
  renderProducts();
}

/* ==========================
   INICIO
========================== */

loadProducts();
updateCartCounter();
updateFavCounter();
