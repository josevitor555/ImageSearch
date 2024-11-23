window.onload = function () {
  setTimeout(function () {
    document.getElementById('modal').style.display = 'flex';
  }, 3000);
};

document.querySelector('.close').addEventListener('click', function () {
  document.getElementById('modal').style.display = 'none';
});

document.querySelector('.btn-modal').addEventListener('click', function () {
  document.getElementById('modal').style.display = 'none';
});