import React, { useState, useEffect } from "react";
import "./App.css";
import Alert from "./components/Alert";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import uuid from "uuid/v4";

// const initialExpenses = [
//   { id: uuid(), charge: "rent", amount: 1200 },
//   { id: uuid(), charge: "groceries", amount: 200 },
//   { id: uuid(), charge: "car payment", amount: 900 }
// ];
const initialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];
function App() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [charge, setCharge] = useState("");
  const [amount, setAmount] = useState("");
  const [alert, setAlert] = useState({ show: false });
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(0);

  //Use effect
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  //Functionality
  const handleCharge = e => {
    setCharge(e.target.value);
  };
  const handleAmount = e => {
    setAmount(e.target.value);
  };

  //handle alert
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 3000);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map(item =>
          item.id === id ? { ...item, amount, charge } : item
        );
        setExpenses(tempExpenses);
        setEdit(false);
        setId(0);
      } else {
        const singleExpense = {
          id: uuid(),
          charge,
          amount
        };
        setExpenses(expenses.concat(singleExpense));
        handleAlert({ type: "success", text: "item added successfully" });
      }
      setAmount("");
      setCharge("");
    } else {
      //handle error validation
      handleAlert({
        type: "danger",
        text: "charge can't be empty and amount must be greater than 0"
      });
    }
  };
  //clear items
  const clearItems = () => {
    setExpenses([]);
  };

  //handle delete item
  const handleDelete = id => {
    let tempExpenses = expenses.filter(expenseItem => expenseItem.id !== id);
    setExpenses(tempExpenses);
    setAlert({ type: "danger", text: "item deleted successfully" });
  };
  //handle edit item
  const handleEdit = id => {
    let tempExpense = expenses.find(item => item.id === id);
    setAmount(tempExpense.amount);
    setCharge(tempExpense.charge);
    setEdit(true);
    setId(tempExpense.id);
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <h1>budget calculator</h1>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleCharge={handleCharge}
          handleAmount={handleAmount}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </main>
      <h1>
        total spending:{" "}
        <span className="total">
          $
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
