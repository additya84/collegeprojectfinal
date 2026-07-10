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
