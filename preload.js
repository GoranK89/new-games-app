const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  createFolder: (folderName) => ipcRenderer.send("create-folder", folderName),
});
