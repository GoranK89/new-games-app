const fs = require('fs');
const createLaunchFolder = require('./createLaunchFolder');
const createGameDescription = require('../createFiles/createGameDescription');

const createGameFolders = (path, gameCodes) => {
  const gameNames = new Set();

  gameCodes?.forEach((gameCode) => {
    const folderPath = `${path}/${gameCode}`;
    const gameCodeParts = gameCode.split('_');
    const lastPart = Number(gameCodeParts[gameCodeParts.length - 1]);

    if (!isNaN(lastPart)) {
      gameCodeParts.pop();
    }

    const gameName = gameCodeParts.join('_');

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
