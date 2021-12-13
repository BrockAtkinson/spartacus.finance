let header = document.querySelector('.header');
let button = header.querySelector('.header-hamburger');

function lsget(key) {
  return window.localStorage.getItem(key);
}

function init() {
  button.addEventListener('click', function() {
    header.classList.toggle('header--mobile-menu');
  });

  let isDarkMode = lsget('darkMode') === 'true';
  // console.log('is dark mode:', isDarkMode);
}

document.addEventListener('DOMContentLoaded', init);
