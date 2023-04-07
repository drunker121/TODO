import React, { useState } from "react";
import "./todo.css";
import { MdDelete, MdCheck, MdEdit, MdSave } from "react-icons/md";
import axios from 'axios';

const TODO = () => {
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);

  const handleAddItem = (inputValue, description, priority) => {
    const newTodo = {
      id: Date.now(),
      value: inputValue,
      description: description,
      priority: priority,
    };
    setTodos([...todos, newTodo]);
  };

  const handleDeleteItem = (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    const completedTodo = todos.find((todo) => todo.id === id);
    if (completedTodo) {
      setCompletedTodos([...completedTodos, completedTodo]);
    }
    setTodos(filteredTodos);
  };

  const handleEditItem = (id, newValue, newPriority, newDescription) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          value: newValue,
          priority: newPriority,
          description: newDescription,
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputValue = e.target.add.value;
    const description = e.target.description.value;
    const priority = e.target.priority.value;
    if (inputValue.length){
        handleAddItem(inputValue, description, priority);
        axios.post('http://localhost:5000', { task: inputValue, description: description })
        .then(response => {
          console.log(response.data);
          // handle success
        })
        .catch(error => {
          console.log(error.response.data);
          // handle error
        });
    } 
    e.target.add.value = "";
    e.target.description.value = "";
    e.target.priority.value = "";
  };


  const [editingItem, setEditingItem] = useState(null);

  const handleStartEditing = (id) => {
    setEditingItem(id);
  };

  const handleCancelEditing = () => {
    setEditingItem(null);
  };

  return (
    <>
      <div className="container">
        <header className="text-center text-light my-4">
          <h1 className="mb-4">Todo List</h1>
        </header>
        <ul className="list-group todos mx-auto text-light">
          {todos
            .sort((a, b) => a.priority - b.priority)
            .map((todo) => (
              <li
                key={todo.id}
                className="list-group-item d-flex justify-content-around align-items-center"
              >
                {editingItem === todo.id ? (
                  <>
                  <div className="d-flex flex-column">
                  <div className="">
                    <input
                      type="text"
                      defaultValue={todo.value}
                      className="form-control"
                      onChange={(e) =>
                        handleEditItem(
                          todo.id,
                          e.target.value,
                          todo.priority,
                          todo.description
                        )
                      }
                    />
                    <input
                      type="text"
                      defaultValue={todo.priority}
                      className="form-control"
                      onChange={(e) =>
                        handleEditItem(
                          todo.id,
                          todo.value,
                          e.target.value,
                          todo.description
                        )
                      }
                    />
                    <input
                      type="text"
                      defaultValue={todo.description}
                      className="form-control"
                      onChange={(e) =>
                        handleEditItem(
                          todo.id,
                          todo.value,
                          todo.priority,
                          e.target.value
                        )
                      }
                    />
                    </div>
                    <div className="text-center"><MdSave onClick={handleCancelEditing} /></div>
                    </div>
                  </>
                ) : (
                  <>
                  <div className="d-flex flex-column">
                    <div className="d-flex gap-5">
                      <span>{todo.value}</span>
                      <small className="text-muted d-block">
                        {todo.description}
                      </small>
                    </div>
                    <div className="d-flex gap-3 mt-3">
                      <span className="badge bg-primary">{todo.priority}</span>
                      <div><MdCheck onClick={() => handleDeleteItem(todo.id)} /></div>
                      <div><MdEdit onClick={() => handleStartEditing(todo.id)} /></div>
                      <div><MdDelete onClick={() => handleDeleteItem(todo.id)} /></div>
                    </div>
                  </div>
                  </>
                )}
              </li>
            ))}
        </ul>

        <ul className="list-group todos mx-auto text-light mt-4">
          <div className="container mt-5 pt-5">
            <h4 className="text-white text-center">Completed Tasks</h4>
          </div>
          {completedTodos.map((todo) => (
            <li
              key={todo.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{todo.value}</span>
              <small className="text-muted text-white d-block">
                        {todo.description}
                      </small>
              <MdDelete
                onClick={() =>
                  setCompletedTodos(
                    completedTodos.filter((item) => item.id !== todo.id)
                  )
                }
              />
            </li>
          ))}
        </ul>

        <form className="add text-center my-4" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="add" className="add text-light">
              Task:
            </label>
            <input type="text" className="form-control" name="add" id="add" />
          </div>
          <div className="form-group">
            <label htmlFor="description" className="add text-light">
              Description:
            </label>
            <input
              type="text"
              className="form-control"
              name="description"
              id="description"
            />
          </div>
          <div className="form-group">
            <label htmlFor="priority" className="add text-light">
              Priority:
            </label>
            <input
              type="number"
              min="1"
              max="9"
              className="form-control"
              name="priority"
              id="priority"
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Add Task
          </button>
        </form>
      </div>
    </>
  );
};

export default TODO;
