const btnCreateFolder = document.getElementById('btn-create-folder');
const btnPasteIcons = document.getElementById('btn-paste-icons');
const btnCreateUrls = document.getElementById('btn-create-url');

const urlOutput = document.getElementById('url-output');

const folderNameInput = document.getElementById('input-folder-names');

const sideMenu = document.querySelector('.side-menu__list');
const sections = {
  dashboard: document.getElementById('dashboard-section'),
  gameCodes: document.getElementById('game-codes-section'),
  gameFolders: document.getElementById('game-folders-section'),
  uploadCheck: document.getElementById('upload-check-section'),
};

// SIDE MENU
sideMenu.addEventListener('click', (event) => {
  const menuItem = event.target.closest('a');
  if (!menuItem) return;

  sideMenu.querySelectorAll('a').forEach((item) => {
    item.classList.remove('active');
  });

  menuItem.classList.toggle('active');

  for (const section in sections) {
    if (section === menuItem.getAttribute('data')) {
      sections[section].classList.remove('hidden');
    } else {
      sections[section].classList.add('hidden');
    }
  }
});

// CREATE FOLDERS
btnCreateFolder.addEventListener('click', () => {
  // if (!folderNameInput.value) return;
  const gameCodes = folderNameInput.value
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((gameCode) => gameCode.trim());

  window.electronAPI.storeGameCodes(gameCodes);
  window.electronAPI.createFolders();
  folderNameInput.value = '';

  btnPasteIcons.classList.remove('btn-disabled');
  btnPasteIcons.classList.add('btn-yellow');
});

// COPY PASTE ICONS
btnPasteIcons.addEventListener('click', () => {
  if (btnPasteIcons.classList.contains('btn-disabled')) return;
  window.electronAPI.pasteIcons();

  btnPasteIcons.classList.remove('btn-yellow');
  btnPasteIcons.classList.add('btn-disabled');
});

// CREATE URLS
btnCreateUrls.addEventListener('click', async () => {
  const urls = await window.electronAPI.generateIconUrls();
  urlOutput.innerHTML = urls.join('<br>');
  // add another button "open all" to send urls back to main to open them in the default browser?
});
