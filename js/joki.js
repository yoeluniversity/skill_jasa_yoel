const jokiServices = [
  { id: 1, name: "Warrior", type: "Joki Biasa", price: 1000 },
  { id: 2, name: "Elite", type: "Joki Biasa", price: 2000 },
  { id: 3, name: "Master", type: "Joki Biasa", price: 3000 },
  { id: 4, name: "Grandmaster", type: "Joki Biasa", price: 4000 },
  { id: 5, name: "Epic", type: "Joki Biasa", price: 5000 },
  { id: 6, name: "Legend", type: "Joki Biasa", price: 6000 },
  { id: 7, name: "Mythic", type: "Joki Biasa", price: 10000 },
  { id: 8, name: "Honor", type: "Joki Biasa", price: 12000 },
  { id: 9, name: "Glory", type: "Joki Biasa", price: 16000 },
  { id: 10, name: "Immortal", type: "Joki Biasa", price: 20000 },

  { id: 11, name: "Warrior", type: "Joki Mabar", price: 1000 },
  { id: 12, name: "Elite", type: "Joki Mabar", price: 1500 },
  { id: 13, name: "Master", type: "Joki Mabar", price: 2000 },
  { id: 14, name: "Grandmaster", type: "Joki Mabar", price: 2500 },
  { id: 15, name: "Epic", type: "Joki Mabar", price: 3000 },
  { id: 16, name: "Legend", type: "Joki Mabar", price: 4000 },
  { id: 17, name: "Mythic", type: "Joki Mabar", price: 6000 },
  { id: 18, name: "Honor", type: "Joki Mabar", price: 8000 },
  { id: 19, name: "Glory", type: "Joki Mabar", price: 11000 },
  { id: 20, name: "Immortal", type: "Joki Mabar", price: 17000 },
];

const JOKI_CART_STORAGE_KEY = "yoel_joki_cart";

function getCart() {
  const data = localStorage.getItem(JOKI_CART_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem(JOKI_CART_STORAGE_KEY, JSON.stringify(cart));
  renderCart();
}

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}

function addToCart(serviceId) {
  const service = jokiServices.find((s) => s.id === serviceId);
  if (!service) return;

  const cart = getCart();
  const existingItem = cart.find((item) => item.id === serviceId);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...service, qty: 1 });
  }

  saveCart(cart);
}

function updateQty(serviceId, change) {
  let cart = getCart();
  const item = cart.find((i) => i.id === serviceId);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== serviceId);
  }

  saveCart(cart);
}

function removeFromCart(serviceId) {
  let cart = getCart();
  cart = cart.filter((i) => i.id !== serviceId);
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function checkoutWhatsApp() {
  const cart = getCart();
  if (cart.length === 0) {
    alert(
      "Keranjang Joki Anda masih kosong. Silakan pilih paket rank terlebih dahulu!",
    );
    return;
  }

  let message =
    "Halo Yoel! Saya tertarik untuk memesan jasa Joki MLBB Anda:\n\n";
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    message += `${index + 1}. *Rank ${item.name}* [${item.type}] - ${item.qty} ⭐ (${formatRupiah(item.price)}/⭐) = ${formatRupiah(subtotal)}\n`;
  });

  message += `\n*Total Estimasi:* ${formatRupiah(total)}\n\n`;
  message +=
    "Bisa tolong informasikan ketersediaan jadwal & slot joki? Terima kasih!";

  const phone = "6285255789839";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function renderCart() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const cartCountBadge = document.getElementById("cartCountBadge");
  const floatingCartBadge = document.getElementById("floatingCartBadge");
  if (cartCountBadge) cartCountBadge.textContent = totalCount;
  if (floatingCartBadge) floatingCartBadge.textContent = totalCount;

  const tbody = document.getElementById("cartTableBody");
  const emptyMsg = document.getElementById("emptyCartMessage");
  const totalPriceEl = document.getElementById("cartTotalPrice");

  if (totalPriceEl) totalPriceEl.textContent = formatRupiah(totalPrice);

  if (tbody) {
    if (cart.length === 0) {
      tbody.innerHTML = "";
      if (emptyMsg) emptyMsg.style.display = "block";
    } else {
      if (emptyMsg) emptyMsg.style.display = "none";
      tbody.innerHTML = cart
        .map(
          (item) => `
        <tr>
          <td>
            <div class="fw-bold text-white fs-6">Rank ${item.name}</div>
            <div class="d-flex align-items-center gap-1 mt-1 flex-wrap">
              <span class="badge ${item.type === "Joki Mabar" ? "bg-purple-gaming text-white" : "bg-cyan-gaming text-dark"}">${item.type}</span>
              <span class="d-sm-none text-secondary-gaming small">(${formatRupiah(item.price)}/⭐)</span>
            </div>
          </td>
          <td class="text-nowrap text-secondary-gaming d-none d-sm-table-cell">${formatRupiah(item.price)} <small class="text-warning">/⭐</small></td>
          <td class="text-center">
            <div class="btn-group btn-group-sm" role="group">
              <button class="btn btn-gaming-counter btn-decrease" data-id="${item.id}">-</button>
              <span class="btn btn-gaming-counter disabled fw-bold px-2">${item.qty} ⭐</span>
              <button class="btn btn-gaming-counter btn-increase" data-id="${item.id}">+</button>
            </div>
          </td>
          <td class="fw-bold text-cyan-gaming text-nowrap">${formatRupiah(item.price * item.qty)}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-link text-danger p-0 btn-remove text-decoration-none" data-id="${item.id}" title="Hapus">
              <span class="d-none d-sm-inline">✕ Hapus</span>
              <span class="d-sm-none fw-bold fs-6">✕</span>
            </button>
          </td>
        </tr>
      `,
        )
        .join("");
    }
  }

  const modalContent = document.getElementById("modalCartContent");
  const modalTotalPrice = document.getElementById("modalTotalPrice");
  if (modalTotalPrice) modalTotalPrice.textContent = formatRupiah(totalPrice);

  if (modalContent) {
    if (cart.length === 0) {
      modalContent.innerHTML = `<p class="text-white text-center py-4 mb-0 fw-semibold" style="color: #ffffff !important;">Keranjang joki masih kosong.</p>`;
    } else {
      modalContent.innerHTML = `
        <div class="list-group list-group-flush">
          ${cart
            .map(
              (item) => `
            <div class="list-group-item d-flex justify-content-between align-items-center px-0 py-3 bg-transparent border-secondary-gaming">
              <div>
                <h6 class="mb-1 fw-bold text-white">${item.icon} Rank ${item.name} <small class="badge bg-secondary ms-1">${item.type}</small></h6>
                <div class="text-muted small">${formatRupiah(item.price)} x ${item.qty} ⭐ = <strong class="text-cyan-gaming">${formatRupiah(item.price * item.qty)}</strong></div>
              </div>
              <div class="d-flex align-items-center gap-2">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-light btn-decrease" data-id="${item.id}">-</button>
                  <button class="btn btn-outline-light disabled text-white fw-bold">${item.qty} ⭐</button>
                  <button class="btn btn-outline-light btn-increase" data-id="${item.id}">+</button>
                </div>
                <button class="btn btn-sm btn-outline-danger btn-remove" data-id="${item.id}">✕</button>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      `;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".btn-gaming-add, .btn-add-cart");
    if (addBtn && addBtn.hasAttribute("data-id")) {
      const id = parseInt(addBtn.getAttribute("data-id"));
      if (!isNaN(id)) {
        addToCart(id);

        const originalText = addBtn.innerHTML;
        addBtn.innerHTML = "✓ Ditambahkan!";
        addBtn.classList.add("btn-added-active");
        setTimeout(() => {
          addBtn.innerHTML = originalText;
          addBtn.classList.remove("btn-added-active");
        }, 800);
      }
      return;
    }

    const increaseBtn = e.target.closest(".btn-increase");
    if (increaseBtn) {
      const id = parseInt(increaseBtn.getAttribute("data-id"));
      updateQty(id, 1);
      return;
    }

    const decreaseBtn = e.target.closest(".btn-decrease");
    if (decreaseBtn) {
      const id = parseInt(decreaseBtn.getAttribute("data-id"));
      updateQty(id, -1);
      return;
    }

    const removeBtn = e.target.closest(".btn-remove");
    if (removeBtn) {
      const id = parseInt(removeBtn.getAttribute("data-id"));
      removeFromCart(id);
      return;
    }
  });

  const btnClear = document.getElementById("btnClearCart");
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      if (confirm("Apakah Anda yakin ingin mengosongkan keranjang joki?")) {
        clearCart();
      }
    });
  }

  const btnCheckoutWA = document.getElementById("btnCheckoutWA");
  if (btnCheckoutWA) {
    btnCheckoutWA.addEventListener("click", checkoutWhatsApp);
  }

  const btnModalCheckoutWA = document.getElementById("btnModalCheckoutWA");
  if (btnModalCheckoutWA) {
    btnModalCheckoutWA.addEventListener("click", checkoutWhatsApp);
  }
});
