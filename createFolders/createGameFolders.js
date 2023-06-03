const fs = require('fs');
const createLaunchFolder = require('./createLaunchFolder');
const createGameDescription = require('../createFiles/createGameDescription');

const generatePureGameCode = (gameCode) => {
  // cut away the game provider
  const gameCodeParts = gameCode.split('_');
  gameCodeParts.shift();
  // check if the last part is a number and recognize if it is a version (RTP)
  const lastPart = gameCodeParts[gameCodeParts.length - 1];
  const last2Letters = lastPart.slice(-2);
  const last2Numbers = Number(last2Letters);
  const isVersion =
    last2Numbers > 80 && last2Numbers < 100 ? last2Numbers : null;
  // pop the last part if it is a version (RTP)
  if (isVersion) {
    gameCodeParts.pop();
  }

  const pureGameCode = gameCodeParts.join('_');
  return pureGameCode;
};

const createGameFolders = (path, gameCodes) => {
  const uniqueFolderNames = new Set();

  gameCodes?.forEach((gameCode) => {
    const folderPath = `${path}/${gameCode}`;
    const pureGameCode = generatePureGameCode(gameCode);

    if (!uniqueFolderNames.has(pureGameCode)) {
      uniqueFolderNames.add(pureGameCode);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        createLaunchFolder(`${folderPath}/launch`);
        createLaunchFolder(`${folderPath}/original`);
        createGameDescription(`${folderPath}`, gameCode);
      } else {
        console.log(`Folder for ${gameCode} already exists`);
      }
    }
  });
};

module.exports = createGameFolders;
