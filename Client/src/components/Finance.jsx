import { useLayoutEffect, useEffect, useState } from "react";
import { useRef } from "react";
import "./Finance.css";
import { NavLink } from "react-router-dom";


function Finance({ user }) {

    const [flatmate, setFlatmates] = useState([]);
    const [owes, setOwes] = useState([])
    const [paymentSplit, setPaymentSplit] = useState([25, 25, 25, 25])
    const [equalSplit, setEqualSplit] = useState(true)
    const [currentAmount, setCurrentAmount] = useState(0)
    const [splitIsValid, setSplitIsValid] = useState(true)
    const [transactions, setTransactions] = useState([])
    const [comment, setComment] = useState("")
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
        console.log(data.owes)

        setOwes(data.owes)
    }

    const submitTransaction = async () => {
        console.log("submittingTransaction")
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
                    current_user: user
                })
            })
            console.log("Transaction Submitted")
        } catch (err) {
            console.error("Error submitting transactions:", err);
        }
        updateOwes()
    }

    const updateComment = (event) => {
        setComment(event.target.value)
        console.log(comment)
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

    const addTransaction = (event) => {
        let temp = owes
        if (equalSplit) {
            for (let i = 0; i < owes.length; i++) {
                temp += currentAmount / 4
            }
        } else {
            for (let i = 0; i < owes.length; i++) {
                temp += currentAmount / 4
            }
        }
        setOwes(temp)
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
                    {owes.map((current, x) => (
                        <p key={x}>
                            {current.name} owes you ${current.sum} for {current.category}
                        </p>
                    ))}
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
                        <input
                            type="checkbox"
                            name="isReoccuring"
                            checked={false}
                        />
                        <label htmlFor="isReoccuring">Reoccuring</label>
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
            </div>

        </main>
    )
}

export default Finance;
