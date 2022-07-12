const appendGreeting = (xhr, event) => {
  xhr.open('POST', '/login');
  const html = document.querySelector('html')
  xhr.onload = () => { html.innerHTML = xhr.responseText };
  const form = document.querySelector('form')
  const formData = new FormData(form);
  xhr.send(new URLSearchParams(formData).toString());
};

const main = () => {
  const xhr = new XMLHttpRequest();
  const button = document.getElementById('login');
  button.addEventListener('click', (event) => {
    event.preventDefault();
    appendGreeting(xhr, event)
  });
};

window.onload = main;
