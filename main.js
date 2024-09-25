// Key untuk localStorage
const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];

// Fungsi untuk cek apakah localStorage didukung
function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser Anda tidak mendukung localStorage");
    return false;
  }
  return true;
}

// Fungsi untuk menyimpan data ke localStorage
function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
}

// Fungsi untuk memuat data dari localStorage
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData !== null) {
    books = JSON.parse(serializedData);
  }
}

// Fungsi untuk menghasilkan ID buku unik
function generateId() {
  return +new Date();
}

// Fungsi untuk membuat objek buku
function createBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year: parseInt(year), // Mengonversi year ke tipe numerik
    isComplete,
  };
}

// Fungsi untuk menemukan buku berdasarkan ID
function findBook(bookId) {
  return books.find((book) => book.id === bookId);
}

// Fungsi untuk menambahkan buku ke array dan localStorage
function addBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const bookId = generateId();
  const bookObject = createBookObject(bookId, title, author, year, isComplete);
  books.push(bookObject);

  saveData();
  renderBookList();
}

// Fungsi untuk menghapus buku berdasarkan ID
function removeBook(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    saveData();
    renderBookList();
  }
}

// Fungsi untuk memindahkan buku antara rak
function toggleBookCompletion(bookId) {
  const book = findBook(bookId);
  if (book != null) {
    book.isComplete = !book.isComplete;
    saveData();
    renderBookList();
  }
}

// Fungsi untuk membuat elemen buku di HTML
function makeBookElement(book) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = book.title;
  bookTitle.setAttribute("data-testid", "bookItemTitle"); // Tambahkan atribut data-testid

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Penulis: ${book.author}`;
  bookAuthor.setAttribute("data-testid", "bookItemAuthor"); // Tambahkan atribut data-testid

  const bookYear = document.createElement("p");
  bookYear.innerText = `Tahun: ${book.year}`;
  bookYear.setAttribute("data-testid", "bookItemYear"); // Tambahkan atribut data-testid

  const toggleButton = document.createElement("button");
  toggleButton.innerText = book.isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";
  toggleButton.classList.add("card-button");
  toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton"); // Tambahkan atribut data-testid
  toggleButton.addEventListener("click", function () {
    toggleBookCompletion(book.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Hapus Buku";
  deleteButton.classList.add("card-button");
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton"); // Tambahkan atribut data-testid
  deleteButton.addEventListener("click", function () {
    removeBook(book.id);
  });

  const container = document.createElement("div");
  container.classList.add("card");
  container.setAttribute("data-bookid", book.id); // Tambahkan data-bookid
  container.setAttribute("data-testid", "bookItem"); // Tambahkan atribut data-testid untuk kontainer
  container.append(bookTitle, bookAuthor, bookYear, toggleButton, deleteButton);

  return container;
}

// Fungsi untuk merender daftar buku berdasarkan rak
function renderBookList() {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBookElement(book);
    if (!book.isComplete) {
      incompleteBookList.append(bookElement);
    } else {
      completeBookList.append(bookElement);
    }
  }
}

// Fungsi untuk mencari buku
function searchBooks(event) {
  event.preventDefault(); // Mencegah form dari pengiriman default
  const searchQuery = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const filteredBooks = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.toLowerCase().includes(searchQuery) ||
      book.year.toString().includes(searchQuery)
    );
  });

  displaySearchResults(filteredBooks); // Tampilkan hasil pencarian
}

// Fungsi untuk menampilkan hasil pencarian
function displaySearchResults(filteredBooks) {
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = ""; // Kosongkan hasil pencarian sebelumnya

  if (filteredBooks.length === 0) {
    searchResults.innerHTML = "<p>Tidak ada buku yang ditemukan.</p>";
    return;
  }

  for (const book of filteredBooks) {
    const bookElement = makeBookElement(book);
    searchResults.append(bookElement);
  }
}

// Event listener untuk form pencarian
document.getElementById("searchBook").addEventListener("submit", searchBooks);

// Event listener untuk form penambahan buku
document
  .getElementById("bookForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    this.reset(); // Reset form setelah menambah buku
  });

// Memuat data dari localStorage saat halaman dimuat
if (isStorageExist()) {
  loadDataFromStorage();
  renderBookList();
}
