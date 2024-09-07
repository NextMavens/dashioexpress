document.addEventListener("DOMContentLoaded", function () {
  const selectElements = document.querySelectorAll(".custom-select");

  selectElements.forEach((selectElement) => {
    const select = selectElement.querySelector("select");
    const selected = document.createElement("div");
    selected.className = "select-selected";
    selected.innerHTML = select.options[select.selectedIndex].innerHTML;
    selectElement.appendChild(selected);

    const items = document.createElement("div");
    items.className = "select-items select-hide";
    for (let i = 0; i < select.options.length; i++) {
      const item = document.createElement("div");
      item.innerHTML = select.options[i].innerHTML;
      item.addEventListener("click", function () {
        const index = Array.prototype.indexOf.call(items.children, this);
        select.selectedIndex = index;
        selected.innerHTML = this.innerHTML;
        items.classList.add("select-hide");
      });
      items.appendChild(item);
    }
    selectElement.appendChild(items);

    selected.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllSelect(this);
      items.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  });

  function closeAllSelect(elmnt) {
    const x = document.getElementsByClassName("select-items");
    const y = document.getElementsByClassName("select-selected");
    for (let i = 0; i < y.length; i++) {
      if (elmnt === y[i]) continue;
      y[i].classList.remove("select-arrow-active");
    }
    for (let i = 0; i < x.length; i++) {
      x[i].classList.add("select-hide");
    }
  }

  document.addEventListener("click", closeAllSelect);
});

document.addEventListener("DOMContentLoaded", function () {
  const industrySelect = document.getElementById("industry");
  const industryOther = document.getElementById("industry_other");

  industrySelect.addEventListener("change", function () {
    if (this.value === "Other") {
      industryOther.style.display = "block";
    } else {
      industryOther.style.display = "none";
    }
  });

  const roleSelect = document.getElementById("role");
  const roleOther = document.getElementById("role_other");

  roleSelect.addEventListener("change", function () {
    if (this.value === "Other") {
      roleOther.style.display = "block";
    } else {
      roleOther.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const sidebar = document.querySelector(".sidebar");

  hamburger.addEventListener("click", function () {
    sidebar.classList.toggle("active");
    hamburger.classList.toggle("active");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const industryDropdown = document.getElementById("industry");
  const industryOtherInput = document.getElementById("industry_other");
  const successNotification = document.getElementById("success-notification");
  const errorNotification = document.getElementById("error-notification");

  function toggleIndustryOther() {
    if (industryDropdown.value === "Other") {
      industryOtherInput.style.display = "block";
      industryOtherInput.setAttribute("required", "required");
    } else {
      industryOtherInput.style.display = "none";
      industryOtherInput.removeAttribute("required");
    }
  }

  toggleIndustryOther();
  industryDropdown.addEventListener("change", toggleIndustryOther);

  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();

    const form = event.target;

    if (isSuccessful) {
      showNotification(successNotification);
    } else {
      showNotification(errorNotification);
    }
  });

  function showNotification(notificationElement) {
    notificationElement.style.display = "block";

    setTimeout(function () {
      notificationElement.style.display = "none";
    }, 5000);
  }
});
