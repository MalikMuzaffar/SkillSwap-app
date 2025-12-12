// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./public/temp")
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname);
//     }
//   })
  
// export const upload = multer({ 
//     storage, 
// })



/////////////////////////       NEW            CODE            BELOW                 /////////////

import multer from "multer";
import fs from "fs";
import path from "path";

// Use a dedicated temp folder that won't clash with anything else
const tempDir = path.join("public", "uploads", "temp");

// Ensure folder exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    // Add timestamp to avoid filename conflicts
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
