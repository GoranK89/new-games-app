const fs = require('fs');
const createLaunchFolder = require('./createLaunchFolder');
const createGameDescription = require('../createFiles/createGameDescription');

const addGameCodesToSet = (gameCode) => {
  if (gameCode.includes('MGSD') || gameCode.includes('MGSM')) {
    const MGScode = processMGScodes(gameCode);
    return MGScode;
  } else {
    const defaultGameCode = processDefaultCodes(gameCode);
    return defaultGameCode;
  }
};

const processDefaultCodes = (gameCode) => {
  const gameCodeParts = gameCode.split('_');
  const lastPart = Number(gameCodeParts[gameCodeParts.length - 1]);
  if (!isNaN(lastPart)) {
    gameCodeParts.pop();
  }
  const gameName = gameCodeParts.join('_');
  return gameName;
};

const processMGScodes = (gameCode) => {
  const gameCodeParts = gameCode.split('_');
  const lastPart = gameCodeParts[gameCodeParts.length - 1];
  const last2Letters = lastPart.slice(-2);
  const last2Numbers = Number(last2Letters);
  gameCodeParts.shift();
  if (!isNaN(last2Numbers)) {
    gameCodeParts.pop();
  }
  const noGpGameCode = gameCodeParts.join('_');
  return noGpGameCode;
};

const createGameFolders = (path, gameCodes) => {
  const gameNames = new Set();

  gameCodes?.forEach((gameCode) => {
    const folderPath = `${path}/${gameCode}`;
    const gameName = addGameCodesToSet(gameCode);

    if (!gameNames.has(gameName)) {
      gameNames.add(gameName);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        createLaunchFolder(`${folderPath}/launch`);
        createLaunchFolder(`${folderPath}/original`);
        createGameDescription(`${folderPath}`, gameCode);
      } else {
        console.log(`Folder ${gameCode} already exists`);
      }
    }
  });
};

module.exports = createGameFolders;
