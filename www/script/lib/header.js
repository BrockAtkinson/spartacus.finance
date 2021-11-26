let header = document.querySelector('.header');
let button = header.querySelector('.header-hamburger');

button.addEventListener('click', function() {
  header.classList.toggle('header--mobile-menu');
});
