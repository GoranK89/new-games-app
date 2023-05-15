const fs = require("fs");

const generateGameLink = (gameCode) => {
  const gameProvider = gameCode.split("_")[0];
  const baseGameLink = `games[]=${gameProvider}/${gameCode}`;

  if (
    gameProvider === "MGSD" ||
    gameProvider === "MGSM" ||
    gameProvider === "NETEM" ||
    gameProvider === "NETED"
  ) {
    const exceptionCode = gameProvider.slice(0, -1);
    const gameLink = `games[]=${exceptionCode}/${gameCode}`;
    return gameLink;
  } else {
    return baseGameLink;
  }
};

const createLink = (path, gameCode) => {
  const gameLink = generateGameLink(gameCode);

  // if (!fs.existsSync(`${path}/links.txt`)) return;

  // fs.readFile(`${path}/links.txt`, "utf8", (err, data) => {
  //   let existingLinks = data.trim();
  //   existingLinks += "\n";
  //   const existingEntries = existingLinks.split("\n");

  //   if (existingEntries.includes(baseGameLink))
  //     console.log("base game link found, must create a symlink");
  // });

  fs.appendFile(`${path}/links.txt`, gameLink, (err) => {
    if (err) throw err;
  });
};

module.exports = createLink;
