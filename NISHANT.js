const ADMIN_USERNAME = "NSSTUDY";
const ADMIN_PASSWORD = "NS@0705";

const loginPage = document.getElementById('loginPage');
const libraryApp = document.getElementById('libraryApp');
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const btnLogout = document.getElementById('btnLogout');
const newFolderInput = document.getElementById('newFolderInput');
const addFolderBtn = document.getElementById('addFolderBtn');
const folderList = document.getElementById('folderList');
const folderSelect = document.getElementById('folderSelect');
const currentFolderName = document.getElementById('currentFolderName');
const addBookForm = document.getElementById('addBookForm');
const bookTitleInput = document.getElementById('bookTitle');
const bookAuthorInput = document.getElementById('bookAuthor');
const bookList = document.getElementById('bookList');
const showAllBtn = document.getElementById('showAllBtn');

let folders = JSON.parse(localStorage.getItem('folders')) || ["All"];
let books = JSON.parse(localStorage.getItem('books')) || [];
let currentFolder = "All";

// Display correct page
function showPage() {
  if(sessionStorage.getItem('isLoggedIn') === 'true'){
    loginPage.style.display = 'none';
    libraryApp.style.display = 'block';
    renderFolders();
    renderBooks();
  } else {
    loginPage.style.display = 'block';
    libraryApp.style.display = 'none';
    errorMsg.textContent = '';
    usernameInput.value = '';
    passwordInput.value = '';
  }
}

// Save to localStorage
function saveData() {
  localStorage.setItem('folders', JSON.stringify(folders));
  localStorage.setItem('books', JSON.stringify(books));
}

// Render folders UI
function renderFolders() {
  folderList.innerHTML = '';
  folderSelect.innerHTML = '';
  folders.forEach(folder => {
    if(folder === "All") {
      let optAll = document.createElement('option');
      optAll.value = "All";
      optAll.textContent = "All";
      folderSelect.appendChild(optAll);
      return;
    }
    let div = document.createElement('div');
    div.textContent = folder;
    div.className = "folderItem" + (folder === currentFolder ? " active" : "");
    div.onclick = () => {
      currentFolder = folder;
      currentFolderName.textContent = folder;
      renderFolders();
      renderBooks();
    };
    let removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.onclick = (e) => {
      e.stopPropagation();
      if(confirm(`Delete folder "${folder}"? Books in it will be marked uncategorized.`)) {
        folders = folders.filter(f => f !== folder);
        books.forEach(book => {
          if(book.folder === folder) book.folder = "Uncategorized";
        });
        if(!folders.includes("Uncategorized")) folders.push("Uncategorized");
        if(currentFolder === folder) {
          currentFolder = "All";
          currentFolderName.textContent = "All";
        }
        saveData();
        renderFolders();
        renderBooks();
      }
    };
    div.appendChild(removeBtn);
    folderList.appendChild(div);

    let option = document.createElement('option');
    option.value = folder;
    option.textContent = folder;
    folderSelect.appendChild(option);
  });
  folderSelect.value = currentFolder;
}

// Render books UI
function renderBooks() {
  bookList.innerHTML = '';
  const filteredBooks = currentFolder === "All" ? books : books.filter(b => b.folder === currentFolder);
  if(filteredBooks.length === 0){
    bookList.textContent = 'No books to display.';
    return;
  }
  filteredBooks.forEach(book => {
    let div = document.createElement('div');
    div.className = 'bookItem';
    div.textContent = `${book.title} by ${book.author} [${book.folder}]`;
    let removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => {
      books = books.filter(b => b !== book);
      saveData();
      renderBooks();
    };
    div.appendChild(removeBtn);
    bookList.appendChild(div);
  });
}

// Login submit event
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  if(usernameInput.value.trim() === ADMIN_USERNAME && passwordInput.value.trim() === ADMIN_PASSWORD){
    sessionStorage.setItem('isLoggedIn','true');
    showPage();
  } else {
    errorMsg.textContent = "Invalid username or password.";
  }
});

// Logout button
btnLogout.addEventListener('click', () => {
  if(confirm('Logout?')) {
    sessionStorage.clear();
    showPage();
  }
});

// Add folder button
addFolderBtn.addEventListener('click', () => {
  let folder = newFolderInput.value.trim();
  if(folder && !folders.includes(folder) && folder !== "All"){
    folders.push(folder);
    saveData();
    renderFolders();
    newFolderInput.value = '';
  } else {
    alert('Invalid or duplicate folder name.');
  }
});

// Add book form submit
addBookForm.addEventListener('submit', e => {
  e.preventDefault();
  let title = bookTitleInput.value.trim();
  let author = bookAuthorInput.value.trim();
  let folder = folderSelect.value;
  if(title && author && folder){
    books.push({ title, author, folder });
    saveData();
    renderBooks();
    bookTitleInput.value = '';
    bookAuthorInput.value = '';
    folderSelect.value = folder;
  }
});

// Show all button
showAllBtn.addEventListener('click', () => {
  currentFolder = "All";
  currentFolderName.textContent = "All";
  renderFolders();
  renderBooks();
});

// On start
showPage();
