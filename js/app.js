import { API_KEY } from "../CONFIG.js";
import { genre } from "../genre.js";

genre: genre;

API_KEY: API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + "/search/movie?" + API_KEY;

const main = document.querySelector("main");
const form = document.querySelector("form");
const search = document.querySelector(".search");
const tagEl = document.querySelector("#tag");
const home = document.querySelector('.home');
// const lable = document.querySelector('.lable');
// Pagination -------------------------------------
const prev = document.getElementById("previous");
const current = document.getElementById("current");
const next = document.getElementById("next");

// Pagination -------------------------------
var prevPage = 1;
var currentPage = 2;
var nextPage = 3;
var lastUrl = "";
var totalPage = 100;

var selectedGenre = [];

setGenre();
function setGenre() {
  tagEl.innerHTML = "";
  genre.forEach((genres) => {
    const tags = document.createElement("div");
    tags.classList.add("tag");
    tags.id = genres.id;
    tags.innerText = genres.name;
    tags.addEventListener("click", () => {
      if (selectedGenre.length === 0) {
        selectedGenre.push(genres.id);
      } else {
        if (selectedGenre.includes(genres.id)) {
          selectedGenre.forEach((id, idx) => {
            if (id == genres.id) {
              selectedGenre.splice(idx, 1);
            }
          });
        } else {
          selectedGenre.push(genres.id);
        }
      }
      getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(",")));

      highlightSelection();
    });
    tagEl.append(tags);
  });
}

function highlightSelection() {
  const allTag = document.querySelectorAll(".tag");
  allTag.forEach((tag) => {
    tag.classList.remove("highlight");
  });
  clearBtn();
  if (selectedGenre.length !== 0) {
    selectedGenre.forEach((id) => {
      const highlightedTag = document.getElementById(id);
      highlightedTag.classList.add("highlight");
    });
  }
}

function clearBtn() {
  let clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.classList.add("highlight");
  } else {
    let clear = document.createElement("div");
    clear.classList.add("tag", "highlight");
    clear.id = "clear";
    clear.innerText = "Clear X";
    clear.addEventListener("click", () => {
      selectedGenre = [];
      setGenre();
      getMovies(API_URL);
    });
    tagEl.append(clear);
  }
}

getMovies(API_URL);
function getMovies(url) {
  lastUrl = url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.results.length !== 0) {
        showMovie(data.results);
        currentPage = data.page;
        prevPage = currentPage - 1;
        nextPage = currentPage + 1;
        totalPage = data.total_pages;

        current.innerText = currentPage;

        if(currentPage <= 1){
          prev.classList.add('disabled');
          next.classList.remove('disabled');
        } else if(currentPage >= totalPage){
          prev.classList.remove('disabled');
          next.classList.add('disabled');
        } else{
          prev.classList.remove('disabled');
          next.classList.remove('disabled');
        }

        tagEl.scrollIntoView({behavior : 'smooth'});

      } else {
        main.innerHTML = `<h1 class="no_results">No Results Found</h1>`;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function showMovie(data) {
  main.innerHTML = "";

  data.forEach((movie) => {
    const { title, overview, vote_average, poster_path } = movie;
    const movieE = document.createElement("div");
    movieE.classList.add("movie");
    movieE.innerHTML = `
    <img src="${
      poster_path
        ? IMG_URL + poster_path
        : "https://via.placeholder.com/1080x1580"
    }"
        alt="${title}">

    <div class="movie_info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}">${vote_average}</span>
    </div>

    <div class="plot">
        <h3 class="overview">Overview</h3>
        ${overview}
    </div>
        `;

    main.appendChild(movieE);
  });
}

function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;
  selectedGenre = [];
  setGenre();
  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm);
  } else {
    getMovies(API_URL);
  }
});

// Pageination
prev.addEventListener('click', () => {
  if(prevPage > 0){
    pageCall(prevPage);
  }
})

next.addEventListener('click', () => {
  if(nextPage <= totalPage){
    pageCall(nextPage);
  }
})

function pageCall(page) {
  let urlSplit = lastUrl.split('?');
  let queryParam = urlSplit[1].split('&');
  let key = queryParam[queryParam.length - 1].split('=');
  if(key[0] != 'page'){
    let url = lastUrl + '&page='+ page
    getMovies(url);
  } else{
    key[1] = page.toString();
    let a = key.join('=');
    queryParam[queryParam.length - 1] = a;
    let b = queryParam.join('&');
    let url = urlSplit[0] + '?' + b
    getMovies(url);
  }
}

home.addEventListener('click', () => {
  getMovies(API_URL);
})

