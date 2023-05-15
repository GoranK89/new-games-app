const btnCreateFolder = document.getElementById("create-folder");
const folderNameInput = document.getElementById("folder-name");

btnCreateFolder.addEventListener("click", () => {
  window.electronAPI.createFolder(folderNameInput.value.toUpperCase());
  folderNameInput.value = "";
});
