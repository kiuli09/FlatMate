import React, { useState } from "react";
import "./Finance.css";

function Finance({ user }) {
    const [members, setMembers] = useState([user.username]);

    const [expenseName, setExpenseName] = useState("");
    const [totalCost, setTotalCost] = useState("");
    const [splits, setSplits] = useState({});
    const [expenses, setExpenses] = useState([]);


    const handleSplitChange = (member, value) => {
        setSplits({
            ...splits,
            [member]: parseFloat(value) || 0
        });
    };

    const addExpense = () => {
        const total = parseFloat(totalCost);
        const totalSplit = Object.values(splits).reduce((a, b) => a + b, 0);

        if (!expenseName || !totalCost) {
            alert("Please fill in all fields");
            return;
        }

        if (totalSplit !== total) {
            alert("Split must equal total cost!");
            return;
        }

        const newExpense = {
            name: expenseName,
            total: total,
            splits: splits
        };

        setExpenses([...expenses, newExpense]);

        //reset form
        setExpenseName("");
        setTotalCost("");
        setSplits({});
    };

    return (
        <div>
            <div className="welcome-section">
                <h2>Finance</h2>
                <p>Track shared expenses in your flat</p>
            </div>

            <div className="section">
                <h3>Flat Members</h3>

                <div className="member-list">
                    {members.map((m, i) => (
                        <div key={i} className="member-chip">
                            {m}
                        </div>
                    ))}
                </div>
            </div>

            <div className="section">
                <h3>Add Expense</h3>
                <div className="add-item">
                    <input
                        type="text"
                        placeholder="Expense name"
                        value={expenseName}
                        onChange={(e) => setExpenseName(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Total cost"
                        value={totalCost}
                        onChange={(e) => setTotalCost(e.target.value)}
                    />
                </div>

                <h4>Custom Split</h4>

                {members.map((member) => (
                    <div key={member} className="split-row">
                        <label>{member}</label>
                        <input
                            type="number"
                            placeholder="Amount"
                            onChange={(e) =>
                                handleSplitChange(member, e.target.value)
                            }
                        />
                    </div>
                ))}

                <button onClick={addExpense}>Add Expense</button>
            </div>

            <div className="section">
                <h3>Expenses</h3>

                <div className="expenses-list">
                    {expenses.map((exp, index) => (
                        <div key={index} className="expense-card">
                            <div className="expense-row">
                                <span className="expense-name">
                                    {exp.name}
                                </span>
                                <span className="expense-total">
                                    ${exp.total}
                                </span>
                            </div>

                            <ul className="split-list">
                                {Object.entries(exp.splits).map(
                                    ([member, amount]) => (
                                        <li key={member}>
                                            {member}: ${amount}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Finance;