const login = (xhr, event) => {
  xhr.open('POST', '/signup');
  xhr.onload = () => {
    if (xhr.status === 409) {
      const message = document.querySelector('#message')
      message.innerText = 'username is not available';
      return;
    }
    if (xhr.status === 200) {
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000)
      const message = document.querySelector('#message')
      message.innerText = 'created account successfully';
    }
  };
  const form = document.querySelector('form')
  const formData = new FormData(form);
  xhr.send(new URLSearchParams(formData).toString());
};

const main = () => {
  const xhr = new XMLHttpRequest();
  const button = document.querySelector('#signup');
  button.addEventListener('click', (event) => {
    login(xhr, event)
  });
};

window.onload = main;
