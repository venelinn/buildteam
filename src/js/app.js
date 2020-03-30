import usersDB from "../data/users.json";
const imagesLoaded = require('imagesloaded');
const form = document.getElementById('usersForm');
const body = document.querySelector('body')
const btnSubmit = document.getElementById("btnUserUrl");
const result = document.getElementById("selectedUsersUrl");
const btnCopy = document.getElementById('jsCopy');


// Preload images
const preloadImages = () => {
  return new Promise((resolve, reject) => {
      imagesLoaded(document.querySelectorAll('.jsImage'), resolve);
  });
};

Promise.all([preloadImages()]).then(() => {
  document.body.classList.remove('loading');
  init();
});


// Close modal
document.getElementById('jsTeamClose').addEventListener('click', () => {
  body.classList.remove('build__team');
});

// Copy button
btnCopy.addEventListener('click', copyText);


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
  }


  if (isReadonly) {
    btnSubmit.style.display = "none";
  } else {
    btnSubmit.addEventListener("click", userUrlBthHandler);
  }

  document.getElementById("usersList").innerHTML = getUserList(
    users,
    isReadonly
  );
}


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

function getUserList(users, isReadOnly) {
  const allUsers = users.map(user => getUser(user, isReadOnly));
  return allUsers.join("");
}

function getUser(user, isReadOnly) {
  return `
      <div class="user">
        <input type="checkbox" id="${user.id}" value="${user.id}" ${isReadOnly ? "hidden" : ''} >
				<div class="user__info">
					<label for="${user.id}">
						<div class="user__image" >
							<img src="${user.image}" alt="${user.name}" class="jsImage" />
							<div class="user__desc" >
								<span class="user__desc__text">${user.desc}</span>
							</div>
							<span class="checkbox"></span>
						</div>
						<div class="user__data">
							<h2 class="user__name">${user.name}</h2>
							<p>${user.role}</p>
						</div>
					</label>
				</div>
      </div>`;
}


function copyText() {
  var copyText = result;
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  btnCopy.classList.add('btn--copied');
  btnCopy.innerHTML = 'Copied'
  //console.log("Copied the text: " + copyText.value);
}

