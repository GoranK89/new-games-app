const fs = require("fs");

const createGameFolder = (path, folderName) => {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(path);
  } else {
    console.log(`Folder ${folderName} already exists`);
  }
};

module.exports = createGameFolder;
