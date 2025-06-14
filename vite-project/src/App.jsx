import "./App.css";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  // const [count, setcount] = useState(100);
  // const [name, setname] = useState({ firstName: "", lastName: "" });
  const [inputValue, setinputValue] = useState("");
  const [text, setText] = useState([]);
  const [editText, seteditText] = useState(null);
  const [completed, setcompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleChange = (e) => {
    setinputValue(e.target.value);
  };

  const handleComplete = (index) => {
    if (completed.includes(index)) {
      setcompleted(completed.filter((i) => i !== index));
    } else {
      setcompleted([...completed, index]);
    }
  };

  const handleUndo = (index) => {
    handleComplete(index); // just toggle
  };

  const handleClick = () => {
    if (inputValue.trim() === "") {
      alert("text should not be empty");
      return;
    }

    if (editText != null) {
      const edited = [...text];
      edited[editText] = { ...edited[editText], text: inputValue };
      setText(edited);
      seteditText(null);
    } else {
      setText([
        ...text,
        { id: uuidv4(), text: inputValue, createdAt: new Date() },
      ]);
    }

    setinputValue("");
  };

  const handleEdit = (index) => {
    setinputValue(text[index].text);
    seteditText(index);
  };

  const handleDelete = (index) => {
    const newArr = [...text];
    newArr.splice(index, 1);
    setText(newArr);

    // Clean up completed indexes
    const updatedCompleted = completed
      .filter((i) => i !== index)
      .map((i) => (i > index ? i - 1 : i));
    setcompleted(updatedCompleted);
  };

  // const increment = () => setcount(count + 1);
  // const decrement = () => setcount(count - 1);

  // const handleFirstname = (e) => {
  //   setname({ ...name, firstName: e.target.value });
  // };
  // const handleLastname = (e) => {
  //   setname({ ...name, lastName: e.target.value });
  // };
  //initially text is empty, so UI renders empty, and second effect saves that empty before the first effect finishes reading.
  // And that ruins everything unless we block saving using loading
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    const savedCompleted = localStorage.getItem("completed");

    if (savedTodos) {
      const parsed = JSON.parse(savedTodos);
      const withDates = parsed.map((todo) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));
      setText(withDates);
    }

    if (savedCompleted) {
      setcompleted(JSON.parse(savedCompleted));
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("todos", JSON.stringify(text));
      localStorage.setItem("completed", JSON.stringify(completed));
    }
  }, [text, completed, loading]);
  if (loading) return <h3>Loading...</h3>;
  return (
    <>
      <div className="App">
        {/* <h1>{count}</h1> */}
        {/* <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button> */}

        <br />
        <br />

        {/* <input
        type="text"
        onChange={handleFirstname}
        placeholder="enter your name here : "
      />
      <input
        type="text"
        onChange={handleLastname}
        placeholder="enter your surname here : "
      /> */}
        {/* <h3>your name is : {name.firstName}</h3>
      <h3>your surname is : {name.lastName}</h3> */}

        <h3 style={{ color: "blue" }}>Todo List</h3>
        <input
          onChange={handleChange}
          type="text"
          placeholder="enter text here"
          value={inputValue}
        />
        <button onClick={handleClick}>value</button>

        {/* Render uncompleted tasks */}
        {text
          .map((item, index) => ({ item, index }))
          .filter(({ index }) => !completed.includes(index))
          .map(({ item, index }) => (
            <div className="flex" key={index}>
              <ul>
                <li>{item.text}</li>
                <br />
                <small>{item.createdAt.toLocaleString()}</small>
              </ul>
              <button
                className="deleteButton"
                onClick={() => handleComplete(index)}
              >
                complete
              </button>
              <button
                className="deleteButton"
                onClick={() => handleEdit(index)}
              >
                edit
              </button>
              <button
                className="deleteButton"
                onClick={() => handleDelete(index)}
              >
                delete
              </button>
            </div>
          ))}

        {/* Render completed tasks */}
        <div className="completedTodoList">
          <h3 style={{ color: "green" }}>Completed Todos</h3>
          {text
            .map((item, index) => ({ item, index }))
            .filter(({ index }) => completed.includes(index))
            .map(({ item, index }) => (
              <div className="flex" key={index}>
                <ul>
                  <li style={{ textDecoration: "line-through" }}>
                    {item.text}
                  </li>
                  <br />
                  <small>{item.createdAt.toLocaleString()}</small>
                </ul>
                <button
                  className="deleteButton"
                  onClick={() => handleUndo(index)}
                >
                  undo
                </button>
                <button
                  className="deleteButton"
                  onClick={() => handleDelete(index)}
                >
                  delete
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default App;
