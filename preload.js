const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  createFolders: () => ipcRenderer.send('create-folders'),
  storeGameCodes: (gameCodes) =>
    ipcRenderer.invoke('store-game-codes', gameCodes),
  pasteIcons: () => ipcRenderer.send('paste-icons'),
  openIconUrls: () => ipcRenderer.invoke('open-icon-urls'),
  getGameFoldersContent: () => ipcRenderer.invoke('game-folders-content'),
});
