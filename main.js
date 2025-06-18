// ===========================
// 1. DOM References
// ===========================
const mangaContainerEl = document.querySelector(".manga-container");
const addMangaButton = document.getElementById("addMangaButton");
const addMangaDialog = document.getElementById("addMangaDialog");
const closeBtns = addMangaDialog.querySelectorAll(".dialog__close");
const form = addMangaDialog.querySelector("form");

// ===========================
// 2. Constructor
// ===========================
function Manga(title, author, description, chapters, read) {
	this.id = crypto.randomUUID();
	this.title = title;
	this.author = author;
	this.description = description;
	this.chapters = chapters;
	this.read = read;
}

// ===========================
// 3. Library (Data Management)
// ===========================
const library = {
	mangaList: [],

	findManga: function (id) {
		return this.mangaList.find((manga) => manga.id === id);
	},
	addManga: function (manga) {
		this.mangaList.push(manga);
	},
	removeManga: function (id) {
		const index = this.mangaList.findIndex((manga) => manga.id === id);
		if (index !== -1) {
			this.mangaList.splice(index, 1);
		}
	},
	toggleReadManga: function (id) {
		const manga = this.mangaList.find((manga) => manga.id === id);
		if (manga) {
			manga.read = !manga.read;
		}
	},
};

// ===========================
// 4. UI Rendering
// ===========================
function createMangaElement(manga) {
	const { id, title, author, description, chapters, read } = manga;

	const mangaEl = document.createElement("div");
	mangaEl.className = "manga";
	mangaEl.dataset.id = id;
	mangaEl.innerHTML = `
		<div class="manga__image"></div>
		<div class="manga__summary">
			<h3 class="manga__title">${title}</h3>
			<p class="manga__author">${author}</p>
			<p class="manga__chapters">${chapters} chapter${chapters === 1 ? "" : "s"}</p>
			${description ? `<p class="manga__description">${description}</p>` : ""}
			<footer class="manga__footer">
				<button type="button" class="btn btn--secondary btn--sm read-btn">
				</button>
				<button type="button" class="btn btn--error btn--sm delete-btn">
					<i class="fa-solid fa-trash"></i>
				</button>
			</footer>
		</div>
	`;

	const readBtn = mangaEl.querySelector(".read-btn");
	readBtn.textContent = read ? "Completed" : "Read Now";
	readBtn.classList.toggle("btn--success", read);
	readBtn.classList.toggle("btn--secondary", !read);

	readBtn.addEventListener("click", () => toggleReadManga(id));

	const editBtn = mangaEl.querySelector(".delete-btn");
	editBtn.addEventListener("click", () => editManga(id));

	const deleteBtn = mangaEl.querySelector(".delete-btn");
	deleteBtn.addEventListener("click", () => removeManga(id));

	return mangaEl;
}

function displayLibrary() {
	mangaContainerEl.innerHTML = "";

	library.mangaList.forEach((manga) => {
		const mangaEl = createMangaElement(manga);
		mangaContainerEl.appendChild(mangaEl);
	});
}

// ===========================
// 5. UI Interaction Handlers
// ===========================
function addManga(manga) {
	library.addManga(manga);
	displayLibrary();
}

function toggleReadManga(mangaId) {
	library.toggleReadManga(mangaId);
	displayLibrary();
}

function removeManga(mangaId) {
	const manga = library.findManga(mangaId);

	const remove = confirm(
		`Are you sure you want to delete "${manga.title}" manga?`
	);
	if (!remove) return;

	library.removeManga(mangaId);
	displayLibrary();
}

function showDialog() {
	addMangaDialog.showModal();
}

function closeDialog() {
	addMangaDialog.close();
}

form.addEventListener("submit", function (event) {
	event.preventDefault();

	const title = form.title.value;
	const author = form.author.value;
	const chapters = Number(form.chapters.value);
	const description = form.description.value;
	const read = form.read.checked;

	const manga = new Manga(title, author, description, chapters, read);
	addManga(manga);

	form.reset();
	closeDialog();
});

// ===========================
// 6. Event Listeners
// ===========================
addMangaButton.addEventListener("click", showDialog);
closeBtns.forEach((btn) => btn.addEventListener("click", closeDialog));

// ===========================
// 7. Initial Manga Entries
// ===========================
addManga(
	new Manga(
		"Case Closed",
		"Aoyama Gosho",
		"A high school detective is turned into a child and continues solving mysteries.",
		1146,
		true
	)
);

addManga(
	new Manga(
		"One Piece",
		"Eiichiro Oda",
		"A pirate sets out on a journey to find the legendary treasure One Piece.",
		1100,
		false
	)
);

addManga(
	new Manga(
		"Demon Slayer",
		"Koyoharu Gotouge",
		"A boy becomes a demon slayer to avenge his family and cure his sister.",
		205,
		true
	)
);
