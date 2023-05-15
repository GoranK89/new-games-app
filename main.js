const { app, BrowserWindow, ipcMain } = require("electron");
const electronReload = require("electron-reload");
const path = require("path");
const fs = require("fs");

const creatNewUploadFolder = require("./createFolders/createNewUploadFolder");
const createGameFolder = require("./createFolders/createGameFolder");
const createLaunchFolder = require("./createFolders/createLaunchFolder");

const createGameDescription = require("./createFiles/createGameDescription");
const createLink = require("./createFiles/createLinks");

function prepareNewUpload(event, folderName) {
  const desktopPath = app.getPath("desktop");
  const mainPath = `${desktopPath}/Icon Upload`;
  const subPath = `${mainPath}/${folderName}`;

  // Main folder
  creatNewUploadFolder(desktopPath);
  createLink(mainPath, folderName);

  // Inside folder
  createGameFolder(subPath, folderName);

  // Inside subfolders
  createLaunchFolder(`${subPath}/launch`);
  createGameDescription(subPath, folderName);
}

// maybe it's safer to use game codes instead of names
function generateGameCode(gameProvider, gameName) {
  const sanitized = gameName.replace(/[^a-zA-Z ]/g, "").toUpperCase();
  const gameCode = sanitized.replace(/\s+/g, "_");
  const finalGameCode = `${gameProvider}_${gameCode}`;

  console.log(finalGameCode);
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("index.html");
};

app.whenReady().then(() => {
  ipcMain.on("create-folder", prepareNewUpload);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  //NOTE: Development only!
  require("electron-reload")(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`),
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
