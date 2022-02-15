const movieList = document.querySelector('.movie-list');
const movieDetail = document.querySelector('.movie-detail');
const movieDetailWrapper = document.querySelector('.movie-detail-wrapper');
const closeBtn = document.querySelector('.close-btn');

const init = function () {
  let moviesBucket = [];

  closeBtn.addEventListener('click', () =>
    movieDetail.classList.remove('show')
  );

  const loadImage = function (imageEl, imageSrc) {
    return new Promise((resolve, reject) => {
      imageEl.src = imageSrc;

      imageEl.addEventListener('load', () => resolve(imageEl));
      imageEl.addEventListener('error', () =>
        reject(new Error('Unable to Load Image'))
      );
    });
  };

  const lazyImgObserverHandler = function () {
    const lazyClassName = 'lazy-load';
    const lazyImgElem = document.querySelector(`.${lazyClassName}`);

    const handleLazyImg = async function (entries) {
      const [entry] = entries;
      if (!entry.isIntersecting) return;

      const elem = entry.target;

      try {
        await loadImage(elem, elem.dataset.src);
      } catch (err) {
        elem.setAttribute('alt', 'Unable to Load Mohit Kumar Photo');
      } finally {
        elem.classList.remove(lazyClassName);
      }

      lazyImgObserver.unobserve(elem);
    };

    const lazyImgOption = {
      root: null,
      threshold: 0.1,
    };

    const lazyImgObserver = new IntersectionObserver(
      handleLazyImg,
      lazyImgOption
    );
    lazyImgObserver.observe(lazyImgElem);
  };

  const formatDateStr = function (dateStr) {
    if (!dateStr) return '-/-/-';
    const [y, m, d] = dateStr.split('-');
    return `${d}-${m}-${y}`;
  };

  const buildMovieCard = function (movie) {
    return `
      <div class="card" data-id="${movie.id}">
        <div class="card-body">
          <div class="card-img">
            <img
              src="${movie.image.medium}"
            />
          </div>
          <div class="card-text">
            <h4 class="movie-title">${movie.name}</h4>
            <span
              ><strong>${
                movie.rating.average || 0
              }</strong> <span class="star">&starf;</span></span
            >
          </div>
        </div>
      </div>
    `;
  };

  const buildGenreTag = function (genre) {
    return `<div class="tag">${genre}</div>`;
  };

  const buildMovieDetailSection = function (movie) {
    return `
    <div class="left">
      <div class="movie-img">
        <img src="${
          movie.image.medium
        }" class="lazy-load movie-lazy-img" data-src="${movie.image.original}"/>
      </div>
    </div>
    <div class="right">
      <h1 class="movie-name">${movie.name}</h1>
      <div class="data">
        <div class="keyval">
          <span class="key">Premiered</span>
          <span class="val">${formatDateStr(movie.premiered)}</span>
        </div>

        <div class="keyval">
          <span class="key">Country</span>
          <span class="val">${movie.network.country.name}</span>
        </div>

        <div class="keyval">
          <span class="key">Rating</span>
          <span class="val">${movie.rating.average || 0} &starf;</span>
        </div>
      </div>

      <div class="data">
        <div class="keyval">
          <span class="key">Type</span>
          <span class="val">${movie.type || 'Unknown'}</span>
        </div>

        <div class="keyval">
          <span class="key">Language</span>
          <span class="val">${movie.language || 'Unknown'}</span>
        </div>
      </div>

      <div class="genres">
        ${
          movie.genres.length
            ? movie.genres.map(genre => buildGenreTag(genre)).join('')
            : ''
        }
      </div>

      <div class="summary">
        ${movie.summary}
      </div>
    </div>
    `;
  };

  const handleMovieClick = function (e) {
    const movieCard = e.target.closest('.card');

    if (!movieCard) return;

    const movieId = +movieCard.dataset.id;

    const foundMovie = moviesBucket.find(movie => movie.id === movieId);

    const markup = buildMovieDetailSection(foundMovie);
    movieDetailWrapper.innerHTML = '';
    movieDetailWrapper.insertAdjacentHTML('afterbegin', markup);

    movieDetail.classList.add('show');
    lazyImgObserverHandler();
  };

  const addHandlerToMovieList = function () {
    movieList.addEventListener('click', handleMovieClick);
  };

  const loadMoviesToLocalBucket = function (movies) {
    return new Promise(resolve => {
      moviesBucket = [...movies];
      resolve('Load succesfully');
    });
  };

  const addMoviesToUi = async function (movies) {
    const markup = `
      ${movies.map(movie => buildMovieCard(movie)).join('')}
    `;

    movieList.insertAdjacentHTML('afterbegin', markup);

    await loadMoviesToLocalBucket(movies);
    addHandlerToMovieList();
  };

  const loadMoviesFromJson = async function () {
    try {
      const res = await fetch('data/tv-show.json');
      const data = await res.json();

      addMoviesToUi(data);
    } catch (err) {
      console.error('something went wrong');
    }
  };

  loadMoviesFromJson();
};

window.addEventListener('load', init());
