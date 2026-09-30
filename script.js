// ===== MODAL ELEMENTS =====
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalTags = document.getElementById("modalTags");
const modalLink = document.getElementById("modalLink");
const modalImage = document.getElementById("modalImage");
const imagePrev = document.getElementById("imagePrev");
const imageNext = document.getElementById("imageNext");
const imageCounter = document.getElementById("imageCounter");
const imageDots = document.getElementById("imageDots");

// Safety check (biar tidak error kalau elemen belum ada)
if (!modal || !modalTitle || !modalDesc || !modalTags || !modalLink || !modalImage) {
  console.error("Modal elements not found. Pastikan HTML modal sudah benar.");
} else {

  // ===== IMAGE CAROUSEL STATE =====
  let currentImages = [];
  let currentImageIndex = 0;

  function renderImage() {
    if (!currentImages.length) {
      modalImage.src = "";
      modalImage.style.display = "none";
      imagePrev.style.display = "none";
      imageNext.style.display = "none";
      imageCounter.style.display = "none";
      imageDots.innerHTML = "";
      return;
    }

    modalImage.src = currentImages[currentImageIndex];
    modalImage.style.display = "block";

    const multiple = currentImages.length > 1;
    imagePrev.style.display = multiple ? "flex" : "none";
    imageNext.style.display = multiple ? "flex" : "none";
    imageCounter.style.display = multiple ? "block" : "none";
    imageCounter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;

    imageDots.innerHTML = "";
    if (multiple) {
      currentImages.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `image-dot${index === currentImageIndex ? " active" : ""}`;
        dot.setAttribute("aria-label", `Go to image ${index + 1}`);
        dot.addEventListener("click", (event) => {
          event.stopPropagation();
          currentImageIndex = index;
          renderImage();
        });
        imageDots.appendChild(dot);
      });
    }
  }

  function changeImage(direction) {
    if (currentImages.length <= 1) return;
    currentImageIndex = (currentImageIndex + direction + currentImages.length) % currentImages.length;
    renderImage();
  }

  // ===== OPEN MODAL =====
  function openModal(data) {
    modalTitle.textContent = data.title || "Untitled";
    modalDesc.textContent = data.desc || "";

    currentImages = data.images || [];
    currentImageIndex = 0;
    renderImage();

    // Tags
    modalTags.innerHTML = "";
    const tags = (data.tags || "")
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    tags.forEach(tag => {
      const span = document.createElement("span");
      span.textContent = tag;
      modalTags.appendChild(span);
    });

    // Link (optional)
    if (data.link) {
      modalLink.style.display = "inline-flex";
      modalLink.href = data.link;
    } else {
      modalLink.style.display = "none";
      modalLink.href = "#";
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  // ===== CLOSE MODAL =====
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // ===== CLICK CARD TO OPEN =====
  document.querySelectorAll(".project-card").forEach(card => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      openModal({
        title: card.dataset.title,
        desc: card.dataset.desc,
        tags: card.dataset.tags,
        link: card.dataset.link,
        images: (card.dataset.images || card.dataset.image || "")
          .split("|")
          .map(image => image.trim())
          .filter(Boolean)
      });
    });
  });

  // ===== CLICK OVERLAY / CLOSE BUTTON =====
  modal.addEventListener("click", (e) => {
    // Ini penting: kalau klik ikon <i> di dalam tombol close,
    // targetnya bisa <i> bukan <button>, jadi pakai closest().
    const closeTrigger = e.target.closest("[data-close='true']");
    if (closeTrigger) closeModal();
  });


  // ===== IMAGE CONTROLS =====
  imagePrev.addEventListener("click", (e) => {
    e.stopPropagation();
    changeImage(-1);
  });

  imageNext.addEventListener("click", (e) => {
    e.stopPropagation();
    changeImage(1);
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "ArrowLeft") changeImage(-1);
    if (e.key === "ArrowRight") changeImage(1);
  });

  // ===== ESC TO CLOSE =====
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
}
