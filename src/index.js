import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './refs';
import { createMarkup } from './createMarkup';
import { pixabayAPI } from './pixabayAPI';

// 30733025-62942a0e02283ae2db659ca4c

const pixabay = new pixabayAPI();

const handleSubmit = event => {
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
  pixabay.resetPage();
  refs.gallery.innerHTML = '';
  pixabay.searchImages().then(({ hits, totalHits }) => {
    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    pixabay.calculateTotalPages(totalHits);
    if (pixabay.isShownLoadMore) {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
  });
};
const onLoadMore = () => {
  pixabay.incrementPage();
  if (pixabay.isShownLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
  }
  pixabay.searchImages().then(({ hits }) => {
    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
  });
};

refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

// const DEBOUNCE_DELAY = 300;
// const debounce = require('lodash.debounce');

// refs.input.addEventListener('input', debounce(onFormInput, DEBOUNCE_DELAY));

// function onFormInput(event) {
//   const country = event.target.value.trim().toLowerCase();
//   if (!country) {
//     refs.countryList.innerHTML = '';
//     refs.countryWrapper.innerHTML = '';
//     return;
//   }
//   fetchCountries(country)
//     .then(data => {
//       if (data.length === 1) {
//         const markupOne = createMarkupOne(data);
//         refs.countryWrapper.innerHTML = markupOne;
//         refs.countryList.innerHTML = '';
//       } else if (data.length >= 2 && data.length <= 10) {
//         const markupList = data.map(createMarkupList).join('');
//         refs.countryList.innerHTML = markupList;
//         refs.countryWrapper.innerHTML = '';
//       } else {
//         Notify.info(
//           'Too many matches found. Please enter a more specific name.'
//         );
//       }
//     })
//     .catch(error => {
//       Notify.failure('Oops, there is no country with that name');
//     });
// }
