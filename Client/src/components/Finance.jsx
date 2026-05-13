import React, { useState, useEffect } from "react";
import "./Finance.css";

function Finance({ user }) {
    const [members, setMembersList] = useState([]);

    const [expenseName, setExpenseName] = useState("");
    const [totalCost, setTotalCost] = useState("");
    const [splits, setSplits] = useState({});
    const [expenses, setExpenses] = useState([]);

    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const currentFlat = JSON.parse(localStorage.getItem("currentFlat"));
    
    //use effect to set members
    useEffect(() => {
        // Simulate fetching members from the server
        const fetchMembers = async () => {
             try {
            const res = await fetch(`${API}/api/flats/${currentFlat.id}/members`);
            const data = await res.json();

            if (!res.ok) {
                console.error(data.message);
                setMembersList([]);
                return;
            }
            setMembersList(data.members || []);
        } catch (err) {
            console.error("Error fetching members:", err);
            setMembersList([]);
        }
        const fetcheExpenses = async () => {
            try{
            const res = await fetch(`${API}/api/flats/${currentFlat.id}/expenses`);
            const expensesData = await res.json();
            if(!res.ok) {
                console.error(expensesData.message);
                setExpenses([]);
                return;
            }
            setExpenses(expensesData.expenses || []);
            } catch (err) {
                console.error("Error fetching expenses:", err);
                setExpenses([]);
            }
        };
        fetchMembers();
        fetcheExpenses();
}}), [currentFlat?.id];

    const handleSplitChange = (member, value) => {
        setSplits({
            ...splits,
            [member]: parseFloat(value) || 0
        });
    };

    const addExpense = async () => {
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
            splits: splits,
            created_by: user?.id
        };
        console.log(newExpense);
          const res = await fetch(`${API}/expenses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: expenseName,
                    total: total,
                    splits: splits,
                    flat_id: currentFlat.id,
                    
                }),
            });

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
                    {members.map((m) => (
                        <div key={m.id} className="member-chip">
                            {m.name}
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
                    <div key={member.id} className="split-row">
                        <label>{member.name}</label>
                        <input
                            type="number"
                            placeholder="Amount"
                            onChange={(e) =>
                                handleSplitChange(member.id, e.target.value)
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
                                {Object.entries(exp.splits).map(([memberId, amount]) => {
                                    const memberObj = members.find(
                                        m => String(m.id) === String(memberId)
                                    );

                                    return (
                                        <li key={memberId}>
                                            {memberObj ? memberObj.name : "Unknown"}: ${amount}
                                        </li>
                                    );
                                })}
                                
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Finance;