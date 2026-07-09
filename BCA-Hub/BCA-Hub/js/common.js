// === Sidebar Toggle ===
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("sidebarToggle");
  var sidebar = document.getElementById("sidebar");
  var overlay = document.getElementById("sidebarOverlay");
  if (toggle && sidebar) {
    toggle.addEventListener("click", function () {
      sidebar.classList.toggle("open");
      if (overlay) overlay.classList.toggle("show");
    });
    if (overlay) {
      overlay.addEventListener("click", function () {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
      });
    }
  }
});

// === Search Functionality ===
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".top-center input, .search-box input, .hero-search input").forEach(function (input) {
    input.addEventListener("input", function () {
      var term = this.value.toLowerCase().trim();
      var container = this.closest(".top-center, .hero-search") || this.closest(".search-box");
      if (!container) return;
      var cards = container.parentElement.querySelectorAll(".subject-card, .semester-card, .note-card, .paper-card, .study-card, .resource-card, .card, .topic-card");
      if (cards.length === 0) {
        cards = document.querySelectorAll(".subject-card, .semester-card, .note-card, .paper-card, .study-card, .resource-card, .topic-card, .grid-card");
      }
      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        card.style.display = term === "" || text.indexOf(term) !== -1 ? "" : "none";
      });
    });
  });
});

// === Theme Toggle (Day/Night) ===
document.addEventListener("DOMContentLoaded", function () {
  var saved = localStorage.getItem("bcaHubTheme") || "light";
  if (saved === "dark") document.body.classList.add("dark-mode");

  var toggleBtn = document.getElementById("themeToggle");
  if (!toggleBtn) {
    toggleBtn = document.querySelector(".sidebar .menu") ? document.createElement("div") : null;
    if (toggleBtn) {
      toggleBtn.id = "themeToggle";
      toggleBtn.className = "menu-item";
      toggleBtn.style.cssText = "cursor:pointer;margin-top:10px;";
      toggleBtn.innerHTML = '<i class="fa-solid ' + (saved === "dark" ? "fa-sun" : "fa-moon") + '"></i><span>' + (saved === "dark" ? "Light Mode" : "Dark Mode") + '</span>';
      var menu = document.querySelector(".sidebar .menu");
      if (menu) menu.appendChild(toggleBtn);
    }
  }
  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      var isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("bcaHubTheme", isDark ? "dark" : "light");
      toggleBtn.querySelector("i").className = "fa-solid " + (isDark ? "fa-sun" : "fa-moon");
      toggleBtn.querySelector("span").textContent = isDark ? "Light Mode" : "Dark Mode";
    });
  }
});