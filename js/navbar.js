(function () {
  const pages = [
    {
      name: "Home",
      url: "index.html",
      emoji: "🏠",
      desc: "Beranda utama Jasa Skill Yoel",
      keywords: ["home", "beranda", "utama", "halaman utama"],
    },
    {
      name: "About",
      url: "about.html",
      emoji: "👤",
      desc: "Tentang profil & keahlian Yoel",
      keywords: ["about", "tentang", "profil", "yoel", "siapa"],
    },
    {
      name: "Pianis",
      url: "pianis.html",
      emoji: "🎹",
      desc: "Jasa pianis untuk ibadah, wedding & event",
      keywords: [
        "pianis",
        "piano",
        "musik",
        "ibadah",
        "wedding",
        "pernikahan",
        "cafe",
        "event",
      ],
    },
    {
      name: "Joki MLBB",
      url: "joki.html",
      emoji: "🎮",
      desc: "Jasa joki & push rank Mobile Legends",
      keywords: [
        "joki",
        "mlbb",
        "mobile legends",
        "game",
        "gaming",
        "push rank",
        "booster",
        "rank",
      ],
    },
    {
      name: "Editor",
      url: "editor.html",
      emoji: "🎬",
      desc: "Jasa editing video & desain flyer",
      keywords: [
        "editor",
        "video",
        "edit",
        "flyer",
        "desain",
        "vlog",
        "jedag jedug",
        "capcut",
        "canva",
      ],
    },
  ];

  const searchInput = document.getElementById("navbarSearchInput");
  const searchDropdown = document.getElementById("navbarSearchResults");

  if (!searchInput || !searchDropdown) return;

  let highlightedIndex = -1;

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      searchDropdown.classList.remove("show");
      highlightedIndex = -1;
      return;
    }

    const matches = pages.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.keywords.some((kw) => kw.includes(q))
      );
    });

    if (matches.length === 0) {
      searchDropdown.innerHTML =
        '<div class="search-no-result">Halaman tidak ditemukan</div>';
    } else {
      searchDropdown.innerHTML = matches
        .map(
          (p, i) => `
        <a href="${p.url}" class="search-result-item" data-index="${i}">
          <span class="search-result-emoji">${p.emoji}</span>
          <span class="search-result-info">
            <span class="search-result-name">${highlightMatch(p.name, q)}</span>
            <span class="search-result-desc">${p.desc}</span>
          </span>
        </a>
      `,
        )
        .join("");
    }

    highlightedIndex = -1;
    searchDropdown.classList.add("show");
  }

  function highlightMatch(text, query) {
    const idx = text.toLowerCase().indexOf(query);
    if (idx === -1) return text;
    return (
      text.slice(0, idx) +
      "<strong>" +
      text.slice(idx, idx + query.length) +
      "</strong>" +
      text.slice(idx + query.length)
    );
  }

  function navigateHighlighted() {
    const items = searchDropdown.querySelectorAll(".search-result-item");
    if (highlightedIndex >= 0 && highlightedIndex < items.length) {
      window.location.href = items[highlightedIndex].getAttribute("href");
    }
  }

  function updateHighlight() {
    const items = searchDropdown.querySelectorAll(".search-result-item");
    items.forEach((el, i) => {
      el.classList.toggle("highlighted", i === highlightedIndex);
    });
  }

  searchInput.addEventListener("input", function () {
    renderResults(this.value);
  });

  searchInput.addEventListener("keydown", function (e) {
    const items = searchDropdown.querySelectorAll(".search-result-item");
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1);
      updateHighlight();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      highlightedIndex = Math.max(highlightedIndex - 1, 0);
      updateHighlight();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        navigateHighlighted();
      } else if (items.length === 1) {
        window.location.href = items[0].getAttribute("href");
      }
    } else if (e.key === "Escape") {
      searchDropdown.classList.remove("show");
      searchInput.blur();
    }
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".navbar-search-wrapper")) {
      searchDropdown.classList.remove("show");
    }
  });

  searchInput.addEventListener("focus", function () {
    if (this.value.trim()) {
      renderResults(this.value);
    }
  });

  const navbar = document.querySelector(".navbar-yoel");
  if (navbar) {
    window.addEventListener(
      "scroll",
      function () {
        navbar.classList.toggle("scrolled", window.scrollY > 30);
      },
      { passive: true },
    );
  }

  const introOverlay = document.getElementById("introOverlay");
  if (introOverlay) {
    setTimeout(() => {
      introOverlay.style.display = "none";
    }, 1800);
  }
})();
