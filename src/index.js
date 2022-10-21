import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './refs';
import { createMarkup } from './createMarkup';
import { pixabayAPI } from './pixabayAPI';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabay = new pixabayAPI();
const lightbox = new SimpleLightbox('.gallery a');

async function handleSubmit(event) {
  event.preventDefault();
  const {
    elements: { searchQuery },
  } = event.currentTarget;
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    Notify.failure('Please enter the search query!');
    return;
  }
  pixabay.searchQuery = query;
  clearPage();

  try {
    const searchData = await pixabay.searchImages();
    const { hits, totalHits } = searchData;
    if (hits.length === 0) {
      Notify.info('No images found :(');
      return;
    }
    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    pixabay.calculateTotalPages(totalHits);
    Notify.success(`Hooray! We found ${totalHits} images.`);
    if (pixabay.isShownLoadMore) {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
    lightbox.refresh();
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!');
    clearPage();
  }
}

async function onLoadMore() {
  try {
    pixabay.incrementPage();
    const { hits } = await pixabay.searchImages();
    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    if (!pixabay.isShownLoadMore) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!');
    clearPage();
  }
}

refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function clearPage() {
  pixabay.resetPage();
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}
