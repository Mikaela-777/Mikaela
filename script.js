// ===== MODAL ELEMENTS =====
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalTags = document.getElementById("modalTags");
const modalLink = document.getElementById("modalLink");
const modalImage = document.getElementById("modalImage");

// Safety check (biar tidak error kalau elemen belum ada)
if (!modal || !modalTitle || !modalDesc || !modalTags || !modalLink || !modalImage) {
  console.error("Modal elements not found. Pastikan HTML modal sudah benar.");
} else {

  // ===== OPEN MODAL =====
  function openModal(data) {
    modalTitle.textContent = data.title || "Untitled";
    modalDesc.textContent = data.desc || "";

    // Image
    if (data.image) {
      modalImage.src = data.image;
      modalImage.style.display = "block";
    } else {
      modalImage.src = "";
      modalImage.style.display = "none";
    }

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

    // Show modal
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
        image: card.dataset.image
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

  // ===== ESC TO CLOSE =====
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
}
