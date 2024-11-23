const modal = document.getElementById('modal');
const closeModalIcon = document.querySelector('.close-modal');

closeModalIcon.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
})