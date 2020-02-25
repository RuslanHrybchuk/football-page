let useLocalStorage = true;
let useMongoDB = false;
let addedFeadback = document.getElementById('feadback-admin');
let db;
let storageFeadack = [];

const isOnline = () => window.navigator.onLine;

class SubmitUserForm {
  constructor(id, firstName, lastName, email, feadback) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.feadback = feadback;
  }
}

const newsSubmit = e => {
  e.preventDefault();

  let id = Date.now();
  let firstName = document.getElementById('first-name').value;
  let lastName = document.getElementById('last-name').value;
  let email = document.getElementById('email').value;
  let feadback = document.getElementById('text-area').value;

  const userDataInput = new SubmitUserForm(
    id,
    firstName,
    lastName,
    email,
    feadback
  );

  if (useLocalStorage) {
    if (isOnline()) {
      let li = document.createElement('li');
      li.innerHTML += `${userDataInput.firstName} ${userDataInput.lastName}
                        ${userDataInput.email} ${userDataInput.text}`;
      addedFeadback.appendChild(li);
    } else {
      storageFeadack.push(userDataInput);
      localStorage.setItem('feadback', JSON.stringify(storageFeadack));
    }
  } else if (useMongoDB) {
    postDataUser(firstName, lastName, email, feadback);
  } else {
    if (!isOnline()) {
      let listDB = document.createElement('li');
      listDB.innerHTML += `${id} ${firstName} ${lastName} ${email} ${feadback}`;
      addedFeadback.appendChild(listDB);
    } else {
      postTofeadbackDB(id, firstName, lastName, email, feadback);
    }
  }

  document.querySelector('form').reset();
};

const postDataUser = (firstName, lastName, email, feadback) => {
  let userData = {
    'first-name': firstName,
    'last-name': lastName,
    email: email,
    feadback: feadback
  };
  fetch('http://localhost:3000/feadback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
};

const getDataUser = () => {
  fetch('http://localhost:3000/feadback')
    .then(res => {
      return res.json();
    })
    .then(data => {
      data.map(el => {
        let listFromMongoDb = document.createElement('li');
        listFromMongoDb.innerHTML += `${el['first-name']} ${el['last-name']} ${el.email} ${el.feadback}`;
        addedFeadback.appendChild(listFromMongoDb);
      });
    });
};

document
  .querySelector('.form-group-admin-btn')
  .addEventListener('click', newsSubmit);

const handleConnectionChange = event => {
  if (event.type == 'offline') {
    alert('You lost connection.');
  }

  if (event.type == 'online') {
    alert('You are now back online.');
  }
};

window.addEventListener('online', handleConnectionChange);
window.addEventListener('offline', handleConnectionChange);

let openRequest = indexedDB.open('feadbackDataBase');

openRequest.onupgradeneeded = function() {
  db = openRequest.result;
  db.createObjectStore('feadbackDB', { keyPath: 'id' });
};
openRequest.onerror = function() {
  console.error('Error, fix the bugs!!');
};

openRequest.onsuccess = function() {
  db = openRequest.result;
};

function postTofeadbackDB(id, firstName, lastName, email, feadback) {
  let transaction = db.transaction('feadbackDB', 'readwrite');
  let feadbackPost = transaction.objectStore('feadbackDB');

  let objectDB = {
    id: `${id}`,
    'first-name': `${firstName}`,
    'last-name': `${lastName}`,
    email: `${email}`,
    feadback: `${feadback}`
  };
  feadbackPost.add(objectDB);
}

function getFromfeadbackDB() {
  let transaction = db.transaction('feadbackDB', 'readwrite');
  let feadbackPost = transaction.objectStore('feadbackDB');

  let request = feadbackPost.openCursor();
  request.onsuccess = function() {
    let cursor = request.result;
    if (cursor) {
      let listPostedDB = document.createElement('li');
      listPostedDB.innerHTML += `First Name:${cursor.value['first-name']};
      Last Name:${cursor.value['last-name']};
      email:${cursor.value.email};
      news:${cursor.value.feadback}`;
      cursor.continue();
      addedFeadback.appendChild(listPostedDB);
      feadback.clear();
    }
  };
}

if (isOnline()) {
  if (useLocalStorage) {
    saved = JSON.parse(localStorage.getItem('feadback'));
    if (saved) {
      saved.map(el => {
        let listFromLocalStorage = document.createElement('li');
        listFromLocalStorage.innerHTML += `${el.firstName} ${el.lastName} ${el.email} ${el.feadback}`;
        addedFeadback.appendChild(listFromLocalStorage);
      });
      localStorage.clear();
    }
  } else if (useMongoDB) {
    getDataUser();
  } else {
    // getFromfeadbackDB();
  }
}
