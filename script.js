/**
 * ============================================================================
 * DRIVE PORTAL — REIHAN
 * Script & Interactivity Configuration
 * ============================================================================
 */

"use strict";

/* ==========================================================================
   KONFIGURASI UTAMA (EDIT DI SINI)
   Silakan ganti nilai di bawah ini dengan URL Google Drive dan Email Anda yang sebenarnya.
   Jika nilai masih berupa placeholder bawaan, sistem akan menampilkan notifikasi informatif
   dan tidak akan membuka link kosong/palsu.
   ========================================================================== */

const DRIVE_LINKS = {
  private: "https://drive.google.com/drive/folders/1biyNJ6HqbDDBgkbxcqxNdg-TEEa1DKzi?usp=sharing",
  viewer: "https://drive.google.com/drive/folders/14iaYeu4otmsJ3dT-OyEdtqjqCpSJ6UUe?usp=sharing",
  editor: "https://drive.google.com/drive/folders/1DfP_5CmeztmddM3jDr7sy-W3VLC4Cp4o?usp=sharing"
};

const CONTACT_EMAIL = "reihankaissya2009@gmail.com";

const PROFILE_NAME = "Muhamad Reihan Kaissya";

/* ==========================================================================
   LOGIKA SISTEM & INTERAKSI
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initDriveButtons();
  initContactButton();
});

/**
 * Validasi apakah URL atau email masih berupa placeholder default
 * @param {string} value - Nilai yang akan dicek
 * @returns {boolean} - true jika valid (bukan placeholder), false jika masih placeholder
 */
function isConfigured(value) {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim();
  const placeholders = [
    "LINK DRIVE PRIVATE",
    "LINK DRIVE PUBLIK VIEWER",
    "LINK DRIVE PUBLIK EDITOR",
    "EMAIL KAMU",
    ""
  ];
  return !placeholders.includes(trimmed);
}

/**
 * Validasi format email sederhana
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (!isConfigured(email)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Tampilkan notifikasi toast elegan bergaya Google Workspace
 * @param {string} message - Pesan notifikasi
 * @param {string} [title="Pemberitahuan"] - Judul toast
 * @param {"warning" | "info" | "success"} [type="warning"]
 */
function showToast(message, title = "Pemberitahuan", type = "warning") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "alert");

  toast.innerHTML = `
    <div class="toast-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button type="button" class="toast-close" aria-label="Tutup notifikasi">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

  const closeBtn = toast.querySelector(".toast-close");
  const dismiss = () => {
    toast.classList.add("toast-hiding");
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 250);
  };

  closeBtn.addEventListener("click", dismiss);
  container.appendChild(toast);

  // Otomatis tutup setelah 4.5 detik
  setTimeout(dismiss, 4500);
}


/**
 * Pengaturan Tema Light Mode & Dark Mode
 */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const htmlRoot = document.documentElement;

  // Baca preferensi tersimpan di localStorage, default: 'light'
  const savedTheme = localStorage.getItem("drive_portal_theme") || "light";
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = htmlRoot.getAttribute("data-theme") || "light";
      const newTheme = currentTheme === "light" ? "dark" : "light";
      applyTheme(newTheme);
      localStorage.setItem("drive_portal_theme", newTheme);
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute("data-theme", theme);
    if (themeToggleBtn) {
      if (theme === "dark") {
        themeToggleBtn.setAttribute("aria-label", "Ganti ke mode terang");
        themeToggleBtn.setAttribute("title", "Ganti ke mode terang");
      } else {
        themeToggleBtn.setAttribute("aria-label", "Ganti ke mode gelap");
        themeToggleBtn.setAttribute("title", "Ganti ke mode gelap");
      }
    }
  }
}

/**
 * Inisialisasi Tombol Direktori Google Drive
 */
function initDriveButtons() {
  const buttons = [
    {
      id: "btn-private",
      key: "private",
      name: "Private Drive"
    },
    {
      id: "btn-viewer",
      key: "viewer",
      name: "Public Viewer"
    },
    {
      id: "btn-editor",
      key: "editor",
      name: "Public Editor"
    }
  ];

  buttons.forEach(({ id, key, name }) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener("click", () => {
      const targetUrl = DRIVE_LINKS[key];

      if (!isConfigured(targetUrl)) {
        showToast(
          `Link untuk direktori "${name}" belum dikonfigurasi di script.js. Silakan perbarui nilai DRIVE_LINKS.${key}.`,
          "Link Belum Dikonfigurasi",
          "warning"
        );
        return;
      }

      // Validasi URL dan buka tab baru secara aman
      try {
        const parsedUrl = new URL(targetUrl);
        if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
          window.open(targetUrl, "_blank", "noopener,noreferrer");
        } else {
          showToast(
            `URL untuk "${name}" tidak valid. Pastikan diawali dengan https://`,
            "Format URL Tidak Valid",
            "warning"
          );
        }
      } catch {
        // Jika format URL tidak valid
        showToast(
          `URL untuk "${name}" tidak valid. Pastikan diawali dengan https://`,
          "Format URL Tidak Valid",
          "warning"
        );
      }
    });
  });
}

/**
 * Inisialisasi Tombol Hubungi Saya (mailto:)
 */
function initContactButton() {
  const contactBtn = document.getElementById("btn-contact");
  if (!contactBtn) return;

  contactBtn.addEventListener("click", () => {
    if (!isConfigured(CONTACT_EMAIL) || !isValidEmail(CONTACT_EMAIL)) {
      showToast(
        "Alamat email belum dikonfigurasi di script.js. Silakan perbarui nilai CONTACT_EMAIL.",
        "Email Belum Dikonfigurasi",
        "warning"
      );
      return;
    }

    const subject = encodeURIComponent("Tanya Akses Google Drive — Drive Portal");
    const mailtoUrl = `mailto:${encodeURIComponent(CONTACT_EMAIL)}?subject=${subject}`;
    window.location.href = mailtoUrl;
  });
}
