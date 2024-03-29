const endPoint = 'https://api.lyrics.ovh/';

const searchForm = $('#search-form');
const searchButton = $('#search-button');
const searchInput = $('#search-input');

function setData(data) {
    $.each(data, function (index, entry) {
        const artistName = entry.artist.name;
        const title = entry.title;

        showResultsList({ artistName, title, index });
    });
}

function showError() {
    showLyricsError();
    scrollToLyricsResult();
}

function getLyrics(e) {
    const artist = e.target.dataset.artist;
    const title = e.target.dataset.title;

    const url = `${endPoint}v1/${artist}/${title}`;

    showLyricsLoader();

    $.ajax({
        url: url,
        success: function (response) {
            if (response.lyrics === '') {
                showError();
                return;
            }
            showLyricsResult(artist, title, response.lyrics);
            scrollToLyricsResult();
        },
        error: function () {
            showError();
        },
    });
}

function searchQuery() {
    const query = searchInput.val();
    if (isInputEmpty(query)) return;

    const url = `${endPoint}/suggest/${query}`;

    cleanupExistingResults();
    showResultsContainer();
    showSearchLoader();

    $.ajax({
        url: url,
        success: function (response) {
            setData(response.data);
            scrollToSearchResults();
        },
        error: function () {
            showSearchError();
            scrollToSearchResults();
        },
    });
}

function registerSearchFormEvents() {
    searchForm.submit(function (e) {
        e.preventDefault();
        searchQuery();
    });

    searchButton.click(function () {
        searchQuery();
    });
}

registerSearchFormEvents();
