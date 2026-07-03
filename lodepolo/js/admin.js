// ============================================================
// Lógica del panel del dueño (admin.html)
// ============================================================

let allItems = [];
let editingItemId = null; // null = nuevo item

const loginBox = document.getElementById("login-box");
const adminContent = document.getElementById("admin-content");
const loginError = document.getElementById("login-error");

// ---- Autenticación ----
auth.onAuthStateChanged((user) => {
  if (user) {
    loginBox.style.display = "none";
    adminContent.style.display = "block";
    startListening();
  } else {
    loginBox.style.display = "block";
    adminContent.style.display = "none";
  }
});

document.getElementById("login-btn").onclick = () => {
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value;
  loginError.style.display = "none";

  auth.signInWithEmailAndPassword(email, pass).catch((err) => {
    loginError.textContent = traducirErrorAuth(err.code);
    loginError.style.display = "block";
  });
};

document.getElementById("logout-btn").onclick = () => {
  auth.signOut();
};

function traducirErrorAuth(code) {
  const map = {
    "auth/invalid-email": "Ese email no es válido.",
    "auth/user-not-found": "No existe un usuario con ese email.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/invalid-credential": "Email o contraseña incorrectos.",
    "auth/too-many-requests": "Demasiados intentos. Probá de nuevo en un rato.",
  };
  return map[code] || "No se pudo iniciar sesión. Revisá tus datos.";
}

// ---- Escuchar datos una vez logueado ----
let unsubItems = null;
let unsubSettings = null;

function startListening() {
  if (unsubItems) return; // ya escuchando

  unsubItems = db.collection("menu").orderBy("category").onSnapshot((snapshot) => {
    allItems = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    document.getElementById("seed-panel").style.display = allItems.length === 0 ? "block" : "none";
    document.getElementById("items-count").textContent = `Platos (${allItems.length})`;
    renderItemsList();
    renderCategoryOptions();
  });

  unsubSettings = db.collection("config").doc("settings").onSnapshot((doc) => {
    const s = doc.exists ? { ...DEFAULT_SETTINGS, ...doc.data() } : DEFAULT_SETTINGS;
    document.getElementById("s-name").value = s.businessName;
    document.getElementById("s-tagline").value = s.tagline;
    document.getElementById("s-whatsapp").value = s.whatsapp;
    document.getElementById("s-instagram").value = s.instagram;
    document.getElementById("s-hours").value = s.hours;
  });
}

// ---- Seed inicial ----
document.getElementById("seed-btn").onclick = async () => {
  const btn = document.getElementById("seed-btn");
  btn.disabled = true;
  btn.textContent = "Cargando...";
  try {
    const batch = db.batch();
    DEFAULT_ITEMS.forEach((item) => {
      const ref = db.collection("menu").doc();
      batch.set(ref, item);
    });
    const settingsRef = db.collection("config").doc("settings");
    batch.set(settingsRef, DEFAULT_SETTINGS, { merge: true });
    await batch.commit();
    showToast("Menú inicial cargado ✓");
  } catch (e) {
    showToast("Error al cargar el menú: " + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Cargar menú inicial";
  }
};

// ---- Ajustes del negocio ----
document.getElementById("toggle-settings").onclick = () => {
  const form = document.getElementById("settings-form");
  form.style.display = form.style.display === "none" ? "block" : "none";
};

document.getElementById("save-settings-btn").onclick = async () => {
  const data = {
    businessName: document.getElementById("s-name").value.trim(),
    tagline: document.getElementById("s-tagline").value.trim(),
    whatsapp: document.getElementById("s-whatsapp").value.trim(),
    instagram: document.getElementById("s-instagram").value.trim(),
    hours: document.getElementById("s-hours").value.trim(),
  };
  try {
    await db.collection("config").doc("settings").set(data, { merge: true });
    showToast("Datos guardados ✓");
  } catch (e) {
    showToast("Error al guardar: " + e.message);
  }
};

// ---- Lista de platos ----
function renderItemsList() {
  const list = document.getElementById("items-list");
  if (allItems.length === 0) {
    list.innerHTML = '<p class="hint-text">Todavía no hay platos cargados.</p>';
    return;
  }
  list.innerHTML = allItems.map((item) => `
    <div class="admin-item-row ${item.available === false ? "unavailable" : ""}">
      ${item.imageUrl ? `<img class="thumb" src="${escapeHtml(item.imageUrl)}" alt="">` : `<div class="thumb"></div>`}
      <div class="info">
        <div class="name">${escapeHtml(item.name)}</div>
        <div class="meta">${currency(item.price)} · ${escapeHtml(item.category)}</div>
      </div>
      <button class="icon-btn" onclick="toggleAvailable('${item.id}')" title="Marcar disponible / sin stock">
        ${item.available === false ? "🚫" : "👁️"}
      </button>
      <button class="icon-btn" onclick="openEditItem('${item.id}')" title="Editar">✏️</button>
    </div>
  `).join("");
}

function renderCategoryOptions() {
  const cats = Array.from(new Set(allItems.map((i) => i.category)));
  document.getElementById("category-options").innerHTML = cats.map((c) => `<option value="${escapeHtml(c)}">`).join("");
}

async function toggleAvailable(id) {
  const item = allItems.find((i) => i.id === id);
  if (!item) return;
  try {
    await db.collection("menu").doc(id).update({ available: item.available === false });
  } catch (e) {
    showToast("Error: " + e.message);
  }
}

// ---- Modal de edición / creación ----
const itemModal = document.getElementById("item-modal");
const itemModalError = document.getElementById("item-modal-error");

document.getElementById("new-item-btn").onclick = () => openNewItem();

function openNewItem() {
  editingItemId = null;
  document.getElementById("item-modal-title").textContent = "Nuevo plato";
  document.getElementById("i-name").value = "";
  document.getElementById("i-description").value = "";
  document.getElementById("i-price").value = "";
  document.getElementById("i-imageurl").value = "";
  document.getElementById("i-category").value = "";
  document.getElementById("i-available").checked = true;
  document.getElementById("delete-item-btn").style.display = "none";
  itemModalError.style.display = "none";
  itemModal.style.display = "flex";
}

function openEditItem(id) {
  const item = allItems.find((i) => i.id === id);
  if (!item) return;
  editingItemId = id;
  document.getElementById("item-modal-title").textContent = "Editar plato";
  document.getElementById("i-name").value = item.name;
  document.getElementById("i-description").value = item.description || "";
  document.getElementById("i-price").value = item.price;
  document.getElementById("i-imageurl").value = item.imageUrl || "";
  document.getElementById("i-category").value = item.category;
  document.getElementById("i-available").checked = item.available !== false;
  document.getElementById("delete-item-btn").style.display = "inline-block";
  itemModalError.style.display = "none";
  itemModal.style.display = "flex";
}

document.getElementById("cancel-item-btn").onclick = () => { itemModal.style.display = "none"; };

document.getElementById("save-item-btn").onclick = async () => {
  const name = document.getElementById("i-name").value.trim();
  const category = document.getElementById("i-category").value.trim();
  const price = Number(document.getElementById("i-price").value) || 0;
  const imageUrl = document.getElementById("i-imageurl").value.trim();
  const description = document.getElementById("i-description").value.trim();
  const available = document.getElementById("i-available").checked;

  if (!name || !category) {
    itemModalError.textContent = "El nombre y la categoría son obligatorios.";
    itemModalError.style.display = "block";
    return;
  }

  const data = { name, category, price, description, available, imageUrl };

  try {
    if (editingItemId) {
      await db.collection("menu").doc(editingItemId).update(data);
    } else {
      await db.collection("menu").add(data);
    }
    itemModal.style.display = "none";
    showToast("Guardado ✓");
  } catch (e) {
    itemModalError.textContent = "Error al guardar: " + e.message;
    itemModalError.style.display = "block";
  }
};

document.getElementById("delete-item-btn").onclick = async () => {
  if (!editingItemId) return;
  if (!confirm("¿Borrar este plato del menú?")) return;
  try {
    await db.collection("menu").doc(editingItemId).delete();
    itemModal.style.display = "none";
    showToast("Plato borrado ✓");
  } catch (e) {
    itemModalError.textContent = "Error al borrar: " + e.message;
    itemModalError.style.display = "block";
  }
};

// ---- Utilidades ----
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 2500);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}
