let header = document.querySelector('.header');
let button = header.querySelector('.header-hamburger');

button.addEventListener('click', function() {
  console.log('hamburger click', this);
  this.classList.toggle('header-hamburger--open');
});
