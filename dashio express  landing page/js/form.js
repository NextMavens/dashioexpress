document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("multiStepForm");
  const steps = Array.from(document.querySelectorAll(".form-step"));
  const progressSteps = Array.from(
    document.querySelectorAll(".progress-bar .step")
  );
  const nextButtons = document.querySelectorAll(".next-btn");
  const prevButtons = document.querySelectorAll(".prev-btn");
  const submitButton = document.querySelector(".submit-btn");
  let currentStep = 0;
  emailjs.init("YOUR_PUBLIC_KEY");

  function initAutocomplete() {
    const input = document.getElementById("location");
    if (!input) return;

    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ["geocode"],
      componentRestrictions: {
        country: [
          "AT",
          "BE",
          "BG",
          "HR",
          "CY",
          "CZ",
          "DK",
          "EE",
          "FI",
          "FR",
          "DE",
          "GR",
          "HU",
          "IS",
          "IE",
          "IT",
          "LV",
          "LT",
          "LU",
          "MT",
          "NL",
          "NO",
          "PL",
          "PT",
          "RO",
          "SK",
          "SI",
          "ES",
          "SE",
          "CH",
          "GB"
        ]
      }
    });

    autocomplete.setFields(["address_component"]);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      console.log("Selected place:", place);

      if (!place.address_components) return;

      const addressComponents = place.address_components.reduce(
        (acc, component) => {
          switch (component.types[0]) {
            case "postal_code":
              acc.postalCode = component.long_name;
              break;
            case "locality":
              acc.town = component.long_name;
              break;
            case "street_number":
              acc.streetNumber = component.long_name;
              break;
            case "route":
              acc.streetName = component.long_name;
              break;
          }
          return acc;
        },
        {}
      );

      document.getElementById("postal-code").value =
        addressComponents.postalCode || "";
      document.getElementById("town").value = addressComponents.town || "";
      document.getElementById("street-number").value =
        addressComponents.streetNumber || "";
    });
  }

  function showStep(stepIndex) {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === stepIndex);
    });
    progressSteps.forEach((step, index) => {
      step.classList.toggle("active", index <= stepIndex);
    });
  }

  function nextStep() {
    if (currentStep < steps.length - 1 && validateStep(currentStep)) {
      currentStep++;
      showStep(currentStep);
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  }

  function validateStep(stepIndex) {
    const currentStepElement = steps[stepIndex];
    const requiredFields = currentStepElement.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add("error");
        showErrorMessage(field, "This field is required");
      } else {
        field.classList.remove("error");
        removeErrorMessage(field);
      }
    });

    return isValid;
  }

  function showErrorMessage(field, message) {
    let errorMessage = field.nextElementSibling;
    if (!errorMessage || !errorMessage.classList.contains("error-message")) {
      errorMessage = document.createElement("div");
      errorMessage.classList.add("error-message");
      field.parentNode.insertBefore(errorMessage, field.nextSibling);
    }
    errorMessage.textContent = message;
  }

  function removeErrorMessage(field) {
    const errorMessage = field.nextElementSibling;
    if (errorMessage && errorMessage.classList.contains("error-message")) {
      errorMessage.remove();
    }
  }

  function validateForm() {
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        showStep(i);
        return false;
      }
    }
    return true;
  }

  function updatePreview() {
    const previewInfo = document.getElementById("previewInfo");
    if (!previewInfo) {
      console.error("Preview info element not found");
      return;
    }

    const getElementValue = (id) => {
      const element = document.getElementById(id);
      return element ? element.value : "N/A";
    };

    previewInfo.innerHTML = `
          <h3>General Information:</h3>
          <p>Name: ${getElementValue("firstname")} ${getElementValue(
      "lastname"
    )}</p>
          <p>Company Name: ${getElementValue("companyname")}</p>
          <p>Email: ${getElementValue("email")}</p>
          <p>Phone: ${getElementValue("phone")}</p>
          <p>Street Address: ${getElementValue("street-address")}</p>
          <p>Street Number: ${getElementValue("street-number")}</p>
          <p>Postal Code: ${getElementValue("postal-code")}</p>
          <p>Town: ${getElementValue("town")}</p>
          <p>Industry: ${getSelectOrOtherValue("industry")}</p>
          <p>Role: ${getSelectOrOtherValue("role")}</p>
          <p>Company Size: ${getSelectOrOtherValue("companysize")}</p>
          <p>Volume of Shipment: ${getElementValue("volumeofshipment")}</p>
          <h3>Uploaded Documents:</h3>
          <p>Gewerbeanmeldung: ${getFileUploadStatus(
            "gewerbeanmeldung-front"
          )} (Front), ${getFileUploadStatus("gewerbeanmeldung-back")} (Back)</p>
          <p>Frachtführerversicherung: ${getFileUploadStatus(
            "frachtfuhrerversicherung-front"
          )} (Front), ${getFileUploadStatus(
      "frachtfuhrerversicherung-back"
    )} (Back)</p>
          <p>EU-Lizenz: ${getFileUploadStatus(
            "euLizenz-front"
          )} (Front), ${getFileUploadStatus("euLizenz-back")} (Back)</p>
      `;
  }

  function getSelectOrOtherValue(fieldName) {
    const selectElement = document.getElementById(fieldName);
    const otherInput = document.getElementById(`${fieldName}_other`);
    if (!selectElement) return "N/A";
    return selectElement.value === "Other" && otherInput
      ? otherInput.value
      : selectElement.value;
  }

  function getFileUploadStatus(fieldId) {
    const fileInput = document.getElementById(fieldId);
    return fileInput && fileInput.files.length > 0
      ? "Uploaded"
      : "Not uploaded";
  }

  // Event Listeners
  nextButtons.forEach((button) => {
    button.addEventListener("click", nextStep);
  });

  prevButtons.forEach((button) => {
    button.addEventListener("click", prevStep);
  });

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (validateForm()) {
        updatePreview();
        // Option to send to server or redirect to a success page
        window.location.href = "success-page.html";
      }
    });
  }

  // Handle 'Other' option for Industry and Role
  ["industry", "role"].forEach((fieldName) => {
    const selectElement = document.getElementById(fieldName);
    const otherInput = document.getElementById(`${fieldName}_other`);

    if (selectElement && otherInput) {
      selectElement.addEventListener("change", function () {
        otherInput.style.display = this.value === "Other" ? "block" : "none";
        otherInput.required = this.value === "Other";
      });
    }
  });

  if (nextButtons.length > 0) {
    nextButtons[nextButtons.length - 1].addEventListener(
      "click",
      updatePreview
    );
  }

  // Initialize
  initAutocomplete();
  showStep(currentStep);
});
