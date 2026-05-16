import { useLayoutEffect, useEffect, useState } from "react";
import { useRef } from "react";
import "./Finance.css";
import { NavLink } from "react-router-dom";


function Finance({ user }) {

    const [flatmate, setFlatmates] = useState([]);
    const [owesYou, setOwesYou] = useState([])
    const [youOwe, setYouOwe] = useState([])
    const [paymentSplit, setPaymentSplit] = useState([25, 25, 25, 25])
    const [equalSplit, setEqualSplit] = useState(true)
    const [currentAmount, setCurrentAmount] = useState(0)
    const [splitIsValid, setSplitIsValid] = useState(true)
    const [transactions, setTransactions] = useState([])
    const [comment, setComment] = useState("")
    const [reoccuringType, setReoccuringType] = useState("S")
    const [categories, setCategories] = useState([])
    const [currentCategory, setCurrentCategory] = useState("")

    const submitRef = useRef()

    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const currentFlat = JSON.parse(localStorage.getItem("currentFlat"));

    useEffect(() => {
        // console.log("usigeffect")
        const fetchMembers = async () => {
            // console.log("FetchingMembers")
            try {
                // console.log("Pulling from db")
                const flatRes = await fetch(`${API}/api/flats/${currentFlat.id}/members`);
                const flatData = await flatRes.json();
                console.log(flatData.members)
                console.log(user.id)
                const filtered_members = flatData.members.filter(temp => temp.id !== user.id);
                console.log(filtered_members)

                setFlatmates(filtered_members || []);

                updateOwes()
                updateCategories()
                setPaymentSplit(new Array(filtered_members.length).fill(0))
                // console.log("a")
                // console.log(flatmate)
            } catch (err) {
                console.error("Error fetching Members:", err);
            }
        };
        fetchMembers()
    }, []);

    const updateOwes = async () => {
        const owesRes = await fetch(`${API}/api/finance/get-owes/${currentFlat.id}/${user.id}`);
        const data = await owesRes.json();
        console.log(data.owesYou)
        console.log(data.youOwe)

        setOwesYou(data.owesYou)
        setYouOwe(data.youOwe)
    }

    const updateCategories = async () => {
        const owesRes = await fetch(`${API}/api/finance/${currentFlat.id}/categories`);
        const data = await owesRes.json();
        console.log(data.categories.map(a => a.category.trim()))

        setCategories(data.categories.map(a => a.category.trim()))
    }

    const submitTransaction = async () => {
        console.log("submittingTransaction" + user.id)

        try {
            const res = await fetch(`${API}/api/finance/add-transaction`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    flat_id: currentFlat.id,
                    amount: currentAmount,
                    comment: comment,
                    split: paymentSplit,
                    members: flatmate,
                    current_user: user,
                    reoccuringType: reoccuringType,
                    category: currentCategory
                })
            })
            console.log("Transaction Submitted")
        } catch (err) {
            console.error("Error submitting transactions:", err);
        }
        updateOwes()
    }

    const settleByCategory = async (event, flavour) => {
        console.log(event.target.name)
        console.log(owesYou[event.target.name])
        console.log(flavour)
        console.log(owesYou)
        console.log(youOwe)
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
                })
                console.log("Transaction Settled")
            } catch (err) {
                console.error("Error Settling transaction:", err);
            }
        } else {
            console.log(youOwe[event.target.name])
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
                })
                console.log("Transaction Settled")
            } catch (err) {
                console.error("Error Settling transaction:", err);
            }
        }
        updateOwes()
    }

    const updateComment = (event) => {
        setComment(event.target.value)
        console.log(comment)
    }

    const updateCurrentCategory = (event) => {
        setCurrentCategory(event.target.value)
        console.log(currentCategory)
    }

    const updateCurrentAmount = (event) => {
        setCurrentAmount(event.target.value)
        checkSplitValidity()
        console.log(currentAmount)
    }

    const updateEqualSplit = (event) => {
        setEqualSplit(event.target.checked)
        setSplitEqually()
        checkSplitValidity()
        console.log(equalSplit)
    }

    const updatePaymentSplit = (event, index) => {
        setPaymentSplit([...paymentSplit.slice(0, index), Number(event), ...paymentSplit.slice(index + 1)])
        checkSplitValidity()
    }

    const updateReoccuringType = (event) => {
        setReoccuringType(event.target.value)
        console.log(reoccuringType)
    }

    const addTransaction = (event) => {
        let temp = owesYou
        if (equalSplit) {
            for (let i = 0; i < owesYou.length; i++) {
                temp += currentAmount / 4
            }
        } else {
            for (let i = 0; i < owesYou.length; i++) {
                temp += currentAmount / 4
            }
        }
        setOwesYou(temp)
    }

    const getTotalPaymentSplit = () => {
        let temp = 0
        for (let i = 0; i < paymentSplit.length; i++) {
            temp += paymentSplit[i]
        }
        return temp
    }

    const setSplitEqually = () => {
        let temp = paymentSplit
        console.log("Setting split equally")
        console.log(transactions)
        for (let i = 0; i < paymentSplit.length; i++) {
            temp[i] = currentAmount / flatmate.length
        }
        setPaymentSplit(temp)
        console.log(paymentSplit)
    }

    const checkSplitValidity = () => {
        console.log("Checking Split Validity")
        if (equalSplit) {
            setSplitIsValid(true)
            submitRef.current.disabled = false
            console.log("Split is equal so true")

        } else {
            if (Number(getTotalPaymentSplit()) === Number(currentAmount)) {
                setSplitIsValid(true)
                submitRef.current.disabled = false
                console.log("paymentsplit and currentamount is equal so true")
            } else {
                setSplitIsValid(false)
                submitRef.current.disabled = true
                console.log("Neither is equal so false")
            }
        }
    }

    return (
        <main >
            <div className="welcome-section">
                <h2>Finance</h2>
                <p>Manage finances with your flatmates</p>
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

                <div className="finance-grid-element" >
                    <h2>
                        Add Transaction
                    </h2>
                    <div className="add-transaction">
                        <input
                            type="number"
                            placeholder="Enter Amount"
                            onChange={updateCurrentAmount}
                            name="amountInput"
                        />
                    </div>
                    <div className="add-transaction">
                        <input
                            type="text"
                            placeholder={"Chose Category: " + categories.join()}
                            onChange={updateCurrentCategory}
                        />
                    </div>
                    <div className="add-transaction">
                        <input
                            type="text"
                            name="TransactionComment"
                            placeholder="Add Comment"
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
                        <label For="isEqualSplit">Equal Payment Split</label>
                    </div>

                    {equalSplit ? (
                        <p></p>
                    ) : (
                        <div>
                            <p>{Number(getTotalPaymentSplit())}/{Number(currentAmount)}</p>
                            {flatmate.map((currentFlatmate, x) => (
                                <div className="add-transaction">
                                    <input
                                        type="number"
                                        id={"box" + x}
                                        key={"box" + x}
                                        value={paymentSplit[x]}
                                        name={x}
                                        onChange={(e) => updatePaymentSplit(e.target.value, x)}
                                    />
                                    <label For={"box" + x}>{currentFlatmate.name}</label>
                                </div>
                            ))}
                        </div>)}
                    <p>Submit</p>
                    <input
                        type="button"
                        id="TansactionSubmitButton"
                        value="Add Transaction"
                        ref={submitRef}
                        onClick={submitTransaction} />
                </div>
            </div>
            <div className="finance-grid-element">
                <h2>
                    Summary:
                </h2>
                <table>
                    <tbody>
                        <tr>
                            <td>

                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>

        </main>
    )
}

export default Finance;
