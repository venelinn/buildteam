import usersDB from "../data/users.json";
const imagesLoaded = require('imagesloaded');
const form = document.getElementById('usersForm');
const body = document.querySelector('body')
const btnSubmit = document.getElementById("btnUserUrl");
const result = document.getElementById("selectedUsersUrl");
const btnCopy = document.getElementById('jsCopy');
const noteForm = document.querySelector('.jsNoteForm')

 // Preload images
 const preloadImages = () => {
  return new Promise((resolve, reject) => {
    imagesLoaded(document.querySelectorAll('.jsImage'), resolve);
  });
};

// And then..
preloadImages().then(() => {
  setInterval(() => {
    document.body.classList.remove('loading');
  }, 1000);
  init()
});

// Close modal
document.getElementById('jsTeamClose').addEventListener('click', closeTeam);

// Copy button
btnCopy.addEventListener('click', copyText);

// Handle ESC key
document.onkeydown = function(evt) {
  evt = evt || window.event;
  if (evt.keyCode == 27 && body.classList.contains('build__team'))  {
    closeTeam();
  }
};

// Close overlay
function closeTeam() {
  body.classList.remove('build__team');
}

//  Enable disable button
form.addEventListener('click', () => {
  const allCheckboxes = form.querySelectorAll("input[type=checkbox]");
  const selectedCheckBoxes = [...allCheckboxes].filter(el => el.checked);
  let btnVisible =  selectedCheckBoxes.length > 0;
  btnVisible ?
    btnSubmit.removeAttribute('disabled') :
    btnSubmit.setAttribute('disabled', '')
});


function init() {
  let users = usersDB;
  const isReadonly = !!window.location.search;

  if (isReadonly) {
    btnSubmit.style.display = "none";
    document.getElementById("jsNoteTeam").value = window.location.href;
    let queryParam = window.location.search.replace("?team=", "");
    if (queryParam) {
			body.classList.add('with-team');
      const usersToDisplay = queryParam.split(",");
      if (usersToDisplay.length > 0) {
        users = usersDB.filter(user =>
          usersToDisplay.includes(user.id.toString())
          );
      }
    }
  } else {
    btnSubmit.addEventListener("click", userUrlBthHandler);
  }

  document.getElementById("usersList").innerHTML = getUserList(users, isReadonly);
}

// Building the team
function userUrlBthHandler() {
  const allCheckboxes = form.querySelectorAll("input[type=checkbox]");
  const selectedCheckBoxes = [...allCheckboxes].filter(el => el.checked);
  const selectedUserIds = selectedCheckBoxes.map(el => el.value);
  const selectedUserIdsCsv =
    selectedUserIds.length > 0 ? selectedUserIds.toString() : "";
  const url =
    selectedUserIdsCsv &&
    `${window.location.origin}${
      window.location.pathname
    }?team=${selectedUserIdsCsv}`;
  result.value = url;
	body.classList.add('build__team');
}

// Build users list
function getUserList(users, isReadOnly) {
  const allUsers = users.map(user => getUser(user, isReadOnly));
  return allUsers.join("");
}

// User list template
function getUser(user, isReadOnly) {
  return `
    <div class="user">
      <input type="checkbox" id="${user.id}" value="${user.id}" ${isReadOnly ? "hidden" : ''} >
      <div class="user__info">
        <label for="${user.id}">
          <div class="user__image" >
            <img src="${user.image}" alt="${user.name}" class="jsImage" />
            <div class="user__desc" >
              <div class="user__desc__text">
                <span class="user__desc__desc">${user.desc}</span>
                <span class="user__desc__phone"><strong>Phone:</strong> ${user.phone}</span>
                <span class="user__desc__email"><strong>E-mail:</strong> ${user.email}</span>
              </div>
            </div>
            <span class="checkbox"></span>
          </div>
          <div class="user__data">
            <h2 class="user__name">${user.name}</h2>
            <p>${user.role}</p>
          </div>
        </label>
      </div>
    </div>
  `;
}

// Copy text to clipboard
function copyText() {
  var copyText = result;
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  btnCopy.classList.add('btn--copied');
  btnCopy.innerHTML = 'Copied'
}

// Leave a note
const processForm = form => {
  const data = new FormData(form)
  data.append('form-name', 'noteform');
  console.log(data)
  fetch('/', {
    method: 'POST',
    body: data,
  })
  .then(() => {
    form.classList.add('sent');
    form.innerHTML = `<div class="msg msg--success">The note has been successfully sent!</div>`;
  })
  .catch(error => {
    form.innerHTML = `<div class="msg msg--error">Error: ${error}</div>`;
  })
}

if (noteForm) {
  noteForm.addEventListener('submit', e => {
    e.preventDefault();
    processForm(noteForm);
  })
}