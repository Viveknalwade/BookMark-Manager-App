const getBookmarks = () => {
  const stored = localStorage.getItem("bookmarks");
  try {
    const parsed = JSON.parse(stored);
    const isValidArray = Array.isArray(parsed) &&
      parsed.every(item =>
        item &&
        typeof item === "object" &&
        "name" in item &&
        "category" in item &&
        "url" in item
      );
    return isValidArray ? parsed : [];
  } catch {
    return [];
  }
};
const displayOrCloseForm = () => {
  document.getElementById("main-section").classList.toggle("hidden");
  document.getElementById("form-section").classList.toggle("hidden");
};

document.getElementById("add-bookmark-button").addEventListener("click", () => {
  const category = document.getElementById("category-dropdown").value;
  document.querySelector(".category-name").innerText = category;
  displayOrCloseForm();
});

document.getElementById("close-form-button").addEventListener("click", displayOrCloseForm);


document.getElementById("add-bookmark-button-form").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const url = document.getElementById("url").value.trim();
  const category = document.getElementById("category-dropdown").value;

  if (!name || !url) return;

  const bookmarks = getBookmarks();
  bookmarks.push({ name, category, url });
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  document.getElementById("name").value = "";
  document.getElementById("url").value = "";
  displayOrCloseForm();
});

const displayOrHideCategory = () => {
  document.getElementById("main-section").classList.toggle("hidden");
  document.getElementById("bookmark-list-section").classList.toggle("hidden");
};

document.getElementById("view-category-button").addEventListener("click", () => {
  const category = document.getElementById("category-dropdown").value;
  document.querySelector(".category-name").innerText = category;

  const bookmarks = getBookmarks();
  const filtered = bookmarks.filter(b => b.category === category);
  const list = document.getElementById("category-list");

  if (filtered.length === 0) {
    list.innerHTML = "<p>No Bookmarks Found</p>";
  } else {
    list.innerHTML = filtered.map(b => `
      <input type="radio" id="${b.name}" name="bookmark" value="${b.name}">
      <label for="${b.name}">
        <a href="${b.url}" target="_blank">${b.name}</a>
      </label>
    `).join("");
  }

  displayOrHideCategory();
});

document.getElementById("close-list-button").addEventListener("click", displayOrHideCategory);

document.getElementById("delete-bookmark-button").addEventListener("click", () => {
  const selected = document.querySelector('input[name="bookmark"]:checked');
  if (!selected) return;

  const category = document.querySelector(".category-name").innerText;
  let bookmarks = getBookmarks();
  bookmarks = bookmarks.filter(b => !(b.name === selected.value && b.category === category));
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  document.getElementById("view-category-button").click(); // Refresh list
});