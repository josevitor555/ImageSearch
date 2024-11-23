const formElement = document.querySelector('form');
const inputElement = document.getElementById('default-search');
const searchResults = document.querySelector('.search-results');
const showMoreButton = document.getElementById('show-more-button');

let page = 1;
let isSearching = false;

formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  const inputData = inputElement.value.trim();
  
  if (inputData.startsWith('@')) {
    const username = inputData.slice(1);
    fetchUserData(username);
    showMoreButton.style.display = 'none'; // Oculta o botão "Show More"
  } else {
    page = 1;
    isSearching = true;
    searchImages();
    showMoreButton.style.display = 'block'; // Mostra o botão "Show More" para imagens
  }
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

    data.results.forEach((result) => {
      const resultHTML = `
      <div class="search-result animate__animated animate__fadeIn">
          <div class="perfil-user flex items-center mb-4">
            <img src="${result.user.profile_image.large}" alt="${result.user.name}" class="rounded-full w-12 h-12 object-cover" />
            <div>
              <h6 class="text-slate-800 font-semibold">
                <a href="${result.user.links.html}" target="_blank">${result.user.name}</a>
              </h6>
              <p class="bio-user text-gray-800 text-2xl">
                ${result.user.bio || 'Fotógrafo'}
              </p>
            </div>
          </div>
          <img src="${result.urls.small}" alt="${result.alt_description || 'Image Not Found'}" class="w-full h-64 object-cover">
          <a href="${result.links.html}" target="_blank" class="block mt-2">
            ${result.alt_description || 'No description available'}
          </a>
        </div>
      `;
      searchResults.innerHTML += resultHTML;
    });
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
              <p class="bio-user text-gray-800 text-2xl">
                ${result.user.bio || 'Fotógrafo'}
              </p>
            </div>
          </div>
          <img src="${result.urls.small}" alt="${result.alt_description || 'Image Not Found'}">
          <a href="${result.links.html}" target="_blank" class="block mt-2">
            ${result.alt_description || 'No description available'}
          </a>
        </div>
      `;
      searchResults.innerHTML += resultHTML;
    });
  } catch (error) {
    console.error('Erro ao buscar as imagens:', error);
  }
}

window.addEventListener('DOMContentLoaded', fetchRandomImages);

formElement.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = inputElement.value;
  await fetchUserData(username);
});

async function fetchUserData(username) {
  try {
    const response = await fetch(`/api/user/${username}`);
    const data = await response.json();

    // Exibir informações do usuário e fotos
    displayUserData(data.user, data.photos);
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
  }
}

function displayUserData(user) {
  const userHTML = `
    <div class="p-5 border rounded text-center text-gray-500 max-w-sm">
      <img src="${user.profile_image.large}" alt="${user.name}" class="w-32 h-32 rounded-full mx-auto">
      <div class="text-2xl mt-5">
        <a href="${user.profile_image.large}" class="font-medium leading-none text-gray-900 hover:text-indigo-600 transition duration-500 ease-in-out">
          ${user.name}
        </a>
        <p class="mt-2 text-1xl text-gray-800">
          ${user.bio || 'Sem bio disponível'}
        </p>
      </div>
      <div class="mt-4 flex justify-center space-x-4">
        ${user.social.instagram_username ? `
          <a href="https://instagram.com/${user.social.instagram_username}" target="_blank" class="text-3xl text-gray-800">
            <i class="fa-brands fa-square-instagram"></i>
          </a>` : ''}
        ${user.social.twitter_username ? `
          <a href="https://twitter.com/${user.social.twitter_username}" target="_blank" class="text-3xl text-gray-800">
            <i class="fa-brands fa-x-twitter"></i>
          </a>` : ''}
        ${user.social.portfolio_url ? `
          <a href="${user.social.portfolio_url}" target="_blank" class="text-3xl text-gray-800">
            <i class="fa-solid fa-briefcase"></i>
          </a>` : ''}
      </div>
    </div>
  `;

  searchResults.innerHTML = userHTML;
  showMoreButton.style.display = 'none';
}
