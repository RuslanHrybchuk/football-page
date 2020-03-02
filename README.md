before doing these steps please make sure you installed mongoDB and node.js packages on your local machine.
To launch server you need to do these steps:

1. install express and nodemon by comand: npm i express nodemon;
2. install mongoose by comand: npm mongoose;
3. setup mongoDB and create there user;
4. install dotenv by command: npm dotenv;
5. create file(in root) with name ".env", open file and
   add line - "MONGO_URL=link from mongoDB with user login and password"
6. install body-parse by comand: npm i body-parser;
   Now you can launch the server by comand:
   npm start
   find site on link https://localhost:3000

in the file admin.js or news.js to use local storage you need:

1. setup useLocalStorage to "true";
2. setup useMongoDB to "false";

in the file admin.js or news.js to use indexedDB you need:

1. setup useLocalStorage to "false";
2. setup useMongoDB to "false";

in the file admin.js or news.js to use MongoDB you need:

1. setup useLocalStorage to "false";
2. setup useMongoDB to "true";
