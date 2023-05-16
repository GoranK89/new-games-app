const fs = require("fs");

const specialGameProviders = ["MGSD", "MGSM", "NETEM", "NETED"];

const generateGameLink = (gameCode) => {
  const gameProvider = gameCode.split("_")[0];
  const baseGameLink = `games[]=${gameProvider}/${gameCode}\n`;

  if (specialGameProviders.includes(gameProvider)) {
    const exceptionCode = gameProvider.slice(0, -1);
    return `games[]=${exceptionCode}/${gameCode}\n`;
  } else {
    return baseGameLink;
  }
};

const generateSymlink = (gameCode) => {
  const gameProvider = gameCode.split("_")[0];
  const gameLink = generateGameLink(gameCode);
  const modifiedGameLink = gameLink.replace("games[]=", "").split("_");
  modifiedGameLink.pop();
  const bindSymlinkTo = modifiedGameLink.join("_");

  const baseSymlink = `symlinks[]=${gameProvider}/${gameCode},${bindSymlinkTo}\n`;

  if (specialGameProviders.includes(gameProvider)) {
    const exceptionCode = gameProvider.slice(0, -1);
    return `symlinks[]=${exceptionCode}/${gameCode},${bindSymlinkTo}\n`;
  } else {
    return baseSymlink;
  }
};

const createLink = (path, gameCode) => {
  const gameLink = generateGameLink(gameCode);
  const symlink = generateSymlink(gameCode);

  fs.appendFile(`${path}/links.txt`, gameLink, (err) => {
    if (err) throw err;
  });
};

// if (fs.existsSync(`${path}/links.txt`)) {
//   fs.readFile(`${path}/links.txt`, "utf8", (err, data) => {
//     let existingLinks = data.trim().split("\n");

//     // TODO: check if the gameLink already exists
//     if (existingLinks.some((link) => link.includes(gameCode))) {
//       console.log("LAKSD already exists");
//     }
//   });

//   return;
// }

module.exports = createLink;
