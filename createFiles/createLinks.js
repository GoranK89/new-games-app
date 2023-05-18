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

const generateSymlink = (gameCode, bindTo) => {
  const gameProvider = gameCode.split("_")[0];
  const baseSymlink = `symlinks[]=${gameProvider}/${gameCode},${bindTo}\n`;

  if (specialGameProviders.includes(gameProvider)) {
    const exceptionCode = gameProvider.slice(0, -1);
    return `symlinks[]=${exceptionCode}/${gameCode},${bindSymlinkTo}\n`;
  } else {
    return baseSymlink;
  }
};

const createLink = (path, gameCode) => {
  const gameLink = generateGameLink(gameCode);

  if (fs.existsSync(`${path}/Icons.txt`)) {
    fs.readFile(`${path}/Icons.txt`, "utf8", (err, data) => {
      let existingLinks = data.trim().split("\n");

      const modifiedGameLink = gameLink.replace("games[]=", "").split("_");
      modifiedGameLink.pop();
      const baseGame = modifiedGameLink.join("_"); //GP/GP_GAME

      const gameCodeNoVersion = gameCode.split("_");
      gameCodeNoVersion.pop();
      const baseGameCode = gameCodeNoVersion.join("_");

      const foundBindTo = existingLinks.find((item) => item.includes(baseGame));
      const bindTo = foundBindTo?.replace("games[]=", "");

      const symlink = generateSymlink(gameCode, bindTo);

      if (
        !existingLinks.some((link) => link.includes(gameLink)) &&
        !existingLinks.some((link) => link.includes(baseGameCode))
      ) {
        fs.appendFile(`${path}/Icons.txt`, gameLink, (err) => {
          if (err) throw err;
        });
      }

      if (existingLinks.some((link) => link.includes(baseGame))) {
        fs.appendFile(`${path}/Icons.txt`, symlink, (err) => {
          if (err) throw err;
        });
      }
    });
  } else {
    fs.appendFile(`${path}/Icons.txt`, gameLink, (err) => {
      if (err) throw err;
    });
  }
};

module.exports = createLink;
