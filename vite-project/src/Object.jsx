import React from "react";
import { useState } from "react";

const Object = () => {
  const [count, setcount] = useState(100);
  const [name, setname] = useState({ firstName: "", lastName: "" });
  const increment = () => setcount(count + 1);
  const decrement = () => setcount(count - 1);

  const handleFirstname = (e) => {
    setname({ ...name, firstName: e.target.value });
  };
  const handleLastname = (e) => {
    setname({ ...name, lastName: e.target.value });
  };
  return (
    <>
      <h1>{count}</h1>
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
      <div>
        <input
          type="text"
          onChange={handleFirstname}
          placeholder="enter your name here : "
        />
        <input
          type="text"
          onChange={handleLastname}
          placeholder="enter your surname here : "
        />
        <h3>your name is : {name.firstName}</h3>
        <h3>your surname is : {name.lastName}</h3>
      </div>
    </>
  );
};

export default Object;
