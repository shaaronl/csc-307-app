// backend.js
import express from "express";
import cors from "cors"

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);


const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const hardDeleteUserById = (id) => {
  //filter out everyhting that's not equal to id
  if(!findUserById(id)){
    throw new Error("User not found"); 
  }
  users["users_list"] = users["users_list"].filter(user => user["id"] !== id);
  return 200;
};

// note: if name is found, but job isn't the findUserByName will run.
const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(((user) => user["name"] === name) && ((user) => user["job"] === job));
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

function generateID(length) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  let id = '';

  for (let i = 0; i < 3; i++) {
      id += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  for (let i = 0; i < length - 3; i++) {
      id += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return id;
}
// returning the newly created object from POST
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const id = generateID(6);
  req.body.id = id
  addUser(userToAdd);
  res.status(201).json(userToAdd);
});

app.delete("/users/:id", (req, res) => {
  const userIdToDelete = req.params.id;
  const deleted = hardDeleteUserById(userIdToDelete);
  if(deleted){
    res.status(204).send('No Content Created'); 
  }else{
    res.status(404).send("Resource Not Found");
  }
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if ((name != undefined) && (job != undefined)) {
    let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});
