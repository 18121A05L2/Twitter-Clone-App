import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, "database.json");

// Helper function to read data from JSON file
export const readFromDatabase = (hash) => {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    console.log(JSON.parse(data));
    return JSON.parse(data)[hash];
  } catch (err) {
    console.error("Error reading data from file:", err);
    return [];
  }
};

// Helper function to write data to JSON file
export const writeToDatabase = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing data to file:", err);
  }
};

// Helper function to update data in JSON file
export const updateDatabase = (newData) => {
  try {
    // Read existing data
    const data = fs.readFileSync(dataFilePath, "utf8");
    let existingData = JSON.parse(data);
    console.log({ newData });

    existingData = { ...existingData, ...newData };

    // Write updated data back to file
    fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));

    return newData;
  } catch (err) {
    console.error("Error updating data file:", err);
    throw err;
  }
};
