const fs = require("fs");

const createLaunchFolder = (path) => {
  fs.mkdirSync(path);
};

module.exports = createLaunchFolder;
