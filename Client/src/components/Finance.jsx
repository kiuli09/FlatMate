import React, { useState, useEffect } from "react";
import { useLayoutEffect } from "react";
import { useRef } from "react";
import "./Finance.css";
import { NavLink } from "react-router-dom";

function Finance({ user }) {
    const [members, setMembersList] = useState([]);
    const [flatmate, setFlatmates] = useState([]);

    const [owesYou, setOwesYou] = useState([]);
    const [youOwe, setYouOwe] = useState([]);
    const [paymentSplit, setPaymentSplit] = useState([]);
    const [equalSplit, setEqualSplit] = useState(true);
    const [currentAmount, setCurrentAmount] = useState("");
    const [splitIsValid, setSplitIsValid] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [comment, setComment] = useState("");
    const [reoccuringType, setReoccuringType] = useState("S");
    const [categories, setCategories] = useState([]);
    const [summary, setSummary] = useState([]);
    const [currentCategory, setCurrentCategory] = useState("");

    const [expenseName, setExpenseName] = useState("");
    const [totalCost, setTotalCost] = useState("");
    const [splits, setSplits] = useState({});
    const [expenses, setExpenses] = useState([]);
    const [expenseType, setExpenseType] = useState("One time");
    const [filterType, setFilterType] = useState("All");

    const submitRef = useRef();

    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const currentFlat = JSON.parse(localStorage.getItem("currentFlat"));

    //use effect to set members
    const fetchExpenses = async () => {
        try {
            const res = await fetch(
                `${API}/api/flats/${currentFlat.id}/expenses`
            );

            const expensesData = await res.json();
            console.log("Fetched expenses:", expensesData);
            if (!res.ok) {
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

    useEffect(() => {
        // console.log("usigeffect")
        const fetchMembers = async () => {
            // console.log("FetchingMembers")
            try {
                // console.log("Pulling from db")
                const flatRes = await fetch(`${API}/api/flats/${currentFlat.id}/members`);
                const flatData = await flatRes.json();

                if (!flatRes.ok) {
                    console.error(flatData.message);
                    setMembersList([]);
                    setFlatmates([]);
                    return;
                }

                console.log(flatData.members);
                console.log(user.id);

                setMembersList(flatData.members || []);

                const filtered_members = flatData.members.filter(temp => temp.id !== user.id);
                console.log(filtered_members);

                setFlatmates(filtered_members || []);

                updateOwes();
                updateCategories();
                updateSummary();
                setPaymentSplit(new Array(filtered_members.length).fill(0));
                // console.log("a")
                // console.log(flatmate)
            } catch (err) {
                console.error("Error fetching Members:", err);
                setMembersList([]);
                setFlatmates([]);
            }
        };

        fetchMembers();
        fetchExpenses();
    }, [currentFlat?.id]);

    const updateOwes = async () => {
        const owesRes = await fetch(`${API}/api/finance/get-owes/${currentFlat.id}/${user.id}`);
        const data = await owesRes.json();
        console.log(data.owesYou);
        console.log(data.youOwe);

        setOwesYou(data.owesYou || []);
        setYouOwe(data.youOwe || []);
        updateSummary();
    };

    const updateCategories = async () => {
        const owesRes = await fetch(`${API}/api/finance/${currentFlat.id}/categories`);
        const data = await owesRes.json();
        console.log(data.categories.map(a => a.category.trim()));

        setCategories(data.categories.map(a => a.category.trim()));
    };

    const updateSummary = async () => {
        const owesRes = await fetch(`${API}/api/finance/${currentFlat.id}/monthly_summary`);
        const data = await owesRes.json();
        console.log(data.summary);

        setSummary(data.summary || []);
    };

    const submitTransaction = async () => {
        console.log("submittingTransaction" + flatmate);

        try {
            const res = await fetch(`${API}/api/finance/add-transaction`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    flat_id: currentFlat.id,
                    amount: currentAmount/flatmate.length,
                    comment: comment,
                    split: paymentSplit,
                    members: flatmate,
                    current_user: user,
                    reoccuringType: reoccuringType,
                    category: currentCategory
                })
            });

            console.log("Transaction Submitted");
        } catch (err) {
            console.error("Error submitting transactions:", err);
        }

        updateOwes();
        fetchExpenses();
    };

    const settleByCategory = async (event, flavour) => {
        console.log(event.target.name);
        console.log(owesYou[event.target.name]);
        console.log(flavour);
        console.log(owesYou);
        console.log(youOwe);

        if (flavour == "oweYou") {
            try {
                const res = await fetch(`${API}/api/finance/settle-by-category`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        flat_id: currentFlat.id,
                        created_by: user.id,
                        category: owesYou[event.target.name].category,
                        user_id: owesYou[event.target.name].user_id
                    })
                });

                console.log("Transaction Settled");
            } catch (err) {
                console.error("Error Settling transaction:", err);
            }
        } else {
            console.log(youOwe[event.target.name]);

            try {
                const res = await fetch(`${API}/api/finance/settle-by-category`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        flat_id: currentFlat.id,
                        created_by: youOwe[event.target.name].created_by,
                        category: youOwe[event.target.name].category,
                        user_id: user.id
                    })
                });

                console.log("Transaction Settled");
            } catch (err) {
                console.error("Error Settling transaction:", err);
            }
        }

        updateOwes();
    };

    const updateComment = (event) => {
        setComment(event.target.value);
        console.log(comment);
    };

    const updateCurrentCategory = (event) => {
        setCurrentCategory(event.target.value);
        console.log(currentCategory);
    };

    const updateCurrentAmount = (event) => {
        const value = event.target.value;
        setCurrentAmount(value);

        if (equalSplit && flatmate.length > 0) {
            const amountPerPerson = Number(value) / flatmate.length;
            setPaymentSplit(new Array(flatmate.length).fill(amountPerPerson));
        }

        checkSplitValidity(value, paymentSplit);
        console.log(currentAmount);
    };

    const updateEqualSplit = (event) => {
        const checked = event.target.checked;
        setEqualSplit(checked);

        if (checked) {
            setSplitEqually();
            setSplitIsValid(true);

            if (submitRef.current) {
                submitRef.current.disabled = false;
            }
        } else {
            checkSplitValidity(currentAmount, paymentSplit);
        }

        console.log(equalSplit);
    };

    const updatePaymentSplit = (event, index) => {
        const newSplit = [
            ...paymentSplit.slice(0, index),
            Number(event),
            ...paymentSplit.slice(index + 1)
        ];

        setPaymentSplit(newSplit);
        checkSplitValidity(currentAmount, newSplit);
    };

    const updateReoccuringType = (event) => {
        setReoccuringType(event.target.value);
        console.log(reoccuringType);
    };

    const addTransaction = (event) => {
        let temp = owesYou;

        if (equalSplit) {
            for (let i = 0; i < owesYou.length; i++) {
                temp += currentAmount / 4;
            }
        } else {
            for (let i = 0; i < owesYou.length; i++) {
                temp += currentAmount / 4;
            }
        }

        setOwesYou(temp);
    };

    const getTotalPaymentSplit = () => {
        let temp = 0;

        for (let i = 0; i < paymentSplit.length; i++) {
            temp += Number(paymentSplit[i]);
        }

        return temp;
    };

    const setSplitEqually = () => {
        console.log("Setting split equally");
        console.log(transactions);

        if (flatmate.length === 0) return;

        const temp = new Array(flatmate.length).fill(Number(currentAmount) / flatmate.length);

        setPaymentSplit(temp);
        console.log(paymentSplit);
    };

    const checkSplitValidity = (amount = currentAmount, split = paymentSplit) => {
        console.log("Checking Split Validity");

        if (equalSplit) {
            setSplitIsValid(true);

            if (submitRef.current) {
                submitRef.current.disabled = false;
            }

            console.log("Split is equal so true");
        } else {
            const totalSplit = split.reduce((a, b) => a + Number(b), 0);

            if (Number(totalSplit) === Number(amount)) {
                setSplitIsValid(true);

                if (submitRef.current) {
                    submitRef.current.disabled = false;
                }

                console.log("paymentsplit and currentamount is equal so true");
            } else {
                setSplitIsValid(false);

                if (submitRef.current) {
                    submitRef.current.disabled = true;
                }

                console.log("Neither is equal so false");
            }
        }
    };

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

        const res = await fetch(`${API}/expenses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: expenseName,
                total: total,
                splits: splits,
                expense_type: expenseType,
                flat_id: currentFlat.id,
                created_by: user?.username || user?.name,
                receipt_url: null
            }),
        });

        const data = await res.json();

        const newExpense = {
            id: data.expense.transaction_id,
            name: expenseName,
            total: total,
            splits: splits,
            expense_type: expenseType.trim(),
            created_by: user?.username || user?.name,
            receipt_url: null
        };

        setExpenses([...expenses, newExpense]);

        //reset form
        setExpenseName("");
        setTotalCost("");
        setSplits({});
    };
    const deleteExpense = async (expenseId) => {
        try {
            const res = await fetch(`${API}/expenses/${expenseId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setExpenses(expenses.filter((exp) => exp.id !== expenseId));
            } else {
                console.error("Error deleting expense");
            }
        } catch (err) {
            console.error("Error deleting expense:", err);
        }
    };
    const handleReceiptUpload = async (expenseId, file) => {
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append("receipt", file);

            const res = await fetch(`${API}/expenses/${expenseId}/receipt`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data.message);
                return;
            }

            // Update expense with receipt URL
            setExpenses((prev) =>
                prev.map((exp) =>
                    exp.id === expenseId
                        ? { ...exp, receipt_url: data.receipt_url }
                        : exp
                )
            );
        } catch (err) {
            console.error("Error uploading receipt:", err);
        }
    };

    const filterByType = async (type) => {
        try {
            console.log("Filtering by type:", type);

            if (type === "All") {
                await fetchExpenses();
                return;
            } else {
                const res = await fetch(
                    `${API}/api/flats/${currentFlat.id}/expenses/${type}`
                );

                const expensesData = await res.json();
                console.log("Filtered expenses:", expensesData);
                setExpenses(expensesData.expenses || []);
            }
        } catch (err) {
            console.error("Error filtering expenses:", err);
        }
    };

    return (
        <main>
            <div className="welcome-section">
                <h2>Finance</h2>
                <p>Manage finances with your flatmates</p>
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

            <div className="finance-grid">
                <div className="finance-grid-element">
                    <h2>Overview</h2>

                    <div className="finance-grid-element">
                        <h3>These people owe you:</h3>

                        {owesYou.map((current, x) => (
                            <p key={x}>
                                <input
                                    type="button"
                                    id={"submitOweYouRow" + x}
                                    name={x}
                                    onClick={(event) => settleByCategory(event, "oweYou")}
                                // flavour="oweYou"
                                />
                                {current.name}: ${current.sum} for {current.category}
                            </p>
                        ))}
                    </div>

                    <div className="finance-grid-element">
                        <h3>You owe these people:</h3>

                        {youOwe.map((current, x) => (
                            <p key={x}>
                                <input
                                    type="button"
                                    id={"submitYouOweRow" + x}
                                    name={x}
                                    onClick={(event) => settleByCategory(event, "youOwe")}
                                // flavour="youOwe"
                                />
                                {current.name}: ${current.sum} for {current.category}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="finance-grid-element">
                    <h2>Add Transaction</h2>

                    <div className="add-transaction">
                        <input
                            type="number"
                            placeholder="Enter Amount"
                            value={currentAmount}
                            onChange={updateCurrentAmount}
                            name="amountInput"
                        />
                    </div>

                    <div className="add-transaction">
                        <input
                            type="text"
                            placeholder={"Chose Category: " + categories.join()}
                            value={currentCategory}
                            onChange={updateCurrentCategory}
                        />
                    </div>

                    <div className="add-transaction">
                        <input
                            type="text"
                            name="TransactionComment"
                            placeholder="Add Comment"
                            value={comment}
                            onChange={updateComment}
                        />
                    </div>

                    <div>
                        <select
                            id="reoccuringDropDown"
                            name="reoccuringDropDown"
                            value={reoccuringType}
                            onChange={updateReoccuringType}
                        >
                            <option value="S"> Single Payment</option>
                            <option value="W"> Reoccurs Weekly</option>
                            <option value="M"> Reoccurs Monthly</option>
                        </select>
                    </div>

                    <div>
                        <input
                            type="checkbox"
                            name="isEqualSplit"
                            id="equalSplitCheck"
                            checked={equalSplit}
                            onChange={updateEqualSplit}
                        />
                        <label htmlFor="equalSplitCheck">Equal Payment Split</label>
                    </div>

                    {equalSplit ? (
                        <p></p>
                    ) : (
                        <div>
                            <p>{Number(getTotalPaymentSplit())}/{Number(currentAmount)}</p>

                            {flatmate.map((currentFlatmate, x) => (
                                <div className="add-transaction" key={currentFlatmate.id}>
                                    <input
                                        type="number"
                                        id={"box" + x}
                                        key={"box" + x}
                                        value={paymentSplit[x] || 0}
                                        name={x}
                                        onChange={(e) => updatePaymentSplit(e.target.value, x)}
                                    />
                                    <label htmlFor={"box" + x}>{currentFlatmate.name}</label>
                                </div>
                            ))}
                        </div>
                    )}

                    {!splitIsValid && (
                        <p className="split-error">Split must equal the total amount.</p>
                    )}

                    <p>Submit</p>

                    <input
                        type="button"
                        id="TansactionSubmitButton"
                        value="Add Transaction"
                        ref={submitRef}
                        onClick={submitTransaction}
                    />
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

                    <select
                        value={expenseType}
                        onChange={(e) => setExpenseType(e.target.value)}
                    >
                        <option value="One time">One time</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                    </select>
                </div>

                <h4>Custom Split</h4>

                {members.map((member) => (
                    <div key={member.id} className="split-row">
                        <label>{member.name}</label>
                        <input
                            type="number"
                            placeholder="Amount"
                            value={splits[member.id] || ""}
                            onChange={(e) =>
                                handleSplitChange(member.id, e.target.value)
                            }
                        />
                    </div>
                ))}

                <button onClick={addExpense}>Add Expense</button>
            </div>

            <div className="section">
                <div className="expense-header">
                    <h3>Expenses</h3>

                    <div className="filter-controls">
                        <p>filter by type:</p>

                        <select
                            className="expense-type-filter"
                            value={filterType}
                            onChange={(e) => {
                                const selectedType = e.target.value;
                                setFilterType(selectedType);
                                filterByType(selectedType);
                            }}
                        >
                            <option value="All">All</option>
                            <option value="One time">One time</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>
                </div>

                <div className="expenses-list">
                    {expenses.map((exp, index) => (
                        <div key={exp.id || index} className="expense-card">
                            <div className="expense-row">
                                <span className="expense-name">
                                    {exp.name}
                                </span>

                                <span className="expense-total">
                                    ${exp.total}
                                </span>
                            </div>

                            <ul className="split-list">
                                {Object.entries(exp.splits || {}).map(([memberId, amount]) => {
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

                            <div className="expense-bottom-row">
                                <span className="expense-type">Type: {exp.expense_type}</span>
                                <span className="expense-created-by">Created by: {exp.created_by}</span>
                            </div>
                            <div className="expense-bottom-row-buttons">
                                <div className="receipt-actions">
                                    {exp.receipt_url ? (
                                        <>
                                            <button
                                                className="view-receipt-btn"
                                                onClick={() =>
                                                    window.open(`${API}${exp.receipt_url}`, "_blank")
                                                }
                                            >
                                                View Receipt
                                            </button>

                                            <label className="receipt-upload-btn">
                                                Change Receipt
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    hidden
                                                    onChange={(e) =>
                                                        handleReceiptUpload(exp.id, e.target.files[0])
                                                    }
                                                />
                                            </label>
                                        </>
                                    ) : (
                                        <label className="receipt-upload-btn">
                                            Add Receipt
                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={(e) =>
                                                    handleReceiptUpload(exp.id, e.target.files[0])
                                                }
                                            />
                                        </label>
                                    )}
                                </div>

                                <button
                                    className="expense-delete-button"
                                    onClick={() => deleteExpense(exp.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="finance-grid-element">
                <h2>Summary:</h2>
                <p>Total amount spent on flat related costs by month and category</p>

                <table className="summary-table">
                    <thead>
                        <tr>
                            <th className="summary-table-heading">Category</th>
                            <th className="summary-table-heading">Jan</th>
                            <th className="summary-table-heading">Feb</th>
                            <th className="summary-table-heading">March</th>
                            <th className="summary-table-heading">April</th>
                            <th className="summary-table-heading">May</th>
                            <th className="summary-table-heading">June</th>
                            <th className="summary-table-heading">July</th>
                            <th className="summary-table-heading">August</th>
                            <th className="summary-table-heading">September</th>
                            <th className="summary-table-heading">October</th>
                            <th className="summary-table-heading">November</th>
                            <th className="summary-table-heading">December</th>
                        </tr>
                    </thead>

                    <tbody className="summary-table">
                        {summary.map((data, x) => (
                            <tr className="summary-table" key={x}>
                                <td className="summary-table">{data.category}</td>
                                <td className="summary-table">${data.Jan}</td>
                                <td className="summary-table">${data.Feb}</td>
                                <td className="summary-table">${data.Mar}</td>
                                <td className="summary-table">${data.Apr}</td>
                                <td className="summary-table">${data.May}</td>
                                <td className="summary-table">${data.Jun}</td>
                                <td className="summary-table">${data.Jul}</td>
                                <td className="summary-table">${data.Aug}</td>
                                <td className="summary-table">${data.Sep}</td>
                                <td className="summary-table">${data.Oct}</td>
                                <td className="summary-table">${data.Nov}</td>
                                <td className="summary-table">${data.Dec}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default Finance;