(function () {
  "use strict";

  // --- Footer copyright year (every page) ---
  document.querySelectorAll(".year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ==========================================================================
  // MOBILE NAVIGATION
  // ==========================================================================
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  function closeMobileNav() {
    if (navMenu) navMenu.classList.remove("is-open");
    if (navToggle) {
      navToggle.classList.remove("is-active");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    }
    const dropdownItem = document.querySelector(".nav-item-dropdown");
    const dropdownToggle = document.querySelector(".nav-dropdown-toggle");
    if (dropdownItem) dropdownItem.classList.remove("is-open");
    if (dropdownToggle) dropdownToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.classList.toggle("is-active", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen);
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
  }

  // Close menu when a page link is clicked (multi-page navigation)
  document.querySelectorAll(".nav-link[href], .dropdown-link").forEach(function (link) {
    link.addEventListener("click", closeMobileNav);
  });

  // ==========================================================================
  // SERVICES DROPDOWN
  // ==========================================================================
  const dropdownItem = document.querySelector(".nav-item-dropdown");
  const dropdownToggle = document.querySelector(".nav-dropdown-toggle");

  if (dropdownToggle && dropdownItem) {
    dropdownToggle.addEventListener("click", function (e) {
      e.preventDefault();
      const isOpen = dropdownItem.classList.toggle("is-open");
      dropdownToggle.setAttribute("aria-expanded", isOpen);
    });

    document.addEventListener("click", function (e) {
      if (!dropdownItem.contains(e.target)) {
        dropdownItem.classList.remove("is-open");
        dropdownToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ==========================================================================
  // IMAGE FALLBACKS — gradient placeholder if file missing in /images/
  // ==========================================================================
  document.querySelectorAll("img").forEach(function (img) {
    if (img.complete && img.naturalHeight === 0) {
      img.classList.add("img-fallback");
    }
    img.addEventListener("error", function () {
      img.classList.add("img-fallback");
    });
  });

  // ==========================================================================
  // CONTACT FORM (only on contact.html)
  // ==========================================================================
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  const fields = {
    name: {
      input: document.getElementById("name"),
      error: document.getElementById("name-error"),
      validate: function (value) {
        const trimmed = value.trim();
        if (!trimmed) return "Please enter your name.";
        if (trimmed.length < 2) return "Name must be at least 2 characters.";
        return "";
      },
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("email-error"),
      validate: function (value) {
        const trimmed = value.trim();
        if (!trimmed) return "Please enter your email.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
          return "Please enter a valid email address.";
        }
        return "";
      },
    },
    message: {
      input: document.getElementById("message"),
      error: document.getElementById("message-error"),
      validate: function (value) {
        const trimmed = value.trim();
        if (!trimmed) return "Please enter your message.";
        if (trimmed.length < 10) return "Message must be at least 10 characters.";
        return "";
      },
    },
  };

  function setFieldError(key, message) {
    const field = fields[key];
    if (!field.input || !field.error) return;
    if (message) {
      field.input.classList.add("invalid");
      field.input.setAttribute("aria-invalid", "true");
      field.error.textContent = message;
    } else {
      field.input.classList.remove("invalid");
      field.input.removeAttribute("aria-invalid");
      field.error.textContent = "";
    }
  }

  Object.keys(fields).forEach(function (key) {
    const field = fields[key];
    if (!field.input) return;

    field.input.addEventListener("blur", function () {
      setFieldError(key, field.validate(field.input.value));
    });

    field.input.addEventListener("input", function () {
      if (field.input.classList.contains("invalid")) {
        const msg = field.validate(field.input.value);
        if (!msg) setFieldError(key, "");
      }
    });
  });

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;
    const formSuccess = document.getElementById("form-success");

    Object.keys(fields).forEach(function (key) {
      const msg = fields[key].validate(fields[key].input.value);
      setFieldError(key, msg);
      if (msg) isValid = false;
    });

    if (!isValid) {
      const firstInvalid = contactForm.querySelector(".invalid");
      if (firstInvalid) firstInvalid.focus();
      if (formSuccess) formSuccess.hidden = true;
      return;
    }

    if (formSuccess) {
      formSuccess.hidden = false;
      contactForm.reset();
      Object.keys(fields).forEach(function (key) {
        setFieldError(key, "");
      });
    }
  });
})();
