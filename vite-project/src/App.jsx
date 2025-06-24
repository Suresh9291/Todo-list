import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

function App() {
  const [inputValue, setinputValue] = useState("");
  const [text, setText] = useState([]);
  const [editMode, seteditMode] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const isInputEmpty = inputValue.trim() === "";
  const handleInputChange = (e) => {
    setinputValue(e.target.value);
    // console.log(e.target.value);
  };
  const handleAddItem = () => {
    if (isInputEmpty) {
      alert("value should not be empty");
      return;
    }
    if (editMode !== null) {
      const updatedText = text.map((item) => {
        if (item.id === editMode) {
          return { ...item, text: inputValue };
        } else {
          return item;
        }
      });
      setText(updatedText);
      seteditMode(null);
    } else {
      setText([
        ...text,
        {
          id: uuidv4(),
          text: inputValue,
          dueDate: selectedDate,
          createdAt: new Date(),
          completedAt: null,
        },
      ]);
      setSelectedDate(new Date());
    }

    setinputValue("");
  };
  const handleCompleteBtn = (completeId) => {
    if (!completed.includes(completeId)) {
      setCompleted([...completed, completeId]);
      setText((prevText) =>
        prevText.map((item) =>
          item.id === completeId ? { ...item, completedAt: new Date() } : item
        )
      );
    }
  };

  const handleEditBtn = (editId, itemText) => {
    setinputValue(itemText);
    seteditMode(editId);
  };
  const handleDeleteBtn = (itemId) => {
    setText(text.filter((item) => item.id !== itemId));
  };
  const handleUndoBtn = (undoId) => {
    setCompleted(completed.filter((id) => id !== undoId));
  };

  useEffect(() => {
    const savedText = JSON.parse(localStorage.getItem("texts"));
    const savedComplete = JSON.parse(localStorage.getItem("completed"));

    if (savedText) {
      const parsedText = savedText.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        dueDate: new Date(item.dueDate),
        completedAt: item.completedAt ? new Date(item.completedAt) : null,
      }));
      setText(parsedText);
    }
    if (savedComplete) setCompleted(savedComplete);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("texts", JSON.stringify(text));
      localStorage.setItem("completed", JSON.stringify(completed));
    }
  }, [text, completed, loading]);

  if (loading) {
    return <h2>Loading your tasks...</h2>; // or a spinner
  }
  console.log("Component rendered", text);

  return (
    <>
      <div className="container">
        <h1>Todo List</h1>
        <div className=" input-card">
          <div className="input-section">
            <input
              value={inputValue}
              className="input"
              type="text"
              placeholder="enter your today's task"
              onChange={handleInputChange}
            />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              customInput={
                <button className="calendar-icon" title="Pick a date">
                  <span className="material-symbols-outlined">
                    calendar_month
                  </span>
                </button>
              }
            />
            <button
              onClick={handleAddItem}
              className="addBtn"
              disabled={isInputEmpty}
            >
              {editMode !== null ? "save" : "add"}
            </button>
          </div>
        </div>

        <h4>Pending Tasks</h4>
        {text.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No tasks yet. Add one to get started!
          </p>
        )}

        <ul>
          {text
            .filter((item) => !completed.includes(item.id))
            .map((item) => (
              <li className="section pending-Tasks" key={item.id}>
                <div className="task-content">
                  <div className="task-text"> {item.text}</div>
                </div>
                <small className="timeStamp">
                  Created:{" "}
                  {format(new Date(item.createdAt), "dd MMM yyyy, h:mm a")}
                </small>
                <br />
                <small className="timeStamp">
                  Due: {format(new Date(item.dueDate), "dd MMM yyyy, h:mm a")}
                </small>
                <div className="btn-container">
                  <button
                    className="completeBtn btns "
                    onClick={() => handleCompleteBtn(item.id)}
                  >
                    complete
                  </button>
                  <button
                    className="editBtn btns "
                    onClick={() => handleEditBtn(item.id, item.text)}
                  >
                    edit
                  </button>
                  <button
                    className="deleteBtn btns "
                    onClick={() => handleDeleteBtn(item.id)}
                  >
                    delete
                  </button>
                </div>
              </li>
            ))}
        </ul>

        <h4>Completed Tasks</h4>
        <ul>
          {text
            .filter((item) => completed.includes(item.id))
            .map((item) => (
              <li className=" section completed-Tasks " key={item.id}>
                {item.text}
                <br />
                <small className="timeStamp">
                  Created:{" "}
                  {format(new Date(item.createdAt), "dd MMM yyyy, h:mm a")}
                </small>
                <br />
                <small className="timeStamp">
                  Due: {format(new Date(item.dueDate), "dd MMM yyyy, h:mm a")}
                </small>
                <br />
                <small className="timeStamp">
                  Completed:{" "}
                  {format(new Date(item.completedAt), "dd MMM yyyy, h:mm a")}
                </small>

                <div className="btn-container">
                  <button
                    className="undoBtn btns "
                    onClick={() => handleUndoBtn(item.id)}
                  >
                    undo
                  </button>
                  <button
                    className="deleteBtn btns "
                    onClick={() => handleDeleteBtn(item.id)}
                  >
                    delete
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

export default App;
