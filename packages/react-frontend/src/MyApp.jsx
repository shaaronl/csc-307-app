// src/MyApp.jsx
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);
  
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  } 
  
  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );


  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }
  
  function updateList(person) { 
        postUser(person)
          .then((res)=> (res.status === 201?
            res.json(): undefined)
          )
          //step 4?
          .then((newUser) => {
            if(newUser) setCharacters([...characters, newUser]);
          }).catch((error) => {
            console.log(error);
          })
  }
  function deleteUser(id) {
      const promise = fetch(`http://localhost:8000/users/${id}`, {
        method: "DELETE",
      });
    return promise;
  }
 function removeOneCharacter(id) {
  deleteUser(id)
    .then((res)=> {
        if(res.status === 204){
          setCharacters(characters.filter((user)=> user.id != id));
        } 
        else{
          console.log("res.status")
        }
  }).catch((error) => {
      console.log(error);
  })
}
return(
      <div className="container">
          <Table
          characterData={characters}
          removeCharacter={removeOneCharacter}
          />
          <Form handleSubmit={updateList} />
      </div>
  );
}
export default MyApp;
