"use strict";

const STORAGE_KEY = "pless-finest-orders-v1";
const THEME_KEY = "pless-finest-theme";
const STATUS_LABELS = {
  new: "Nowe",
  production: "W produkcji",
  ready: "Gotowe",
  done: "Zakończone",
  cancelled: "Anulowane",
};
const PAYMENT_LABELS = { unpaid: "Nieopłacone", partial: "Zaliczka", paid: "Opłacone" };
const MODEL_DEFAULT_COLORS = {
  "Welcome to the Lustschloss": "burgund",
  "2 of Pless Most Wanted": "wolf grey",
  "Daisy Me Rollin": "black",
  "Eis Eis Baby": "white",
  "Mo Bisons Mo Problems": "mexican green",
  "Still Telemann": "ivory",
};
const COLOR_LABELS = {
  "burgund": "Burgund",
  "wolf grey": "Wolf Grey",
  "black": "Black",
  "white": "White",
  "mexican green": "Mexican Green",
  "ivory": "Ivory",
  "other": "Inny / custom",
};

const icons = {
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  moon: '<svg viewBox="0 0 24 24"><path d="M20.5 14.7A8.5 8.5 0 0 1 9.3 3.5 8.5 8.5 0 1 0 20.5 14.7Z"/></svg>',
  sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg>',
  spark: '<svg viewBox="0 0 24 24"><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></svg>',
  needle: '<svg viewBox="0 0 24 24"><path d="m4 20 9.5-9.5M14.5 9.5l2-2a2.12 2.12 0 0 0-3-3l-2 2M4 20l3.5-1 9-9M3 3c4 0 2 5 6 5"/></svg>',
  download: '<svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>',
  upload: '<svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5M5 21h14"/></svg>',
  backup: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  shirt: '<svg viewBox="0 0 24 24"><path d="m8 4-5 3 2 4 3-1v10h8V10l3 1 2-4-5-3a4 4 0 0 1-8 0Z"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  truck: '<svg viewBox="0 0 24 24"><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>',
  edit: '<svg viewBox="0 0 24 24"><path d="m14 5 5 5M4 20l3.5-.8L19 7.7A2.12 2.12 0 0 0 16.3 5L4.8 16.5 4 20Z"/></svg>',
};

document.querySelectorAll("[data-icon]").forEach((element) => {
  element.innerHTML = icons[element.dataset.icon] || "";
});

const sampleOrders = [
  {
    id: "PF-1042", createdAt: "2026-08-29T12:10:00.000Z", isSample: true,
    customer: { name: "Marta K.", phone: "+48 501 234 678", email: "", social: "@martak" },
    items: [{ model: "Daisy Me Rollin", size: "M", color: "black", quantity: 1, price: 119, isCustom: false, customPrint: "", customDetails: "" }],
    delivery: "pickup", shippingAddress: "", shippingCost: 0, status: "ready", payment: "paid", dueDate: "2026-09-01", notes: "Kontakt przez Instagram.",
  },
  {
    id: "PF-1041", createdAt: "2026-08-28T09:20:00.000Z", isSample: true,
    customer: { name: "Tomek S.", phone: "+48 608 444 210", email: "tomek@example.com", social: "" },
    items: [
      { model: "Mo Bisons Mo Problems", size: "L", color: "mexican green", quantity: 2, price: 119, isCustom: false, customPrint: "", customDetails: "" },
      { model: "Custom", size: "XL", color: "burgund", quantity: 1, price: 149, isCustom: true, customPrint: "Mały napis PLESS na piersi", customDetails: "Nadruk jasny beż" },
    ],
    delivery: "shipping", shippingAddress: "Paczkomat PSZ01M", shippingCost: 17.99, status: "production", payment: "partial", dueDate: "2026-09-05", notes: "Wysłać razem.",
  },
  {
    id: "PF-1040", createdAt: "2026-08-27T15:45:00.000Z", isSample: true,
    customer: { name: "Ola B.", phone: "+48 693 110 355", email: "", social: "@ola.b" },
    items: [{ model: "Welcome to the Lustschloss", size: "S", color: "burgund", quantity: 1, price: 119, isCustom: false, customPrint: "", customDetails: "" }],
    delivery: "pickup", shippingAddress: "", shippingCost: 0, status: "new", payment: "unpaid", dueDate: "", notes: "", 
  },
];

const state = {
  orders: loadOrders(),
  filter: "all",
  search: "",
  deleteId: null,
};

const els = {
  ordersList: document.querySelector("#ordersList"), emptyState: document.querySelector("#emptyState"), sampleNotice: document.querySelector("#sampleNotice"),
  modal: document.querySelector("#orderModal"), form: document.querySelector("#orderForm"), modalTitle: document.querySelector("#modalTitle"),
  itemsContainer: document.querySelector("#itemsContainer"), itemTemplate: document.querySelector("#itemTemplate"), shippingFields: document.querySelector("#shippingFields"),
  total: document.querySelector("#orderTotal"), formError: document.querySelector("#formError"), confirmModal: document.querySelector("#confirmModal"), toast: document.querySelector("#toast"),
};

function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.warn("Nie udało się odczytać danych", error);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleOrders));
  return structuredClone(sampleOrders);
}

function saveOrders() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.orders));
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function formatMoney(value) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(Number(value) || 0);
}

function orderTotal(order) {
  return order.items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0) + Number(order.shippingCost || 0);
}

function getNextId() {
  const numbers = state.orders.map((order) => Number(String(order.id).replace(/\D/g, ""))).filter(Number.isFinite);
  return `PF-${Math.max(1039, ...numbers) + 1}`;
}

function render() {
  const query = state.search.trim().toLocaleLowerCase("pl");
  const filtered = state.orders.filter((order) => {
    const statusMatch = state.filter === "all" || order.status === state.filter;
    const haystack = [order.id, order.customer.name, order.customer.phone, order.customer.email, order.customer.social, ...order.items.map((item) => `${item.model} ${item.size} ${item.color} ${item.customPrint}`)].join(" ").toLocaleLowerCase("pl");
    return statusMatch && (!query || haystack.includes(query));
  });

  els.ordersList.innerHTML = filtered.map(orderCardHtml).join("");
  els.emptyState.hidden = filtered.length > 0;
  els.ordersList.hidden = filtered.length === 0;
  els.sampleNotice.hidden = !state.orders.some((order) => order.isSample);
  renderStats();
}

function renderStats() {
  const active = state.orders.filter((order) => !["done", "cancelled"].includes(order.status));
  document.querySelector("#activeCount").textContent = active.length;
  document.querySelector("#activeCaption").textContent = active.length === 1 ? "aktywne zamówienie" : "aktywnych zamówień";
  document.querySelector("#pickupCount").textContent = state.orders.filter((order) => order.status === "ready" && order.delivery === "pickup").reduce((sum, order) => sum + order.items.reduce((n, item) => n + Number(item.quantity || 1), 0), 0);
  document.querySelector("#shippingCount").textContent = state.orders.filter((order) => order.delivery === "shipping" && !["done", "cancelled"].includes(order.status)).length;
  document.querySelector("#customCount").textContent = active.reduce((sum, order) => sum + order.items.filter((item) => item.isCustom).reduce((n, item) => n + Number(item.quantity || 1), 0), 0);
}

function orderCardHtml(order) {
  const itemCount = order.items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  const models = order.items.map((item) => `${item.quantity > 1 ? `${item.quantity}× ` : ""}${item.model} · ${COLOR_LABELS[item.color] || item.color || "bez koloru"} · ${item.size}`).join(" / ");
  const hasCustom = order.items.some((item) => item.isCustom);
  const deliveryLabel = order.delivery === "shipping" ? "Wysyłka" : "Odbiór";
  const deliveryDetail = order.delivery === "shipping" ? (order.shippingAddress || "Brak adresu") : "osobisty";
  return `
    <article class="order-card" data-id="${escapeHtml(order.id)}">
      <div class="order-number">#${escapeHtml(order.id.replace("PF-", ""))}</div>
      <div class="customer-cell">
        <strong>${escapeHtml(order.customer.name)}</strong>
        <span>${escapeHtml(order.customer.phone)}</span>
      </div>
      <div class="products-cell">
        <strong>${itemCount} ${itemCount === 1 ? "koszulka" : "koszulki"}</strong>
        <span title="${escapeHtml(models)}">${escapeHtml(models)}</span>
        ${hasCustom ? '<span class="custom-badge">CUSTOM</span>' : ""}
      </div>
      <div class="delivery-cell">
        <span data-icon="${order.delivery === "shipping" ? "truck" : "pin"}">${icons[order.delivery === "shipping" ? "truck" : "pin"]}</span>
        <div><strong>${deliveryLabel}</strong><small>${escapeHtml(deliveryDetail)}</small></div>
      </div>
      <div class="price-cell">
        <strong>${formatMoney(orderTotal(order))}</strong>
        <span>${PAYMENT_LABELS[order.payment] || "—"}</span>
      </div>
      <div class="status-cell">
        <span class="status-badge status-${escapeHtml(order.status)}">${STATUS_LABELS[order.status] || order.status}</span>
      </div>
      <div class="card-actions">
        <button class="icon-button edit-order" type="button" aria-label="Edytuj ${escapeHtml(order.id)}" title="Edytuj"><span data-icon="edit">${icons.edit}</span></button>
        <button class="icon-button delete-order" type="button" aria-label="Usuń ${escapeHtml(order.id)}" title="Usuń"><span data-icon="trash">${icons.trash}</span></button>
      </div>
    </article>`;
}

function openModal(order = null) {
  els.form.reset();
  document.querySelector("#orderId").value = order?.id || "";
  els.modalTitle.textContent = order ? `Edytuj ${order.id}` : "Nowe zamówienie";
  els.itemsContainer.innerHTML = "";
  clearValidation();

  if (order) {
    document.querySelector("#customerName").value = order.customer.name || "";
    document.querySelector("#phone").value = order.customer.phone || "";
    document.querySelector("#email").value = order.customer.email || "";
    document.querySelector("#social").value = order.customer.social || "";
    order.items.forEach((item) => addItem(item));
    const deliveryInput = document.querySelector(`input[name="delivery"][value="${order.delivery}"]`);
    if (deliveryInput) deliveryInput.checked = true;
    document.querySelector("#shippingAddress").value = order.shippingAddress || "";
    document.querySelector("#shippingCost").value = order.shippingCost || 0;
    document.querySelector("#status").value = order.status || "new";
    document.querySelector("#payment").value = order.payment || "unpaid";
    document.querySelector("#dueDate").value = order.dueDate || "";
    document.querySelector("#notes").value = order.notes || "";
  } else {
    addItem();
    document.querySelector("#status").value = "new";
    document.querySelector("#payment").value = "unpaid";
    document.querySelector('input[name="delivery"][value="pickup"]').checked = true;
  }
  toggleShipping();
  updateItemNumbers();
  updateTotal();
  els.modal.hidden = false;
  document.body.style.overflow = "hidden";
  setTimeout(() => document.querySelector("#customerName").focus(), 80);
}

function closeModal() {
  els.modal.hidden = true;
  document.body.style.overflow = "";
}

function addItem(data = {}) {
  const fragment = els.itemTemplate.content.cloneNode(true);
  const item = fragment.querySelector(".order-item-form");
  item.querySelector(".item-model").value = data.model || "";
  item.querySelector(".item-size").value = data.size || "";
  const colorSelect = item.querySelector(".item-color");
  const migratedColor = ({ "kremowy": "ivory", "czarny": "black", "bordowy": "burgund", "biały": "white" })[String(data.color || "").toLocaleLowerCase("pl")] || data.color || "";
  if (migratedColor && ![...colorSelect.options].some((option) => option.value === migratedColor)) {
    colorSelect.add(new Option(`${migratedColor} (wcześniej)`, migratedColor));
  }
  colorSelect.value = migratedColor;
  item.querySelector(".item-quantity").value = data.quantity || 1;
  item.querySelector(".item-price").value = data.price ?? 0;
  item.querySelector(".item-custom-toggle").checked = Boolean(data.isCustom);
  item.querySelector(".item-custom-print").value = data.customPrint || "";
  item.querySelector(".item-custom-details").value = data.customDetails || "";
  item.querySelector(".custom-fields").hidden = !data.isCustom;
  updateColorHint(item);
  item.querySelectorAll("[data-icon]").forEach((el) => { el.innerHTML = icons[el.dataset.icon] || ""; });
  els.itemsContainer.appendChild(fragment);
  updateItemNumbers();
  updateTotal();
}

function updateColorHint(item) {
  const model = item.querySelector(".item-model").value;
  const standardColor = MODEL_DEFAULT_COLORS[model];
  const hint = item.querySelector(".color-hint");
  hint.textContent = standardColor ? `Standard dla tego modelu: ${COLOR_LABELS[standardColor]}. Możesz wybrać inny.` : "Wybierz jeden z kolorów lub opcję custom.";
}

function updateItemNumbers() {
  const items = [...els.itemsContainer.querySelectorAll(".order-item-form")];
  items.forEach((item, index) => {
    item.querySelector(".item-number").textContent = index + 1;
    item.querySelector(".remove-item-btn").hidden = items.length === 1;
  });
}

function toggleShipping() {
  const isShipping = document.querySelector('input[name="delivery"]:checked').value === "shipping";
  els.shippingFields.hidden = !isShipping;
  document.querySelector("#shippingAddress").required = isShipping;
  updateTotal();
}

function updateTotal() {
  const itemSum = [...els.itemsContainer.querySelectorAll(".order-item-form")].reduce((sum, item) => {
    return sum + (Number(item.querySelector(".item-price").value) || 0) * (Number(item.querySelector(".item-quantity").value) || 1);
  }, 0);
  const shipping = document.querySelector('input[name="delivery"]:checked')?.value === "shipping" ? Number(document.querySelector("#shippingCost").value) || 0 : 0;
  els.total.textContent = formatMoney(itemSum + shipping);
}

function readForm() {
  return {
    id: document.querySelector("#orderId").value || getNextId(),
    createdAt: state.orders.find((order) => order.id === document.querySelector("#orderId").value)?.createdAt || new Date().toISOString(),
    isSample: false,
    customer: {
      name: document.querySelector("#customerName").value.trim(),
      phone: document.querySelector("#phone").value.trim(),
      email: document.querySelector("#email").value.trim(),
      social: document.querySelector("#social").value.trim(),
    },
    items: [...els.itemsContainer.querySelectorAll(".order-item-form")].map((item) => ({
      model: item.querySelector(".item-model").value,
      size: item.querySelector(".item-size").value,
      color: item.querySelector(".item-color").value,
      quantity: Math.max(1, Number(item.querySelector(".item-quantity").value) || 1),
      price: Math.max(0, Number(item.querySelector(".item-price").value) || 0),
      isCustom: item.querySelector(".item-custom-toggle").checked,
      customPrint: item.querySelector(".item-custom-print").value.trim(),
      customDetails: item.querySelector(".item-custom-details").value.trim(),
    })),
    delivery: document.querySelector('input[name="delivery"]:checked').value,
    shippingAddress: document.querySelector("#shippingAddress").value.trim(),
    shippingCost: document.querySelector('input[name="delivery"]:checked').value === "shipping" ? Math.max(0, Number(document.querySelector("#shippingCost").value) || 0) : 0,
    status: document.querySelector("#status").value,
    payment: document.querySelector("#payment").value,
    dueDate: document.querySelector("#dueDate").value,
    notes: document.querySelector("#notes").value.trim(),
  };
}

function validateForm() {
  clearValidation();
  const invalid = [];
  [document.querySelector("#customerName"), document.querySelector("#phone")].forEach((input) => { if (!input.value.trim()) invalid.push(input); });
  const email = document.querySelector("#email");
  if (email.value && !email.validity.valid) invalid.push(email);
  if (document.querySelector('input[name="delivery"]:checked').value === "shipping" && !document.querySelector("#shippingAddress").value.trim()) invalid.push(document.querySelector("#shippingAddress"));
  els.itemsContainer.querySelectorAll(".order-item-form").forEach((item) => {
    [item.querySelector(".item-model"), item.querySelector(".item-size"), item.querySelector(".item-color")].forEach((input) => { if (!input.value) invalid.push(input); });
    if (item.querySelector(".item-custom-toggle").checked && !item.querySelector(".item-custom-print").value.trim()) invalid.push(item.querySelector(".item-custom-print"));
  });
  invalid.forEach((input) => input.closest(".field")?.classList.add("is-invalid"));
  els.formError.hidden = invalid.length === 0;
  invalid[0]?.focus();
  return invalid.length === 0;
}

function clearValidation() {
  document.querySelectorAll(".field.is-invalid").forEach((field) => field.classList.remove("is-invalid"));
  els.formError.hidden = true;
}

function deleteOrder(id) {
  state.deleteId = id;
  els.confirmModal.hidden = false;
}

function exportJson() {
  const blob = new Blob([JSON.stringify({ app: "Pless Finest Orders", version: 1, exportedAt: new Date().toISOString(), orders: state.orders }, null, 2)], { type: "application/json" });
  downloadBlob(blob, `pless-finest-zamowienia-${new Date().toISOString().slice(0, 10)}.json`);
  showToast("Kopia danych została pobrana.");
}

function downloadCsv() {
  const header = ["Numer", "Data", "Klient", "Telefon", "E-mail", "Kontakt", "Modele", "Sztuki", "Custom", "Odbiór", "Adres", "Status", "Płatność", "Termin", "Wartość", "Notatki"];
  const rows = state.orders.map((order) => [
    order.id, order.createdAt.slice(0, 10), order.customer.name, order.customer.phone, order.customer.email, order.customer.social,
    order.items.map((item) => `${item.model} (${item.size}, ${item.color || "—"}) x${item.quantity}${item.isCustom ? ` CUSTOM: ${item.customPrint}` : ""}`).join(" | "),
    order.items.reduce((sum, item) => sum + Number(item.quantity || 1), 0), order.items.some((item) => item.isCustom) ? "Tak" : "Nie",
    order.delivery === "shipping" ? "Wysyłka" : "Odbiór własny", order.shippingAddress, STATUS_LABELS[order.status], PAYMENT_LABELS[order.payment], order.dueDate, orderTotal(order), order.notes,
  ]);
  const csv = "\uFEFF" + [header, ...rows].map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(";")).join("\r\n");
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `pless-finest-zamowienia-${new Date().toISOString().slice(0, 10)}.csv`);
  showToast("Eksport CSV został pobrany.");
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a"); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const orders = Array.isArray(parsed) ? parsed : parsed.orders;
      if (!Array.isArray(orders)) throw new Error("Nieprawidłowy format");
      state.orders = orders;
      saveOrders(); render(); showToast(`Zaimportowano ${orders.length} zamówień.`);
    } catch (error) {
      showToast("Nie udało się wczytać pliku.");
    }
  };
  reader.readAsText(file);
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer); els.toast.textContent = message; els.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => els.toast.classList.remove("is-visible"), 2800);
}

document.querySelector("#newOrderBtn").addEventListener("click", () => openModal());
document.querySelector("#emptyAddBtn").addEventListener("click", () => openModal());
document.querySelector("#closeModalBtn").addEventListener("click", closeModal);
document.querySelector("#cancelBtn").addEventListener("click", closeModal);
document.querySelector("#addItemBtn").addEventListener("click", () => addItem());
document.querySelectorAll('input[name="delivery"]').forEach((input) => input.addEventListener("change", toggleShipping));

els.itemsContainer.addEventListener("change", (event) => {
  const item = event.target.closest(".order-item-form");
  if (!item) return;
  if (event.target.matches(".item-model")) {
    const standardColor = MODEL_DEFAULT_COLORS[event.target.value];
    if (standardColor) item.querySelector(".item-color").value = standardColor;
    updateColorHint(item);
    if (event.target.value === "Custom") {
      item.querySelector(".item-custom-toggle").checked = true;
      item.querySelector(".custom-fields").hidden = false;
    }
  }
  if (event.target.matches(".item-color") && event.target.value === "other") {
    item.querySelector(".item-custom-toggle").checked = true;
    item.querySelector(".custom-fields").hidden = false;
  }
  if (event.target.matches(".item-custom-toggle")) item.querySelector(".custom-fields").hidden = !event.target.checked;
  updateTotal();
});
els.itemsContainer.addEventListener("input", updateTotal);
els.itemsContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".remove-item-btn");
  if (!button) return;
  button.closest(".order-item-form").remove(); updateItemNumbers(); updateTotal();
});
document.querySelector("#shippingCost").addEventListener("input", updateTotal);

els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateForm()) return;
  const order = readForm();
  const index = state.orders.findIndex((existing) => existing.id === order.id);
  if (index >= 0) state.orders[index] = order; else state.orders.unshift(order);
  saveOrders(); render(); closeModal(); showToast(index >= 0 ? "Zamówienie zaktualizowane." : `${order.id} zapisane.`);
});

els.ordersList.addEventListener("click", (event) => {
  const card = event.target.closest(".order-card"); if (!card) return;
  const order = state.orders.find((item) => item.id === card.dataset.id);
  if (event.target.closest(".edit-order")) openModal(order);
  if (event.target.closest(".delete-order")) deleteOrder(card.dataset.id);
});

document.querySelectorAll(".filter-tab").forEach((button) => button.addEventListener("click", () => {
  state.filter = button.dataset.filter;
  document.querySelectorAll(".filter-tab").forEach((tab) => tab.classList.toggle("is-active", tab === button)); render();
}));
document.querySelector("#searchInput").addEventListener("input", (event) => { state.search = event.target.value; render(); });
document.querySelector("#clearSamplesBtn").addEventListener("click", () => {
  state.orders = state.orders.filter((order) => !order.isSample); saveOrders(); render(); showToast("Dane przykładowe usunięte.");
});

document.querySelector("#confirmCancel").addEventListener("click", () => { state.deleteId = null; els.confirmModal.hidden = true; });
document.querySelector("#confirmDelete").addEventListener("click", () => {
  state.orders = state.orders.filter((order) => order.id !== state.deleteId); state.deleteId = null; saveOrders(); render(); els.confirmModal.hidden = true; showToast("Zamówienie usunięte.");
});

document.querySelector("#exportBtn").addEventListener("click", downloadCsv);
document.querySelector("#backupBtn").addEventListener("click", exportJson);
document.querySelector("#importBtn").addEventListener("click", () => document.querySelector("#importInput").click());
document.querySelector("#importInput").addEventListener("change", (event) => { if (event.target.files[0]) importJson(event.target.files[0]); event.target.value = ""; });

els.modal.addEventListener("click", (event) => { if (event.target === els.modal) closeModal(); });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") { if (!els.confirmModal.hidden) els.confirmModal.hidden = true; else if (!els.modal.hidden) closeModal(); }
});

const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme === "dark" || (!savedTheme && matchMedia("(prefers-color-scheme: dark)").matches)) document.documentElement.dataset.theme = "dark";
function updateThemeIcon() {
  const dark = document.documentElement.dataset.theme === "dark";
  document.querySelector("#themeToggle [data-icon]").innerHTML = dark ? icons.sun : icons.moon;
}
document.querySelector("#themeToggle").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next; localStorage.setItem(THEME_KEY, next); updateThemeIcon();
});

document.querySelector("#year").textContent = new Date().getFullYear();
updateThemeIcon();
render();
