const fs = require("fs");
const csv = require("csv-parser");

const rows = [];
const rooms = [];

fs.createReadStream("new_file.csv")
  .pipe(csv())
  .on("data", data => {
    rows.push(data);
    const roomValue = data.Room.trim();
    rooms.push(roomValue);
  })
  .on("end", () => {
    // console.log(rows);

    const uniqueRooms = Array.from(rooms);
    const consolidatedRooms = consolidateRoomValues(uniqueRooms);

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

      Object.keys(classes).forEach(classTime => {
        const classDescription = classes[classTime];
        consolidatedRooms.forEach(room => {
          if (classDescription.includes(room)) {
            classes[classTime] = classDescription.replace(room, "").trim();
          }
        });
      });

      newRow.classes = classes;

      return newRow;
    });

    const jsonContent = JSON.stringify(updatedRows, null, 2);

    fs.writeFile("output3.json", jsonContent, "utf8", err => {
      if (err) {
        console.error("Error writing JSON file:", err);
      } else {
        console.log("JSON file has been saved successfully.");
      }
    });
  });

function consolidateRoomValues(rooms) {
  const consolidated = [];

  rooms.forEach(room => {
    const existingRoom = consolidated.find(
      r => r.replace(/\s+/g, "") === room.replace(/\s+/g, "")
    );
    if (existingRoom) {
      const consolidatedRoom = existingRoom.includes(" ") ? existingRoom : room;
      if (!consolidated.includes(consolidatedRoom)) {
        consolidated.push(consolidatedRoom);
      }
    } else {
      consolidated.push(room);
    }
  });

  return consolidated;
}
