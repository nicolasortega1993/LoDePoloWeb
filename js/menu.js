// ============================================================
// Lógica de la página pública del menú (index.html)
// ============================================================

let allItems = [];
let settings = DEFAULT_SETTINGS;
let cart = {}; // { itemId: qty }
let activeCategory = "Todos";

const itemsEl = document.getElementById("items");
const categoriesEl = document.getElementById("categories");
const cartBarWrap = document.getElementById("cart-bar-wrap");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");

// ---- Cargar datos del negocio en tiempo real ----
db.collection("config").doc("settings").onSnapshot((doc) => {
  if (doc.exists) {
    settings = { ...DEFAULT_SETTINGS, ...doc.data() };
    document.getElementById("business-name").textContent = settings.businessName;
    document.getElementById("business-tagline").textContent = settings.tagline;
    document.getElementById("business-hours").textContent = settings.hours;
    document.title = settings.businessName + " - Menú";
  }
}, (err) => {
  console.error("No se pudo leer la configuración:", err);
});

// ---- Cargar platos en tiempo real ----
db.collection("menu").orderBy("category").onSnapshot((snapshot) => {
  allItems = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  renderCategories();
  renderItems();
}, (err) => {
  console.error("No se pudo leer el menú:", err);
  itemsEl.innerHTML = '<div class="empty-note">No se pudo cargar el menú. Probá recargar la página.</div>';
});

function renderCategories() {
  const cats = ["Todos", ...Array.from(new Set(allItems.map((i) => i.category)))];
  categoriesEl.innerHTML = "";
  cats.forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "cat-chip" + (c === activeCategory ? " active" : "");
    btn.textContent = c;
    btn.onclick = () => { activeCategory = c; renderCategories(); renderItems(); };
    categoriesEl.appendChild(btn);
  });
}

function renderItems() {
  const visible = allItems.filter((i) => i.available !== false && (activeCategory === "Todos" || i.category === activeCategory));

  if (visible.length === 0) {
    itemsEl.innerHTML = '<div class="empty-note">No hay platos disponibles en esta categoría por ahora.</div>';
    updateCartBar();
    return;
  }

  // Agrupar por categoría solo cuando se ven "Todos"
  let html = "";
  let lastCategory = null;
  visible.forEach((item) => {
    if (activeCategory === "Todos" && item.category !== lastCategory) {
      html += `<div class="category-heading">${escapeHtml(item.category)}</div>`;
      lastCategory = item.category;
    }
    const qty = cart[item.id] || 0;
    const photoHtml = item.imageUrl
      ? `<div class="item-photo"><img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" loading="lazy"></div>`
      : `<div class="item-photo placeholder" title="Foto próximamente">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 20H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2Z"/>
            <circle cx="12" cy="12" r="3.5"/>
          </svg>
        </div>`;
    html += `
      <div class="item-card">
        ${photoHtml}
        <div class="item-info">
          <div class="item-name">${escapeHtml(item.name)}</div>
          ${item.description ? `<div class="item-desc">${escapeHtml(item.description)}</div>` : ""}
          <div class="item-price">${currency(item.price)}</div>
        </div>
        <div class="qty-controls">
          ${qty === 0
            ? `<button class="qty-btn add" onclick="changeQty('${item.id}', 1)" aria-label="Agregar">+</button>`
            : `
              <button class="qty-btn remove" onclick="changeQty('${item.id}', -1)" aria-label="Quitar">-</button>
              <span class="qty-value">${qty}</span>
              <button class="qty-btn add" onclick="changeQty('${item.id}', 1)" aria-label="Agregar">+</button>
            `}
        </div>
      </div>
    `;
  });
  itemsEl.innerHTML = html;
  updateCartBar();
}

function changeQty(id, delta) {
  const next = (cart[id] || 0) + delta;
  if (next <= 0) delete cart[id];
  else cart[id] = next;
  renderItems();
}

function getCartLines() {
  return Object.entries(cart)
    .map(([id, qty]) => ({ item: allItems.find((i) => i.id === id), qty }))
    .filter((l) => l.item && l.qty > 0);
}

function updateCartBar() {
  const lines = getCartLines();
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + (l.item.price || 0) * l.qty, 0);
  if (count === 0) {
    cartBarWrap.style.display = "none";
    return;
  }
  cartBarWrap.style.display = "flex";
  cartCountEl.textContent = `${count} ${count === 1 ? "producto" : "productos"}`;
  cartTotalEl.textContent = currency(total);
}

// ---- Modal de datos del cliente ----
const orderModal = document.getElementById("order-modal");
const orderFormError = document.getElementById("order-form-error");

document.getElementById("open-order-form").onclick = () => {
  orderFormError.style.display = "none";
  orderModal.style.display = "flex";
};

document.getElementById("cancel-order").onclick = () => {
  orderModal.style.display = "none";
};

document.getElementById("confirm-order").onclick = () => {
  const name = document.getElementById("customer-name").value.trim();
  const address = document.getElementById("customer-address").value.trim();

  if (!name || !address) {
    orderFormError.textContent = "Completá tu nombre y dirección para continuar.";
    orderFormError.style.display = "block";
    return;
  }

  sendWhatsAppOrder(name, address);
  orderModal.style.display = "none";
};

function sendWhatsAppOrder(name, address) {
  const lines = getCartLines();
  if (lines.length === 0) return;

  const total = lines.reduce((s, l) => s + (l.item.price || 0) * l.qty, 0);

  let text = `Hola! Soy ${name}.\n`;
  text += `Quiero pedir:\n`;
  lines.forEach((l) => {
    text += `- ${l.qty}x ${l.item.name} (${currency(l.item.price * l.qty)})\n`;
  });
  text += `\nDirección de entrega: ${address}\n`;
  text += `\nTotal: ${currency(total)}`;

  const phone = (settings.whatsapp || "").replace(/[^\d]/g, "");
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}
