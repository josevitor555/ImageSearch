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
  const inputData = inputElement.value;
  const url = `/api/search?query=${inputData}&page=${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const results = data.results;

    if (page === 1) {
      searchResults.innerHTML = '';
      showMore.style.display = 'none';
    }

    if (results.length === 0) {
      const noResultsMessage = document.createElement('p');
      noResultsMessage.textContent = `Nenhuma imagem encontrada para '${inputData}'`;
      noResultsMessage.classList.add('no-results-message')
      searchResults.appendChild(noResultsMessage);
      return;
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

      const downloadIcon = document.createElement('a');
      downloadIcon.href = result.urls.full;
      downloadIcon.classList.add('download-img');
      // downloadIcon.innerHTML = `<i class='bx bx-vertical-bottom'></i>`;
      downloadIcon.textContent = 'High Quality';
      downloadIcon.setAttribute('download', 'image.jpg');
      downloadIcon.target = '_blank';

      imageWrapper.appendChild(image);
      imageWrapper.appendChild(imageLink);
      imageWrapper.appendChild(downloadIcon);
      searchResults.appendChild(imageWrapper);
    });

    page += 1;
    if (page > 1) {
      showMore.style.display = 'block';
    }
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
  }
}
