// backend.js
import express from "express";
import cors from "cors"
import userServices from "./user-services.js";

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

// Get all users or filter by name/job
app.get("/users", (req, res) => {
  const { name, job } = req.query;
  userServices
    .getUsers(name, job)
    .then(users => res.send({ users_list: users }))
    .catch(err => res.status(500).send("An error occurred: " + err));
});

// Get user by ID
app.get("/users/:id", (req, res) => {
  const { id } = req.params["id"];

  userServices.findUserById(id)
    .then((user) => {
      if (user) res.send(user);
      else res.status(404).send(`not found ${id}`);
    })
    .catch((err) => res.status(500).send("An error occurred: " + err));
});

// Add a new user
app.post("/users", (req, res) => {
  const newUser = req.body;
  userServices
    .addUser(newUser)
    .then(result => res.status(201).send(result))
    .catch(err => res.status(500).send("An error occurred: " + err));
});

// Delete a user
app.delete("/users/:id", (req, res) =>{
  const userIdToDelete = req.params.id;
  userServices
      .deleteUserById(userIdToDelete)
      .then((result)=>
      {
        if (result) {
          res.status(204).send({ message: "User deleted successfully" });
        } else {
          res.status(404).send({ error: "User not found" });
        }
      })
      .catch(err => res.status(500).send("An error occurred: " + err));
});


