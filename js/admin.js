const useLocalStorage = false;
const useMongoDB = false;
let addedFeadback = document.getElementById('feadback-admin');
let storageFeadack = [];
let db;

const isOnline = () => window.navigator.onLine;

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

class SubmitUserForm {
  constructor(id, firstName, lastName, email, feadback) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.feadback = feadback;
  }
}

if (isOnline()) {
  if (useLocalStorage) {
    saved = JSON.parse(localStorage.getItem('feadback'));
    if (saved) {
      saved.map(el => {
        let listFromLocalStorage = document.createElement('li');
        listFromLocalStorage.innerHTML += `${el.firstName} 
                                            ${el.lastName} 
                                            ${el.email} 
                                            ${el.feadback}`;
        addedFeadback.appendChild(listFromLocalStorage);
      });
      localStorage.clear();
    }
  } else if (useMongoDB) {
    getDataUser();
  } else {
    if(initIndexedDB()){
      getFromFeadbackDB();
     }
  }
}

const feadbackSubmit = e => {
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
      li.innerHTML += `${userDataInput.firstName} 
                        ${userDataInput.lastName}
                        ${userDataInput.email} 
                        ${userDataInput.text}`;
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
      listDB.innerHTML += `${id}
                            ${firstName}
                            ${lastName}
                            ${email}
                            ${feadback}`;
      addedFeadback.appendChild(listDB);
    } else {
      postToFeadbackDB(id, firstName, lastName, email, feadback);
    }
  }

  document.querySelector('form').reset();
};
document
  .querySelector('.form-group-admin-btn')
  .addEventListener('click', feadbackSubmit);

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
        listFromMongoDb.innerHTML += `${el['first-name']} 
                                      ${el['last-name']} 
                                      ${el.email} 
                                      ${el.feadback}`;
        addedFeadback.appendChild(listFromMongoDb);
      });
    });
};

document
  .querySelector('.form-group-admin-btn')
  .addEventListener('click', feadbackSubmit);

function initIndexedDB(){
  let openRequest = window.indexedDB.open('feadbackDataBase');
  openRequest.onupgradeneeded = () => {
    db = openRequest.result;
    db.createObjectStore('feadbackDB', { keyPath: 'id' });
  };
  openRequest.onsuccess = () => {
    db = openRequest.result;
  };
  openRequest.onerror = () => {
    console.error('Error, fix the bugs!!');
  };
}

function postToFeadbackDB(id, firstName, lastName, email, feadback) {
  let transaction = db.transaction('feadbackDB', 'readwrite');
  let feadbackDB = transaction.objectStore('feadbackDB');

  let objectDB = {
    id: `${id}`,
    'first-name': `${firstName}`,
    'last-name': `${lastName}`,
    email: `${email}`,
    feadback: `${feadback}`
  };
  feadbackDB.put(objectDB);
}

function getFromFeadbackDB() {
  let transaction = db.transaction('feadbackDB', 'readonly');
  let feadbackDB = transaction.objectStore('feadbackDB');
  let request = feadbackDB.openCursor();

  request.onsuccess = () => {
    let cursor = request.result;
    if (cursor) {
      let listPostedDB = document.createElement('li');
      listPostedDB.innerHTML += `First Name:${cursor.value['first-name']};
                                  Last Name:${cursor.value['last-name']};
                                  email:${cursor.value.email};
                                  feadback:${cursor.value.feadback}`;
      addedFeadback.appendChild(listPostedDB);
      cursor.continue();
    }
  };
}
