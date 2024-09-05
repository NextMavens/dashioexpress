document.addEventListener("DOMContentLoaded", function () {
  const driverButton = document.getElementById("driver-button");
  const clientButton = document.getElementById("client-button");
  const driversForm = document.getElementById("drivers-form");
  const clientsForm = document.getElementById("clients-form");
  const userTypeSelection = document.getElementById("user-type-selection");
  let type;
  if (
    driverButton &&
    clientButton &&
    driversForm &&
    clientsForm &&
    userTypeSelection
  ) {
    driverButton.addEventListener("click", () => showForm("driver"));
    clientButton.addEventListener("click", () => showForm("client"));
  } else {
    console.error("One or more required elements are missing.");
  }

  function showForm(userType) {
    if (userTypeSelection) userTypeSelection.style.display = "none";
    if (userType === "driver") {
      if (driversForm) {
        driversForm.style.display = "block";
        initMultiStepForm("multiStepForm");
        type = "driversform";
      }
    } else {
      if (clientsForm) {
        clientsForm.style.display = "block";
        initMultiStepForm("multiStepForm-clients");
        type = "clientsform";
      }
    }
  }

  function initMultiStepForm(formId) {
    const form = document.getElementById(formId);
    const steps = Array.from(form.querySelectorAll(".form-step"));
    const progressSteps = Array.from(
      form.querySelectorAll(".progress-bar .step")
    );
    const nextButtons = form.querySelectorAll(".next-btn");
    const prevButtons = form.querySelectorAll(".prev-btn");
    const submitButton = form.querySelector(".submit-btn");
    let currentStep = 0;

    if (!form || steps.length === 0 || progressSteps.length === 0) {
      console.error(`Form or steps not found for ${formId}.`);
      return;
    }

    function showStep(stepIndex) {
      steps.forEach((step, index) =>
        step.classList.toggle("active", index === stepIndex)
      );
      progressSteps.forEach((step, index) =>
        step.classList.toggle("active", index <= stepIndex)
      );
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

    // Initialize file previews
    previewFile("gewerbeanmeldung-front", "gewerbeanmeldung-front-preview");
    previewFile("gewerbeanmeldung-back", "gewerbeanmeldung-back-preview");
    previewFile(
      "frachtfuhrerversicherung-front",
      "frachtfuhrerversicherung-front-preview"
    );
    previewFile(
      "frachtfuhrerversicherung-back",
      "frachtfuhrerversicherung-back-preview"
    );
    previewFile("euLizenz-front", "euLizenz-front-preview");
    previewFile("euLizenz-back", "euLizenz-back-preview");

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

    nextButtons.forEach((button) => button.addEventListener("click", nextStep));
    prevButtons.forEach((button) => button.addEventListener("click", prevStep));

    submitButton?.addEventListener("click", function (e) {
      e.preventDefault();
      if (validateStep(currentStep)) {
        updatePreview();
        sendEmailWithFormData(formId);
      }
    });

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

    showStep(currentStep);
  }

  function initAutocomplete() {
    console.log("Initializing autocomplete");

    const countrySelect = document.getElementById("country");
    const streetAddressInput = document.getElementById("street-address");
    const streetNumberInput = document.getElementById("street-number");
    const cityInput = document.getElementById("town");
    const postalCodeInput = document.getElementById("postal-code");

    if (!streetAddressInput) {
      console.error("Street address input not found");
      return;
    }

    // Initialize the autocomplete object
    const autocomplete = new google.maps.places.Autocomplete(
      streetAddressInput,
      {
        types: ["address"],
      }
    );

    // Function to set the country restriction for the autocomplete
    function setAutocompleteCountry() {
      const country = countrySelect.value;
      autocomplete.setComponentRestrictions({ country: country });

      // Clear input fields when the country changes
      streetAddressInput.value = "";
      streetNumberInput.value = "";
      cityInput.value = "";
      postalCodeInput.value = "";
    }

    // Event listener for when the country is changed
    countrySelect.addEventListener("change", setAutocompleteCountry);

    // Listener for when the user selects an address
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      // Reset the input fields
      cityInput.value = "";
      postalCodeInput.value = "";
      streetNumberInput.value = "";

      // Extract address components
      const addressComponents = place.address_components.reduce(
        (acc, component) => {
          switch (component.types[0]) {
            case "postal_code":
              acc.postalCode = component.long_name;
              break;
            case "locality":
            case "sublocality_level_1":
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

      // Fill in the appropriate fields
      postalCodeInput.value = addressComponents.postalCode || "";
      cityInput.value = addressComponents.town || "";
      streetAddressInput.value = addressComponents.streetName || "";

      // Street number is not autofilled, so it's left for the user to enter manually
    });

    // Set the initial country restriction when the page loads
    setAutocompleteCountry();
  }

  // Initialize autocomplete when the window loads
  window.onload = initAutocomplete;

  function previewFile(fileInputId, previewContainerId) {
    const fileInput = document.getElementById(fileInputId);
    const previewContainer = document.getElementById(previewContainerId);

    if (fileInput && previewContainer) {
      fileInput.addEventListener("change", function () {
        const files = fileInput.files;
        previewContainer.innerHTML = ""; // Clear previous previews

        if (files && files.length > 0) {
          for (const file of files) {
            const fileReader = new FileReader();

            fileReader.onload = function (e) {
              const previewElement = document.createElement("div");
              previewElement.classList.add("preview-element");

              if (file.type.startsWith("image/")) {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.alt = file.name;
                img.classList.add("preview-image");
                previewElement.appendChild(img);
              } else if (file.type === "application/pdf") {
                const pdfIcon = document.createElement("span");
                pdfIcon.textContent = "PDF";
                pdfIcon.classList.add("pdf-icon");
                previewElement.appendChild(pdfIcon);
              } else {
                const defaultIcon = document.createElement("span");
                defaultIcon.textContent = "File";
                previewElement.appendChild(defaultIcon);
              }

              const fileName = document.createElement("p");
              fileName.textContent = file.name;
              previewElement.appendChild(fileName);

              previewContainer.appendChild(previewElement);
            };

            fileReader.readAsDataURL(file);
          }
        } else {
          previewContainer.innerHTML = "<p>No file selected</p>";
        }
      });
    } else {
      console.error(
        `File input or preview container not found: ${fileInputId}, ${previewContainerId}`
      );
    }
  }

  function sendEmailWithFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) {
      console.error(`Form with id "${formId}" not found`);
      return;
    }
    let formfields;
    const formData = new FormData(form);
    if (type === "clientsform") {
      formfields = {
        fullname: `${document.getElementById("clients-firstname").value}  ${
          document.getElementById("clients-lastname").value
        }`,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        companyname: document.getElementById("companyname").value,
        position: document.getElementById("position").value,
        businessType: document.getElementById("business-type").value,
        industry: document.getElementById("industry").value,
        communicationMethod: document.getElementById("communication-method")
          .value,
        country: document.getElementById("country").value,
        streetAddress: document.getElementById("street-address").value,
        streetNumber: document.getElementById("street-number").value,
        postalCode: document.getElementById("postal-code").value,
        town: document.getElementById("town").value,
        goodsHandled: document.getElementById("goods-handled").value,
        volumeOfShipment: document.getElementById("volumeofshipment").value,
        frequency: document.getElementById("frequency").value,
        specialRequirements: document.getElementById("special-requirements")
          .value,
      };
    } else if (type === "driversform") {
      formfields = {
        fullname: `${document.getElementById("clients-firstname").value}  ${
          document.getElementById("clients-lastname").value
        }`,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        companyname: document.getElementById("companyname").value,
        position: document.getElementById("position").value,
        businessType: document.getElementById("business-type").value,
        industry: document.getElementById("industry").value,
        communicationMethod: document.getElementById("communication-method")
          .value,
        country: document.getElementById("country").value,
        streetAddress: document.getElementById("street-address").value,
        streetNumber: document.getElementById("street-number").value,
        postalCode: document.getElementById("postal-code").value,
        town: document.getElementById("town").value,
        goodsHandled: document.getElementById("goods-handled").value,
        volumeOfShipment: document.getElementById("volumeofshipment").value,
        frequency: document.getElementById("frequency").value,
        specialRequirements: document.getElementById("special-requirements")
          .value,
      };
    }
    const templateParams = formfields;

    emailjs.send("service_50gg8cn", "template_ssec7ke", templateParams).then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
        window.location.href = "success-page.html";
      },
      function (error) {
        console.log("FAILED...", error);
        alert("There was an issue sending your message. Please try again.");
      }
    );
  }
  initAutocomplete();
});
// Make sure to initialize EmailJS
