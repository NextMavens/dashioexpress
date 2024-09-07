const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = 3000;

// Set up MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // change this if needed
  password: "Elishiba@95", // change this if needed
  database: "driver_data",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database.");
});

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("uploads"));

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Route for handling form submission and file upload
app.post(
  "/upload",
  upload.fields([
    { name: "gewerbeanmeldung-front" },
    { name: "gewerbeanmeldung-back" },
    { name: "frachtfuhrerversicherung-front" },
    { name: "frachtfuhrerversicherung-back" },
    { name: "eu_lizenz-front" },
    { name: "eu_lizenz-back" },
  ]),
  (req, res) => {
    const {
      firstname,
      lastname,
      companyname,
      email,
      country,
      phone,
      street_address,
      street_number,
      postal_code,
      town,
      industry,
      role,
      companysize,
      termsAgreement,
    } = req.body;

    const driverDetails = {
      firstname,
      lastname,
      companyname,
      email,
      country,
      phone,
      street_address,
      street_number,
      postal_code,
      town,
      industry,
      role,
      companysize,
      terms_agreement: termsAgreement ? 1 : 0,
    };

    const sqlInsert = "INSERT INTO driver_details SET ?";
    connection.query(sqlInsert, driverDetails, (err, results) => {
      if (err) throw err;

      const driverId = results.insertId;
      const files = req.files;

      for (const fileType of [
        "gewerbeanmeldung",
        "frachtfuhrerversicherung",
        "eu_lizenz",
      ]) {
        for (const fileSide of ["front", "back"]) {
          const file = files[`${fileType}-${fileSide}`]?.[0];
          if (file) {
            const filePath = file.path;
            const sqlInsertFile =
              "INSERT INTO document_files (driver_id, file_type, file_side, file_path) VALUES (?, ?, ?, ?)";
            connection.query(
              sqlInsertFile,
              [driverId, fileType, fileSide, filePath],
              (err) => {
                if (err) throw err;
              }
            );
          }
        }
      }

      res.send("Form submitted successfully!");
    });
  }
);

// Route for generating the report
app.get("/report", (req, res) => {
  const sqlSelect = "SELECT * FROM driver_details";
  connection.query(sqlSelect, (err, results) => {
    if (err) throw err;

    let reportHtml = "<h1>Driver Report</h1>";

    results.forEach((driver) => {
      reportHtml += `<h2>${driver.firstname} ${driver.lastname}</h2>`;
      reportHtml += `<p>Company: ${driver.companyname}</p>`;
      reportHtml += `<p>Email: ${driver.email}</p>`;
      reportHtml += `<p>Country: ${driver.country}</p>`;
      reportHtml += `<p>Phone: ${driver.phone}</p>`;
      reportHtml += `<p>Address: ${driver.street_address} ${driver.street_number}, ${driver.postal_code} ${driver.town}</p>`;
      reportHtml += `<p>Industry: ${driver.industry}</p>`;
      reportHtml += `<p>Role: ${driver.role}</p>`;
      reportHtml += `<p>Company Size: ${driver.companysize}</p>`;

      reportHtml += "<h3>Uploaded Documents:</h3>";

      const sqlSelectFiles = "SELECT * FROM document_files WHERE driver_id = ?";
      connection.query(sqlSelectFiles, [driver.id], (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
          reportHtml += `<p>Type: ${file.file_type}, Side: ${file.file_side}</p>`;
          reportHtml += `<p>File: <a href="${file.file_path}" download>Download</a></p>`;
        });

        if (results.indexOf(driver) === results.length - 1) {
          res.setHeader("Content-Type", "text/html");
          res.setHeader(
            "Content-Disposition",
            'attachment;filename="driver_report.html"'
          );
          res.send(reportHtml);
        }
      });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
