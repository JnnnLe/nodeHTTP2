const API = "/api/products";
const statusEl = document.getElementById("status");
const grid = document.getElementById("product-grid");
const tpl = document.getElementById("product-card-template");

const searchInput = document.getElementById("search");
const sort = document.getElementById("sort");
const modal = document.getElementById("modal");
let products = [];

searchInput.addEventListener("input", () => {
  // console.log(`Searched: ${searchInput.value}`);
});

// Fetch products 
async function fetchProducts() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`Network error: ${res.status}`);
    const body = await res.json();
    console.log("res from api: ", body);
    products = body.data ?? body;
    renderGrid(products);
    statusEl.textContent = "";

  } catch (err) {
    console.error("❌ Fetch failed:", err);
    statusEl.textContent = "Failed to load products."
  }
};

function renderGrid(list) {
  grid.innerHTML = "";
  if (!list.length) {
    grid.innerHTML = "No products found";
    return;
  }

  list.forEach(product => {
    const node = tpl.content.cloneNode(true);
    //each card
    const article = node.querySelector(".card");
    const img = node.querySelector(".thumb");
    node.querySelector(".title").textContent = product.title;
    node.querySelector(".price").textContent = `$${product.price.toFixed(2)}`;
    img.src = product.image;
    img.alt = product.title;
    node.querySelector(".details").addEventListener("click", () => openModal(product));
    grid.appendChild(node);
  });
};

function openModal(product) {
  document.getElementById("modal-title").textContent = product.title;
  document.getElementById("modal-price").textContent = `$${product.price.toFixed(2)}`;
  document.getElementById("modal-descr").textContent = product.description;
  document.getElementById("modal-img").src = product.image;
  document.getElementById("modal-img").alt = product.title;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
};

document.getElementById("close-modal").addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" || e.key === "Esc") {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }
});

fetchProducts();