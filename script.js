const modalShow = document.getElementById('show-modal'); // h1 -- title
const bookmarksContainer = document.getElementById('bookmarks-container');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteTitle = document.getElementById('website-title');
const websiteURL = document.getElementById('website-url');
const footer = document.querySelector('.footer');

let bookmarks = [];

/* ------- MODAL ---------- */

function showModal() {
    modal.classList.add('show-modal');
    websiteTitle.focus();
    footer.setAttribute('hidden', true);
}

function hideModal() {
    modal.classList.remove('show-modal');
    footer.removeAttribute('hidden');
}

modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', hideModal);
window.addEventListener('click', (e) => (e.target === modal) ? hideModal() : false);


/* ------- VALIDATE FORM ---------- */

function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);

    if (!nameValue || !urlValue) {
        alert('🤯 Please enter missing field.');
        return false;
    }

    if (urlValue.match(regex)) {
        return true;
    } else {
        alert('Uh oh! 😢 Please enter a valid web address.');
        return false;
    }
}

/* ------- POPULATE DOM ---------- */

function buildBookmarks() {

    bookmarksContainer.textContent = '';

    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark;
        // Item
        const item = document.createElement('div');
        item.classList.add('item');

        // Close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

        // Favicon Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');

        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');

        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;

        // Append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

/* ------- BOOKMARKS & LOCAL STORAGE ---------- */

// Fetch Bookmarks From Local Storage
function fetchBookmarks() {
    // Get bookmarks from localStorage if available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create bookmarks array in localStorage
        bookmarks = [
            {
                name: 'Google',
                url: 'https://google.com',
            }
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });

    // update bookmarks array in localStorage and DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Handle Data from Form
function storeBookmark(e) {
    e.preventDefault(); // prevent from sending response to server
    const nameValue = websiteTitle.value;
    let urlValue = websiteURL.value;

    if (!urlValue.includes('http://', 'https://')) {
        urlValue = `https://${urlValue}`;
    }

    if (!validate(nameValue, urlValue)) {
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };

    bookmarks.push(bookmark);

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteTitle.focus();
}

bookmarkForm.addEventListener('submit', storeBookmark);

// onLoad
fetchBookmarks();

