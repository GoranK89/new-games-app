const fs = require("fs");

const creatNewUploadFolder = (path) => {
  const folderPath = `${path}/Icon Upload`;

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
};

module.exports = creatNewUploadFolder;
