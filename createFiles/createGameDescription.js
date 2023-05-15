const fs = require("fs");

const createGameDescription = (path, gameCode) => {
  const gameTitle = convertGameCodeToTitle(gameCode);

  const txtContent = `type=SLOT\ntitle=${gameTitle}\ncontent=${gameTitle}`;

  fs.writeFile(`${path}/nameThis.txt`, txtContent, (err) => {
    if (err) throw err;
  });
};

function convertGameCodeToTitle(gameCode) {
  const gameTitle = gameCode
    .replace(/^[^_]*_/, "") // Remove the game provider
    .replace(/_\d+$/, "") // Remove the version number
    .replace(/_/g, " ") //Replace underscores with spaces
    .toLowerCase() // Convert to lowercase
    .replace(/(^|\s)\S/g, (match) => match.toUpperCase()); // Capitalize the first letter of each word

  return gameTitle;
}

module.exports = createGameDescription;
