document.addEventListener("DOMContentLoaded", function () {
  // Custom select functionality
  const selectElements = document.querySelectorAll(".custom-select");
  selectElements.forEach(initializeCustomSelect);

  // Hamburger menu and sidebar functionality
  const hamburger = document.querySelector(".hamburger");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".overlay");
  const nav = document.querySelector(".nav");

  hamburger.addEventListener("click", toggleSidebar);
  overlay.addEventListener("click", toggleSidebar);

  // Scroll event for navbar
  window.addEventListener("scroll", handleNavbarScroll);

  // Industry and role select functionality
  const industrySelect = document.getElementById("industry");
  const industryOther = document.getElementById("industry_other");
  const roleSelect = document.getElementById("role");
  const roleOther = document.getElementById("role_other");

  industrySelect.addEventListener("change", () =>
    toggleOtherInput(industrySelect, industryOther)
  );
  roleSelect.addEventListener("change", () =>
    toggleOtherInput(roleSelect, roleOther)
  );

  // Form submission
  const form = document.querySelector("form");
  const successNotification = document.getElementById("success-notification");
  const errorNotification = document.getElementById("error-notification");

  form.addEventListener("submit", handleFormSubmit);

  // Initialize the industry other input on page load
  toggleOtherInput(industrySelect, industryOther);
});

function initializeCustomSelect(selectElement) {
  const select = selectElement.querySelector("select");
  const selected = document.createElement("div");
  selected.className = "select-selected";
  selected.innerHTML = select.options[select.selectedIndex].innerHTML;
  selectElement.appendChild(selected);

  const items = document.createElement("div");
  items.className = "select-items select-hide";

  Array.from(select.options).forEach((option, index) => {
    const item = document.createElement("div");
    item.innerHTML = option.innerHTML;
    item.addEventListener("click", function () {
      select.selectedIndex = index;
      selected.innerHTML = this.innerHTML;
      items.classList.add("select-hide");
    });
    items.appendChild(item);
  });

  selectElement.appendChild(items);

  selected.addEventListener("click", function (e) {
    e.stopPropagation();
    closeAllSelect(this);
    items.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  const x = document.getElementsByClassName("select-items");
  const y = document.getElementsByClassName("select-selected");
  Array.from(y).forEach((item, i) => {
    if (elmnt !== item) {
      item.classList.remove("select-arrow-active");
      x[i].classList.add("select-hide");
    }
  });
}

function toggleSidebar() {
  const hamburger = document.querySelector(".hamburger");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".overlay");

  hamburger.classList.toggle("active");
  sidebar.classList.toggle("active");
  overlay.style.display = overlay.style.display === "block" ? "none" : "block";
  document.body.style.overflow =
    document.body.style.overflow === "hidden" ? "visible" : "hidden";
}

function handleNavbarScroll() {
  const nav = document.querySelector(".nav");
  if (window.scrollY > 50) {
    nav.style.backgroundColor = "rgba(240, 240, 240, 0.9)";
    nav.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
  } else {
    nav.style.backgroundColor = "var(--background-color)";
    nav.style.boxShadow = "none";
  }
}

function toggleOtherInput(selectElement, otherInput) {
  if (selectElement.value === "Other") {
    otherInput.style.display = "block";
    otherInput.setAttribute("required", "required");
  } else {
    otherInput.style.display = "none";
    otherInput.removeAttribute("required");
  }
}

function handleFormSubmit(event) {
  event.preventDefault();

  // Add your form submission logic here
  const isSuccessful = true; // Replace with actual form submission result

  if (isSuccessful) {
    showNotification(document.getElementById("success-notification"));
  } else {
    showNotification(document.getElementById("error-notification"));
  }
}

function showNotification(notificationElement) {
  notificationElement.style.display = "block";
  setTimeout(() => {
    notificationElement.style.display = "none";
  }, 5000);
}

document.addEventListener("click", closeAllSelect);
