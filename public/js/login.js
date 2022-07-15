const login = (xhr, event) => {
  xhr.open('POST', '/login');
  xhr.onload = () => {
    if (xhr.status === 401) {
      const message = document.querySelector('#message')
      message.innerText = 'invalid username or password';
      return;
    }
    if (xhr.status === 200) {
      window.location.href = '/guest-book';
    }
  };
  const form = document.querySelector('form')
  const formData = new FormData(form);
  xhr.send(new URLSearchParams(formData));
};

const main = () => {
  const xhr = new XMLHttpRequest();
  const button = document.querySelector('#login');
  button.addEventListener('click', (event) => {
    login(xhr, event)
  });
};

window.onload = main;
