const btnCreateFolder = document.getElementById('btn-create-folder');
const folderNameInput = document.getElementById('input-folder-names');

const sideMenu = document.querySelector('.side-menu__list');

sideMenu.addEventListener('click', (event) => {
  const menuItem = event.target.closest('a');
  if (!menuItem) return;

  sideMenu.querySelectorAll('a').forEach((item) => {
    item.classList.remove('active');
  });

  menuItem.classList.toggle('active');
});

btnCreateFolder.addEventListener('click', () => {
  // if (!folderNameInput.value) return;
  const gameCodes = folderNameInput.value
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((gameCode) => gameCode.trim());

  window.electronAPI.storeGameCodes(gameCodes);
  window.electronAPI.createFolders();
  folderNameInput.value = '';
});
