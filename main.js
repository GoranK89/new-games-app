const { app, BrowserWindow, ipcMain } = require('electron');
const electronReload = require('electron-reload');
const path = require('path');
const fs = require('fs');

// MODULES
const creatNewUploadFolder = require('./createFolders/createNewUploadFolder');
const createGameFolder = require('./createFolders/createGameFolders');
const createLink = require('./createFiles/createLinks');

// PATHS
const desktopPath = app.getPath('desktop');
const mainPath = `${desktopPath}/Icon Upload`;

function storeGameCodes(event, gameCodes) {
  const gameCodesPath = `${mainPath}/gameCodes.json`;

  let jsonData = [];

  if (fs.existsSync(gameCodesPath)) {
    const fileData = fs.readFileSync(gameCodesPath, 'utf8');
    jsonData = JSON.parse(fileData);
  }

  gameCodes.forEach((gameCode) => {
    if (!jsonData.includes(gameCode)) {
      jsonData.push(gameCode);
    }
  });

  const gameCodesJSON = JSON.stringify(jsonData, null, 2);

  fs.writeFileSync(gameCodesPath, gameCodesJSON);
}

const readStoredGameCodes = (path) => {
  if (fs.existsSync(`${path}/gameCodes.json`)) {
    const data = fs.readFileSync(`${path}/gameCodes.json`, 'utf8');
    const gameCodes = JSON.parse(data);
    return gameCodes;
  }
};

function prepareNewUpload(event) {
  const gameCodes = readStoredGameCodes(mainPath);

  // Main folder
  creatNewUploadFolder(desktopPath);

  // Inside folder
  createGameFolder(mainPath, gameCodes);
  createLink(mainPath, gameCodes);
}

//////// Electron specific funtionality ////////
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.loadFile('index.html');
};

app.whenReady().then(() => {
  ipcMain.on('create-folders', prepareNewUpload);
  ipcMain.handle('store-game-codes', storeGameCodes);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  //NOTE: Development only!
  require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`),
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
