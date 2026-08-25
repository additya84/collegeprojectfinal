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

  var savedProfile = localStorage.getItem("bcaHubProfile");
  if (savedProfile) {
    try {
      var profile = JSON.parse(savedProfile);
      var avatars = document.querySelectorAll(".profile img, #sidebarAvatar, #topAvatar");
      avatars.forEach(function(avatar) { if (avatar && profile.avatar) avatar.src = profile.avatar; });
      var nameEls = document.querySelectorAll(".profile h4, #sidebarName, #topName, #profileName");
      nameEls.forEach(function(el) { if (el && profile.fullName) el.textContent = profile.fullName; });
      var welcomeText = document.querySelector("#welcomeText, #welcomeBanner");
      if (welcomeText && profile.fullName) welcomeText.textContent = welcomeText.id === "welcomeBanner" ? "Welcome Back," : "Welcome back,";
      var welcomeH1 = document.querySelector("#welcomeBanner");
      if (welcomeH1 && profile.fullName) welcomeH1.innerHTML = "Welcome Back,<br>" + profile.fullName + " 👋";
      var courseEls = document.querySelectorAll(".profile span, #sidebarCourse, #topCourse");
      courseEls.forEach(function(el) { if (el && profile.course) el.textContent = profile.course; });
    } catch (e) {}
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
