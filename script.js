const artworkCollection = [
    {
        image: "images/pixel animal1.avif",
        alt: "Pixel-art llama",
        title: "LLAMA",
        artist: "Artist Unknown",
        year: "2026",
        description: "A Llama",
        label: "View Llama artwork"
    },
    {
        image: "images/Screenshot 2026-09-18 at 1.37.33 AM.png",
        alt: "Pixel-art hamburger",
        title: "HAMBURGER",
        artist: "Bun in a million",
        year: "2026",
        description: "Not Edible",
        label: "View Hamburger artwork"
    },
    {
        image: "images/pixel book.png",
        alt: "Pixel-art open book",
        title: "BOOK",
        artist: "Unread",
        year: "2026",
        description: "Treat yo'shelf",
        label: "View Open Book artwork"
    },
    {
        image: "images/pixel robot.avif",
        alt: "Pixel-art robot",
        title: "ROBOT",
        artist: "#1 Employee",
        year: "2026",
        description: "A bit Rusty",
        label: "View Robot artwork"
    },
    {
        image: "images/pixel disco ball.webp",
        alt: "Pixel-art disco ball",
        title: "DISCO BALL",
        artist: "Party has Ended",
        year: "2026",
        description: "Having a Ball",
        label: "View Disco Ball artwork"
    },
    {
        image: "images/pixel pizza.jpeg",
        alt: "Pixel-art pizza",
        title: "PIZZA",
        artist: "Slice of life",
        year: "2026",
        description: "a little Cheesy",
        label: "View Pizza artwork"
    },
    {
        image: "images/pixel dog.jpg",
        alt: "Pixel-art dog",
        title: "DOG",
        artist: "Vincent Van Dog",
        year: "2026",
        description: "A tail to Remember",
        label: "View Dog artwork"
    },
    {
        image: "images/pixel flower.webp",
        alt: "Pixel-art flower",
        title: "FLOWER",
        artist: "Bloom Service",
        year: "2026",
        description: "Petal to the Metal",
        label: "View Flower artwork"
    },
    {
        image: "images/pixel ghost.avif",
        alt: "Pixel-art ghost",
        title: "GHOST",
        artist: "Ghost Writer",
        year: "2026",
        description: "Dying to be Seen",
        label: "View Ghost artwork"
    },
    {
        image: "images/pixel duck.png",
        alt: "Pixel-art duck",
        title: "DUCK",
        artist: "Duck Duck Goose",
        year: "2026",
        description: "Duck and cover",
        label: "View Duck artwork"
    }
];

const artworksContainer = document.querySelector(".artworks");
const galleryMessage = document.querySelector("#galleryMessage");
const artTitle = document.querySelector("#artTitle");
const artArtist = document.querySelector("#artArtist");
const artYear = document.querySelector("#artYear");
const artCaption = document.querySelector("#artCaption");
const previousSelectionKey = "fineArtGalleryPreviousSelection";

// Shuffle a copy so the artwork collection remains unchanged.
function shuffle(items) {
    const shuffledItems = [...items];

    for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffledItems[index], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[index]];
    }

    return shuffledItems;
}

// Choose five unique artworks and avoid repeating the same set after refresh.
const previousSelection = sessionStorage.getItem(previousSelectionKey);
const shuffledCollection = shuffle(artworkCollection);
const selectedArtworks = shuffledCollection.slice(0, 5);
const selectionKey = selectedArtworks.map((artwork) => artwork.title).sort().join("|");

if (selectionKey === previousSelection) {
    selectedArtworks[0] = shuffledCollection[5];
}

sessionStorage.setItem(
    previousSelectionKey,
    selectedArtworks.map((artwork) => artwork.title).sort().join("|")
);

// Create the five frame buttons in a random order.
const artworks = selectedArtworks.map((artwork) => {
    const button = document.createElement("button");
    button.className = "artwork";
    button.type = "button";
    button.dataset.title = artwork.title;
    button.dataset.artist = artwork.artist;
    button.dataset.year = artwork.year;
    button.dataset.description = artwork.description;
    button.setAttribute("aria-label", artwork.label);

    const image = document.createElement("img");
    image.className = "art-image";
    image.src = artwork.image;
    image.alt = artwork.alt;
    button.append(image);
    return button;
});

artworksContainer.append(...shuffle(artworks));

let selectedArtwork = null;
let hoveredArtwork = null;

// Fill the center message with the hovered artwork's information.
function showArtworkInformation(artwork) {
    if (selectedArtwork) {
        return;
    }

    hoveredArtwork = artwork;
    artTitle.textContent = artwork.dataset.title;
    artArtist.textContent = artwork.dataset.artist;
    artYear.textContent = artwork.dataset.year;
    artCaption.textContent = `"${artwork.dataset.description}"`;
    artwork.classList.add("is-faded");
    galleryMessage.classList.add("is-visible");
}

// Hide hover information after the pointer leaves the artwork.
function hideArtworkInformation(artwork) {
    if (hoveredArtwork !== artwork || selectedArtwork) {
        return;
    }

    hoveredArtwork = null;
    artwork.classList.remove("is-faded");
    galleryMessage.classList.remove("is-visible");
}

// Show the pinned warning and fade the artwork that was clicked.
function displayArtworkWarning(artwork) {
    if (selectedArtwork === artwork) {
        resetGallery();
        return;
    }

    if (selectedArtwork) {
        selectedArtwork.classList.remove("is-faded");
    }

    selectedArtwork = artwork;
    artworks.forEach((item) => item.classList.toggle("is-faded", item === artwork));
    artTitle.textContent = "Please Don’t Touch The Artwork";
    artArtist.textContent = "";
    artYear.textContent = "";
    artCaption.textContent = "";
    galleryMessage.classList.add("is-visible");
}

// Restore all artwork and clear the center message.
function resetGallery() {
    selectedArtwork = null;
    hoveredArtwork = null;
    artworks.forEach((artwork) => artwork.classList.remove("is-faded"));
    galleryMessage.classList.remove("is-visible");
}

artworks.forEach((artwork) => {
    artwork.addEventListener("mouseenter", () => showArtworkInformation(artwork));
    artwork.addEventListener("mouseleave", () => hideArtworkInformation(artwork));
    artwork.addEventListener("focus", () => showArtworkInformation(artwork));
    artwork.addEventListener("blur", () => hideArtworkInformation(artwork));
    artwork.addEventListener("click", () => displayArtworkWarning(artwork));
});

// Clicking anywhere except an artwork dismisses a pinned warning.
document.addEventListener("click", (event) => {
    if (!event.target.closest(".artwork")) {
        resetGallery();
    }
});