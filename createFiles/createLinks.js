const fs = require('fs');

const specialGameProviders = ['MGSD', 'MGSM', 'NETEM', 'NETED'];

// used for checking if "GP/GP_GAME" exists in an array
// works on simple game codes (names and versions) not on "no buy feature" game codes yet
const getPureGameLink = (gameLink) => {
  const gameLinkParts = gameLink.replace('games[]=', '').split('_');
  const lastPart = Number(gameLinkParts[gameLinkParts.length - 1]);

  if (!isNaN(lastPart)) {
    gameLinkParts.pop();
  }
  const baseGame = gameLinkParts.join('_'); //GP/GP_GAME
  return baseGame;
};

// rework this to remove any extra info from the game code
const removeGameVersion = (gameCode) => {
  const gameCodeTransform = gameCode.split('_');
  const lastItem = Number(gameCodeTransform[gameCodeTransform.length - 1]);

  if (!isNaN(lastItem)) {
    gameCodeTransform.pop();
  }
  const noVersionGameCode = gameCodeTransform.join('_');
  return noVersionGameCode;
};

const createGameLink = (gameCode) => {
  const gameProvider = gameCode.split('_')[0];
  const baseGameLink = `games[]=${gameProvider}/${gameCode}`;

  if (specialGameProviders.includes(gameProvider)) {
    const exceptionCode = gameProvider.slice(0, -1);
    return `games[]=${exceptionCode}/${gameCode}`;
  } else {
    return baseGameLink;
  }
};

const createSymlink = (gameCode, existingLinks) => {
  const gameProvider = gameCode.split('_')[0];
  const gameCodeWithoutVersion = removeGameVersion(gameCode);

  const foundLink = existingLinks.find((item) =>
    item.includes(gameCodeWithoutVersion)
  );
  const foundGameProvider = foundLink.split('/')[0];
  const bindTo = foundLink.replace(foundGameProvider, gameProvider);

  const baseSymlink = `symlinks[]=${gameProvider}/${gameCode},${bindTo}`;

  if (specialGameProviders.includes(gameProvider)) {
    const exceptionCode = gameProvider.slice(0, -1);
    return `symlinks[]=${exceptionCode}/${gameCode},${bindTo}`;
  } else {
    return baseSymlink;
  }
};

const readJsonFile = (path) => {
  if (fs.existsSync(`${path}/gameCodes.json`)) {
    const data = fs.readFileSync(`${path}/gameCodes.json`, 'utf8');
    const gameCodes = JSON.parse(data);
    return gameCodes;
  }
};

const createLinks = (path) => {
  const jsonData = readJsonFile(path);

  const gameLinks = [];
  const symLinks = [];

  jsonData.forEach((gameCode) => {
    const pureGameLink = getPureGameLink(gameCode);

    if (!gameLinks.some((item) => item.includes(pureGameLink))) {
      gameLinks.push(createGameLink(gameCode));
    } else {
      symLinks.push(createSymlink(gameCode, gameLinks));
    }
  });

  console.log('gameLinks', gameLinks);
  console.log('symLinks', symLinks);
};

module.exports = createLinks;
