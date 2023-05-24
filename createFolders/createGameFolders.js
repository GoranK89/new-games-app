const fs = require('fs');
const createLaunchFolder = require('./createLaunchFolder');
const createGameDescription = require('../createFiles/createGameDescription');

const createGameFolders = (path, gameCodes) => {
  const gameNames = new Set();

  gameCodes.forEach((gameCode) => {
    const folderPath = `${path}/${gameCode}`;
    const gameName = gameCode.split('_')[0];

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
