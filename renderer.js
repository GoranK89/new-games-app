const btnCreateFolder = document.getElementById('btn-create-folder');
const btnPasteIcons = document.getElementById('btn-paste-icons');
const btnCreateUrls = document.getElementById('btn-create-url');

const folderNameInput = document.getElementById('input-folder-names');

// Table
const table = document.getElementById('folders-table');
const tr = document.getElementsByTagName('tr');

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
btnCreateFolder.addEventListener('click', async () => {
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

  renderGameCodes();
});

// COPY PASTE ICONS
btnPasteIcons.addEventListener('click', () => {
  if (btnPasteIcons.classList.contains('btn-disabled')) return;
  window.electronAPI.pasteIcons();

  btnPasteIcons.classList.remove('btn-yellow');
  btnPasteIcons.classList.add('btn-disabled');
});

// OPEN URLS
btnCreateUrls.addEventListener('click', () => {
  window.electronAPI.openIconUrls();
});

const renderGameCodes = async () => {
  const gameCodesForRendering = await window.electronAPI.renderGameCodes();

  table.innerHTML = `
    <tr>
      <th>Folder</th>
      <th>Icons</th>
      <th>Game title</th>
    </tr>
  `;

  gameCodesForRendering.forEach((gameCode) => {
    table.innerHTML += `
        <tr>
          <td>${gameCode}</td>
          <td>None</td>
          <td>Game Name</td>
        </tr>
    `;
  });
};

renderGameCodes();
