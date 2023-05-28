const btnCreateFolder = document.getElementById('btn-create-folder');
const folderNameInput = document.getElementById('input-folder-names');

btnCreateFolder.addEventListener('click', () => {
  // if (!folderNameInput.value) return;
  const gameCodes = folderNameInput.value
    .toUpperCase()
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((gameCode) => gameCode.trim());

  window.electronAPI.storeGameCodes(gameCodes);
  window.electronAPI.createFolders();
  folderNameInput.value = '';
});
