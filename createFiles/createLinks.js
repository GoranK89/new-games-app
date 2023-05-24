const fs = require('fs');

const specialGameProviders = ['MGSD', 'MGSM', 'NETEM', 'NETED'];

// works on simple game codes (names and versions) not on "no buy feature" game codes yet
const extractBaseGame = (gameLink) => {
  const modifiedGameLink = gameLink.replace('games[]=', '').split('_');
  const lastItem = Number(modifiedGameLink[modifiedGameLink.length - 1]);

  if (!isNaN(lastItem)) {
    modifiedGameLink.pop();
  }
  const baseGame = modifiedGameLink.join('_'); //GP/GP_GAME
  return baseGame;
};

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
  const bindTo = foundBindTo?.replace('games[]=', '');

  const gameProvider = gameCode.split('_')[0];
  const baseSymlink = `symlinks[]=${gameProvider}/${gameCode},${bindTo}\n`;

  if (specialGameProviders.includes(gameProvider)) {
    const exceptionCode = gameProvider.slice(0, -1);
    return `symlinks[]=${exceptionCode}/${gameCode},${bindTo}\n`;
  } else {
    return baseSymlink;
  }
};

const readJsonFile = (path) => {
  if (fs.existsSync(`${path}/gameCodes.json`)) {
    const data = fs.readFileSync(`${path}/gameCodes.json`, 'utf8');
    const gameCodes = JSON.parse(data);
    console.log(gameCodes);
    return gameCodes;
  }
};

const createLinks = (path, gameCodes) => {
  const jsonData = readJsonFile(path);

  jsonData.forEach((gameCode) => {
    const gameLink = createGameLink(gameCode);
  });

  /*
  PP_GAME
  PP_GAME_90
  PP_GAME_88
  XX_GAME_95
  ST_GAME_IS_THIS
  ST_GAME_IS_THIS_90
  */
};

module.exports = createLinks;
