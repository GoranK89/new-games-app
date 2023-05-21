const fs = require("fs");

const specialGameProviders = ["MGSD", "MGSM", "NETEM", "NETED"];

// works on simple game codes (names and versions) not on "no buy feature" game codes yet
const extractBaseGame = (gameLink) => {
  const modifiedGameLink = gameLink.replace("games[]=", "").split("_");
  const lastItem = Number(modifiedGameLink[modifiedGameLink.length - 1]);

  if (!isNaN(lastItem)) {
    modifiedGameLink.pop();
  }
  const baseGame = modifiedGameLink.join("_"); //GP/GP_GAME
  console.log(
    `${gameLink} converted to: ${baseGame}, checking if converted value exists in Icons.txt`
  );
  return baseGame;
};

const removeGameVersion = (gameCode) => {
  const gameCodeTransform = gameCode.split("_");
  const lastItem = Number(gameCodeTransform[gameCodeTransform.length - 1]);

  if (!isNaN(lastItem)) {
    gameCodeTransform.pop();
  }
  const noVersionGameCode = gameCodeTransform.join("_");
  console.log(
    `${gameCode} version number ${lastItem} removed, symlink will be bound to ${noVersionGameCode}`
  );
  return noVersionGameCode;
};

const createGameLink = (gameCode) => {
  const gameProvider = gameCode.split("_")[0];
  const baseGameLink = `games[]=${gameProvider}/${gameCode}\n`;

  if (specialGameProviders.includes(gameProvider)) {
    const exceptionCode = gameProvider.slice(0, -1);
    return `games[]=${exceptionCode}/${gameCode}\n`;
  } else {
    return baseGameLink;
  }
};

const createSymlink = (gameCode, existingLinks) => {
  const baseGame = extractBaseGame(createGameLink(gameCode));
  const foundBindTo = existingLinks.find((item) => item.includes(baseGame));
  const bindTo = foundBindTo?.replace("games[]=", "");

  const gameProvider = gameCode.split("_")[0];
  const baseSymlink = `symlinks[]=${gameProvider}/${gameCode},${bindTo}\n`;

  if (specialGameProviders.includes(gameProvider)) {
    const exceptionCode = gameProvider.slice(0, -1);
    return `symlinks[]=${exceptionCode}/${gameCode},${bindTo}\n`;
  } else {
    return baseSymlink;
  }
};

const createLink = (path, gameCode) => {
  const gameLink = createGameLink(gameCode);
  const baseGame = extractBaseGame(gameLink);
  const noVersionGameCode = removeGameVersion(gameCode);

  if (fs.existsSync(`${path}/Icons.txt`)) {
    fs.readFile(`${path}/Icons.txt`, "utf8", (err, data) => {
      let existingLinks = data.trim().split("\n");

      const symlink = createSymlink(gameCode, existingLinks);

      // if game gameLink does not exist and gameCode without version does not exist create games link
      if (
        !existingLinks.some((link) => link.includes(gameLink)) &&
        !existingLinks.some((link) => link.includes(noVersionGameCode))
      ) {
        fs.appendFile(`${path}/Icons.txt`, gameLink, (err) => {
          if (err) throw err;
        });
      }

      // if string GP/GP_GAME exists create symlink
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
