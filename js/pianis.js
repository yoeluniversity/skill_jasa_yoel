const services = [
  {
    id: 1,
    name: "Paket Pernikahan",
    price: 800000,
    desc: "Pengiring prosesi pernikahan: Resepsi, welcoming guests, dan lagu romantis pilihan mempelai (bisa request instrumen).",
  },
  {
    id: 2,
    name: "Pelayanan Ibadah",
    price: 500000,
    desc: "Pengiring ibadah raya, KKR (Kebaktian Kebangunan Rohani), dan choir / paduan suara rohani.",
  },
  {
    id: 3,
    name: "Event & Gathering",
    price: 700000,
    desc: "Musik pengiring makan malam, ulang tahun, dan acara perayaan wilayah.",
  },
  {
    id: 4,
    name: "Instrumen Cafe",
    price: 500000,
    desc: "Instrumen yang menghadirkan rasa nyaman dan santai untuk pengunjung cafe.",
  },
];

const CART_STORAGE_KEY = "yoel_pianis_cart";

function getCart() {
  const data = localStorage.getItem(CART_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
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
  const service = services.find((s) => s.id === serviceId);
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
      "Keranjang Anda masih kosong. Silakan pilih paket layanan terlebih dahulu!",
    );
    return;
  }

  let message = "Halo Yoel! Saya tertarik untuk memesan jasa pianis Anda:\n\n";
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    message += `${index + 1}. *${item.name}* (x${item.qty}) - ${formatRupiah(subtotal)}\n`;
  });

  message += `\n*Total Estimasi:* ${formatRupiah(total)}\n\n`;
  message += "Bisa tolong informasikan ketersediaan jadwalnya? Terima kasih!";

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
          <td><strong>${item.name}</strong></td>
          <td>${formatRupiah(item.price)}</td>
          <td class="text-center">
            <div class="btn-group btn-group-sm" role="group">
              <button class="btn btn-outline-secondary btn-decrease" data-id="${item.id}">-</button>
              <span class="btn btn-outline-secondary disabled text-dark fw-bold px-3">${item.qty}</span>
              <button class="btn btn-outline-secondary btn-increase" data-id="${item.id}">+</button>
            </div>
          </td>
          <td>${formatRupiah(item.price * item.qty)}</td>
          <td>
            <button class="btn btn-sm btn-link text-danger p-0 btn-remove" data-id="${item.id}">
              Hapus
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
      modalContent.innerHTML = `<p class="text-muted text-center py-4 mb-0">Keranjang masih kosong.</p>`;
    } else {
      modalContent.innerHTML = `
        <div class="list-group list-group-flush">
          ${cart
            .map(
              (item) => `
            <div class="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
              <div>
                <h6 class="mb-1 fw-bold">${item.name}</h6>
                <div class="text-muted small">${formatRupiah(item.price)} x ${item.qty} = <strong>${formatRupiah(item.price * item.qty)}</strong></div>
              </div>
              <div class="d-flex align-items-center gap-2">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-secondary btn-decrease" data-id="${item.id}">-</button>
                  <button class="btn btn-outline-secondary disabled text-dark fw-bold">${item.qty}</button>
                  <button class="btn btn-outline-secondary btn-increase" data-id="${item.id}">+</button>
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

  document.querySelectorAll(".btn-add-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const id = parseInt(button.getAttribute("data-id"));
      addToCart(id);

      const originalText = button.innerHTML;
      button.innerHTML = "✓ Ditambahkan!";
      button.classList.remove("btn-outline-dark");
      button.classList.add("btn-dark");
      setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove("btn-dark");
        button.classList.add("btn-outline-dark");
      }, 1000);
    });
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-increase")) {
      const id = parseInt(e.target.getAttribute("data-id"));
      updateQty(id, 1);
    } else if (e.target.classList.contains("btn-decrease")) {
      const id = parseInt(e.target.getAttribute("data-id"));
      updateQty(id, -1);
    } else if (e.target.classList.contains("btn-remove")) {
      const id = parseInt(e.target.getAttribute("data-id"));
      removeFromCart(id);
    }
  });

  const btnClear = document.getElementById("btnClearCart");
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      if (confirm("Apakah Anda yakin ingin mengosongkan keranjang?")) {
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
