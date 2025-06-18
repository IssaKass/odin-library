// ===========================
// 1. DOM References
// ===========================
const mangaContainerEl = document.querySelector(".manga-container");
const addMangaButton = document.getElementById("addMangaButton");
const addMangaDialog = document.getElementById("addMangaDialog");
const closeBtns = addMangaDialog.querySelectorAll(".dialog__close");
const form = addMangaDialog.querySelector("form");

// ===========================
// 2. Constructor + Prototype
// ===========================
function Manga(title, author, description, chapters, read) {
	this.id = crypto.randomUUID();
	this.title = title;
	this.author = author;
	this.description = description;
	this.chapters = chapters;
	this.read = read;
}

Manga.prototype.toggleRead = function () {
	this.read = !this.read;
};

// ===========================
// 3. Library (Data Management)
// ===========================
const library = {
	mangaList: [],

	add(manga) {
		this.mangaList.push(manga);
		this.render();
	},
	remove(id) {
		this.mangaList = this.mangaList.filter((manga) => manga.id !== id);
		this.render();
	},
	toggleRead(id) {
		const manga = this.mangaList.find((manga) => manga.id === id);
		if (manga) {
			manga.toggleRead();
			this.render();
		}
	},
	render() {
		mangaContainerEl.innerHTML = "";
		this.mangaList.forEach((manga) =>
			mangaContainerEl.appendChild(createMangaElement(manga))
		);
	},
};

// ===========================
// 4. UI Creation
// ===========================
function createMangaElement(manga) {
	const el = document.createElement("div");
	el.className = "manga";
	el.dataset.id = manga.id;

	el.innerHTML = `
		<div class="manga__image"></div>
		<div class="manga__summary">
			<h3 class="manga__title">${manga.title}</h3>
			<p class="manga__author">${manga.author}</p>
			<p class="manga__chapters">${manga.chapters} chapter${
		manga.chapters === 1 ? "" : "s"
	}</p>
			${
				manga.description
					? `<p class="manga__description">${manga.description}</p>`
					: ""
			}
			<footer class="manga__footer">
				<button type="button" class="btn ${
					manga.read ? "btn--success" : "btn--secondary"
				} btn--sm read-btn">
					${manga.read ? "Completed" : "Read Now"}
				</button>
				<button type="button" class="btn btn--error btn--sm delete-btn">
					<i class="fa-solid fa-trash"></i>
				</button>
			</footer>
		</div>
	`;

	el.querySelector(".read-btn").addEventListener("click", () =>
		library.toggleRead(manga.id)
	);
	el.querySelector(".delete-btn").addEventListener("click", () => {
		if (confirm(`Delete "${manga.title}" manga?`)) {
			library.remove(manga.id);
		}
	});

	return el;
}

// ===========================
// 5. Dialog and Form
// ===========================

function showDialog() {
	addMangaDialog.showModal();
}

function closeDialog() {
	addMangaDialog.close();
}

form.addEventListener("submit", (event) => {
	event.preventDefault();

	const manga = new Manga(
		form.title.value,
		form.author.value,
		form.description.value,
		Number(form.chapters.value),
		form.read.checked
	);

	library.add(manga);
	form.reset();
	addMangaDialog.close();
});

addMangaButton.addEventListener("click", () => addMangaDialog.showModal());
closeBtns.forEach((btn) =>
	btn.addEventListener("click", () => {
		form.reset();
		addMangaDialog.close();
	})
);

// ===========================
// 6. Initial Entries
// ===========================
[
	new Manga(
		"Case Closed",
		"Aoyama Gosho",
		"A high school detective is turned into a child and continues solving mysteries.",
		1146,
		true
	),
	new Manga(
		"One Piece",
		"Eiichiro Oda",
		"A pirate sets out on a journey to find the legendary treasure One Piece.",
		1100,
		false
	),
	new Manga(
		"Demon Slayer",
		"Koyoharu Gotouge",
		"A boy becomes a demon slayer to avenge his family and cure his sister.",
		205,
		true
	),
].forEach((manga) => library.add(manga));
