const formElement = document.querySelector('form');
const inputElement = document.getElementById('default-search');
const searchResults = document.querySelector('.search-results');
const showMore = document.getElementById('show-more-button');

let page = 1;

formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  page = 1;
  searchImages();
});

showMore.addEventListener('click', () => {
  searchImages();
});

async function searchImages() {
  const query = inputElement.value;
  const url = `/api/search?query=${query}&page=${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (page === 1) {
      searchResults.innerHTML = '';
    }

    data.results.forEach((result) => {
      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add('search-result');

      const image = document.createElement('img');
      image.src = result.urls.small;
      image.alt = result.alt_description;

      const imageLink = document.createElement('a');
      imageLink.href = result.links.html;
      imageLink.target = '_blank';
      imageLink.textContent = result.alt_description;

      imageLink.style.fontSize = '18px';
      

      imageWrapper.appendChild(image);
      imageWrapper.appendChild(imageLink);
      searchResults.appendChild(imageWrapper);
    });

    page += 1;
    showMore.style.display = 'block';
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
  }
}
