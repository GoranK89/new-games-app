const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  createFolders: (gameCodes) => ipcRenderer.send("create-folders", gameCodes),

  storeGameCodes: (gameCodes) =>
    ipcRenderer.invoke("store-game-codes", gameCodes),
});
