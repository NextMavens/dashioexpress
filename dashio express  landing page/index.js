const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "drivers-details", // All files will be stored in this folder on Cloudinary
    format: async (req, file) => "pdf", // Supported formats: jpg, png, etc.
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage: storage });

app.use(express.static(__dirname));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handle form submission
app.post(
  "/submit-driver-details",
  upload.fields([
    { name: "gewerbeanmeldung-front", maxCount: 1 },
    { name: "gewerbeanmeldung-back", maxCount: 1 },
    { name: "frachtfuhrerversicherung-front", maxCount: 1 },
    { name: "frachtfuhrerversicherung-back", maxCount: 1 },
    { name: "euLizenz-front", maxCount: 1 },
    { name: "euLizenz-back", maxCount: 1 },
  ]),
  (req, res) => {
    // Access text fields
    const driverDetails = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      companyname: req.body.companyname,
      email: req.body.email,
      country: req.body.country,
      phone: req.body.phone,
      streetAddress: req.body["street-address"],
      streetNumber: req.body["street-number"],
      postalCode: req.body["postal-code"],
      town: req.body.town,
      industry: req.body.industry,
      role: req.body.role,
      companySize: req.body.companysize,
      files: req.files, // Files uploaded
    };

    // Optionally, save driverDetails to a database or process them further

    res.json({
      success: true,
      message: "Driver details submitted successfully!",
      data: driverDetails,
    });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
