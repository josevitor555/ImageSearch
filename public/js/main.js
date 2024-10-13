const formElement = document.querySelector('form');
const inputElement = document.getElementById('default-search');
const searchResults = document.querySelector('.search-results');
const showMoreButton = document.getElementById('show-more-button');

let page = 1;
let isSearching = false;

formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  page = 1;
  isSearching = true;
  searchImages();
});

showMoreButton.addEventListener('click', () => {
  if (isSearching) {
    searchImages();
  } else {
    fetchRandomImages();
  }
});

async function searchImages() {
  const inputData = inputElement.value;
  const url = `/api/search?query=${inputData}&page=${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (page === 1) {
      searchResults.innerHTML = '';
      showMoreButton.style.display = 'none';
    }

    if (data.results.length === 0) {
      const noResultsMessage = document.createElement('p');
      noResultsMessage.textContent = `Nenhuma imagem encontrada para '${inputData}'`;
      noResultsMessage.classList.add('no-results-message');
      searchResults.appendChild(noResultsMessage);
      return;
    }

    data.results.forEach(createImageElement);
    page += 1;
    showMoreButton.style.display = 'block';
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
  }
}

async function fetchRandomImages() {
  try {
    const response = await fetch('/api/random-images');

    if (!response.ok) {
      throw new Error('Erro ao buscar as imagens aleatórias');
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Resposta não é JSON');
    }

    const data = await response.json();
    data.forEach((result) => {
      const resultHTML = `
        <div class="search-result animate__animated animate__fadeIn">
          <div class="perfil-user flex items-center mb-4">
            <img src="${result.user.profile_image.large}" alt="${result.user.name}" />
            <div>
              <h6 class="text-slate-800 font-semibold">
                <a href="${result.user.links.html}" target="_blank">${result.user.name}</a>
              </h6>
              <p class="bio-user text-slate-600 text-2xl">
                ${result.user.bio || 'Fotógrafo'}
              </p>
            </div>
          </div>
          <img src="${result.urls.small}" alt="${result.alt_description || 'Image Not Found'}">
          <a href="${result.links.html}" target="_blank" class="block mt-2">
            ${result.alt_description || 'No description available'}
          </a>
          <div class="download-image mt-2">
            <a href="${result.urls.full}" class="download-img" download="image.jpg">
              <i class="text-white fa-solid fa-share-from-square"></i>
            </a>
          </div>
        </div>
      `;
      searchResults.innerHTML += resultHTML;
    });
  } catch (error) {
    console.error('Erro ao buscar as imagens:', error);
  }
}

function createImageElement(result) {
  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('search-result');

  const image = document.createElement('img');
  image.src = result.urls.small;
  image.alt = result.alt_description || 'Image Not Found';

  const imageLink = document.createElement('a');
  imageLink.href = result.links.html;
  imageLink.target = '_blank';
  imageLink.textContent = result.alt_description || 'No description available';

  const downloadIcon = document.createElement('a');
  downloadIcon.href = result.urls.full;
  downloadIcon.classList.add('download-img');
  downloadIcon.download = 'image.jpg';
  downloadIcon.innerHTML = '<i class="fa-solid fa-share-from-square"></i>';
  downloadIcon.target = '_blank';

  imageWrapper.appendChild(image);
  imageWrapper.appendChild(imageLink);
  imageWrapper.appendChild(downloadIcon);
  searchResults.appendChild(imageWrapper);
}

window.addEventListener('DOMContentLoaded', fetchRandomImages);
