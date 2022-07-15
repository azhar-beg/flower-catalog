const createElement = (tag, content, cls) => {
  const ele = document.createElement(tag);
  ele.className = cls;
  ele.innerText = content;
  return ele;
};

const createComment = ({ date, name, comment, id }) => {
  const div = document.createElement('div');
  div.className = 'comment';
  div.id = id;
  const dateEle = createElement('div', date, 'date');
  const nameEle = createElement('div', name, 'name');
  const messageEle = createElement('div', comment, 'message');
  div.append(dateEle, nameEle, messageEle);
  return div;
}

const getComments = (xhr) => {
  const lastComment = document.querySelector('#comments :nth-child(1)')
  const id = lastComment ? +lastComment.id : 0;
  const comments = JSON.parse(xhr.responseText);
  return comments.filter(comment => comment.id > id);
};

const generateHtml = (comments) => {
  const commentHtml = comments.map(createComment);
  const element = document.querySelector('#comments')
  element.prepend(...commentHtml);
};

const displayComment = () => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/api');
  xhr.onload = () => {
    if (xhr.status === 200) {
      generateHtml(getComments(xhr));
    }
  }
  xhr.send();
};

const postComment = xhr => {
  if (xhr.status === 200) {
    displayComment()
  }
};

const addComments = (event) => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/guest-book');
  xhr.onload = () => {
    postComment(xhr)
  };

  const form = document.querySelector('form')
  const formData = new FormData(form);
  form.reset();
  xhr.send(new URLSearchParams(formData));
};

const main = () => {
  const button = document.querySelector('#submit');
  button.addEventListener('click', (event) => {
    addComments(event);
  });
  setInterval(displayComment, 200);
};

window.onload = main;
