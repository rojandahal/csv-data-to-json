const fs = require("fs");
const csv = require("csv-parser");

const rows = [];

fs.createReadStream("new_file.csv")
  .pipe(csv())
  .on("data", data => {
    rows.push(data);
  })
  .on("end", () => {
    console.log(rows);

    const updatedRows = rows.map(row => {
      const newRow = { ...row };
      const classes = {};

      Object.keys(row).forEach(key => {
        if (
          key !== "Day" &&
          key !== "Batch Semester" &&
          key !== "Room" &&
          key !== "Group" &&
          key !== "﻿"
        ) {
          classes[key] = row[key];
          delete newRow[key];
        }
      });

      newRow.classes = classes;

      return newRow;
    });

    console.log(updatedRows);
    const jsonContent = JSON.stringify(updatedRows, null, 2);

    fs.writeFile("output3.json", jsonContent, "utf8", err => {
      if (err) {
        console.error("Error writing JSON file:", err);
      } else {
        console.log("JSON file has been saved successfully.");
      }
    });
  });
