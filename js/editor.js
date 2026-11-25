const editorServices = [
  {
    id: 1,
    name: "Video Vlog",
    icon: "📹",
    price: 150000,
    desc: "Editing video vlog lengkap: pemotongan footage, B-Roll insertion, subtitle, sound balancing, background music, intro & outro branding.",
  },
  {
    id: 2,
    name: "Video Jedag Jedug",
    icon: "🕺",
    price: 75000,
    desc: "Jasa editing video jedag jedug smooth dan on-beat menggunakan keyframe serta kurva gerakan yang presisi.",
  },
  {
    id: 3,
    name: "Flyer",
    icon: "🖼️",
    price: 50000,
    desc: "Desain flyer promosi kreatif dan estetik menggunakan template & konsep dari editor, siap cetak maupun digital.",
  },
  {
    id: 4,
    name: "Flyer (Design Request)",
    icon: "🎨",
    price: 80000,
    desc: "Desain flyer sesuai permintaan & brief khusus dari pelanggan. Konsep, warna, layout, dan konten disesuaikan keinginan Anda.",
  },
];

const EDITOR_CART_STORAGE_KEY = "yoel_editor_cart";

function getCart() {
  const data = localStorage.getItem(EDITOR_CART_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem(EDITOR_CART_STORAGE_KEY, JSON.stringify(cart));
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
  const service = editorServices.find((s) => s.id === serviceId);
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
      "Keranjang layanan editing Anda masih kosong. Silakan pilih paket layanan terlebih dahulu!",
    );
    return;
  }

  let message =
    "Halo Yoel! Saya tertarik untuk memesan jasa Video Editing & Desain Anda:\n\n";
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    message += `${index + 1}. *${item.name}* (x${item.qty}) = ${formatRupiah(subtotal)}\n`;
  });

  message += `\n*Total Estimasi:* ${formatRupiah(total)}\n\n`;
  message +=
    "Bisa tolong informasikan ketersediaan slot pengerjaan dan alur pengiriman footage/brief? Terima kasih!";

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
            <div class="fw-bold text-white fs-6">${item.name}</div>
            <div class="mt-1">
              <span class="d-sm-none text-white small" style="color: #ffffff !important;">(${formatRupiah(item.price)}/unit)</span>
            </div>
          </td>
          <td class="text-nowrap text-secondary d-none d-sm-table-cell">${formatRupiah(item.price)}</td>
          <td class="text-center">
            <div class="btn-group btn-group-sm" role="group">
              <button class="btn btn-editor-counter btn-decrease" data-id="${item.id}">-</button>
              <span class="btn btn-editor-counter disabled fw-bold px-2">${item.qty}</span>
              <button class="btn btn-editor-counter btn-increase" data-id="${item.id}">+</button>
            </div>
          </td>
          <td class="fw-bold text-light text-nowrap">${formatRupiah(item.price * item.qty)}</td>
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
      modalContent.innerHTML = `<p class="text-white text-center py-4 mb-0" style="color: #ffffff !important;">Keranjang layanan editor masih kosong.</p>`;
    } else {
      modalContent.innerHTML = `
        <div class="list-group list-group-flush">
          ${cart
            .map(
              (item) => `
            <div class="list-group-item d-flex justify-content-between align-items-center px-0 py-3 bg-transparent" style="border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;">
              <div>
                <h6 class="mb-1 fw-bold text-white">${item.icon || "🎬"} ${item.name}</h6>
                <div class="small mt-1" style="color: #cbd5e1;">${formatRupiah(item.price)} &times; ${item.qty} = <strong class="text-white">${formatRupiah(item.price * item.qty)}</strong></div>
              </div>
              <div class="d-flex align-items-center gap-2">
                <div class="btn-group btn-group-sm" role="group">
                  <button class="btn btn-editor-counter btn-decrease" data-id="${item.id}">-</button>
                  <span class="btn btn-editor-counter disabled text-white fw-bold px-2">${item.qty}</span>
                  <button class="btn btn-editor-counter btn-increase" data-id="${item.id}">+</button>
                </div>
                <button class="btn btn-sm btn-outline-danger btn-remove ms-1" data-id="${item.id}" title="Hapus" style="border-radius: 8px; padding: 3px 8px;">✕</button>
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

function initVideoControls() {
  const video = document.getElementById("workstationVideo");
  const btnPlayback = document.getElementById("btnVideoPlayback");
  const playbackIcon = document.getElementById("playbackIcon");
  const playbackText = document.getElementById("playbackText");
  const timelineProgress = document.getElementById("timelineProgress");
  const timelineTrackBar = document.getElementById("timelineTrackBar");
  const currentTimeEl = document.getElementById("currentTime");
  const durationTimeEl = document.getElementById("durationTime");

  if (!video || !btnPlayback) return;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  video.addEventListener("loadedmetadata", () => {
    if (durationTimeEl) {
      durationTimeEl.textContent = formatTime(video.duration);
    }
  });

  if (video.duration && durationTimeEl) {
    durationTimeEl.textContent = formatTime(video.duration);
  }

  video.addEventListener("timeupdate", () => {
    if (!video.duration) return;
    const progressPercent = (video.currentTime / video.duration) * 100;
    if (timelineProgress) {
      timelineProgress.style.width = `${progressPercent}%`;
    }
    if (currentTimeEl) {
      currentTimeEl.textContent = formatTime(video.currentTime);
    }
    if (durationTimeEl && durationTimeEl.textContent === "00:00") {
      durationTimeEl.textContent = formatTime(video.duration);
    }
  });

  btnPlayback.addEventListener("click", () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", () => {
    btnPlayback.classList.remove("is-stopped");
    if (playbackIcon) playbackIcon.textContent = "⏹";
    if (playbackText) playbackText.textContent = "Stop Video";
  });

  video.addEventListener("pause", () => {
    btnPlayback.classList.add("is-stopped");
    if (playbackIcon) playbackIcon.textContent = "▶";
    if (playbackText) playbackText.textContent = "Play Video";
  });

  if (timelineTrackBar) {
    timelineTrackBar.addEventListener("click", (e) => {
      const rect = timelineTrackBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      if (width > 0 && video.duration) {
        const newTime = (clickX / width) * video.duration;
        video.currentTime = newTime;
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  initVideoControls();

  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".btn-add-cart");
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
        }, 900);
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

  const btnClearCart = document.getElementById("btnClearCart");
  if (btnClearCart) {
    btnClearCart.addEventListener("click", () => {
      if (
        confirm(
          "Apakah Anda yakin ingin mengosongkan keranjang layanan editing?",
        )
      ) {
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
