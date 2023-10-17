import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

axios.defaults.baseURL = 'https://pixabay.com/api/';

function fetchImages(searchQuery, page) {
  axios
    .get(
      `?key=40081345-2806d7337f047551466163511&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    )
    .then(handleImagesResponse)
    .catch(handleError);
}

const lightbox = new SimpleLightbox('.gallery a');
const loadMoreButton = document.querySelector('.load-more');

function handleImagesResponse(response) {
  const images = response.data.hits;
  if (images.length === 0) {
    showNoResultsMessage();
  } else {
    displayImages(images);
    showTotalHitsMessage(response.data.totalHits);

    lightbox.refresh();

    if (images.length < 40) {
      loadMoreButton.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  }
}

function showTotalHitsMessage(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

  loadMoreButton.style.display = 'block';
}

function handleError(error) {
  console.error('Error:', error);
}

function displayImages(images) {
  images.forEach(displayImage);
}

function displayImage(image) {
  const card = document.createElement('div');
  card.className = 'photo-card';
  card.innerHTML = `
    <a href="${image.largeImageURL}" data-lightbox="image">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    </a>
    <div class "info">
      <p class="info-item"><b>Likes:</b> ${image.likes}</p>
      <p class="info-item"><b>Views:</b> ${image.views}</p>
      <p class="info-item"><b>Comments:</b> ${image.comments}</p>
      <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
    </div>
  `;
  gallery.appendChild(card);
}

function showNoResultsMessage() {
  loadMoreButton.style.display = 'none';
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
let page = 1;

searchForm.addEventListener('submit', handleSubmitForm);
loadMoreButton.addEventListener('click', handleLoadMore);

function handleSubmitForm(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  const searchQuery = searchForm.querySelector(
    'input[name="searchQuery"]'
  ).value;
  fetchImages(searchQuery, page);
}

function handleLoadMore() {
  page += 1;
  const searchQuery = searchForm.querySelector(
    'input[name="searchQuery"]'
  ).value;
  fetchImages(searchQuery, page);
}
