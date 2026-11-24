const carouselEl = document.getElementById("carouselExampleCaptions");
if (carouselEl && typeof bootstrap !== "undefined") {
  const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
    interval: 2500,
    ride: "carousel",
    pause: false,
  });

  const prevBtn = document.querySelector(".carousel-control-prev");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevBtn.blur();
      setTimeout(() => {
        carousel.cycle();
      }, 300);
    });
  }

  const nextBtn = document.querySelector(".carousel-control-next");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextBtn.blur();
      setTimeout(() => {
        carousel.cycle();
      }, 300);
    });
  }
}

const introOverlay = document.getElementById("introOverlay");
if (introOverlay) {
  setTimeout(() => {
    introOverlay.style.display = "none";
  }, 1800);
}
