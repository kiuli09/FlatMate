import { useLayoutEffect,useEffect, useState } from "react";
import { useRef } from "react";
import "./Finance.css";
import { NavLink } from "react-router-dom";


function Finance({ user }) {
    
    const [flatmate,setFlatmates] = useState([]);
    const [owes,setOwes] = useState([0,100,100,0])
    const [paymentSplit, setPaymentSplit] = useState([25,25,25,25])
    const [equalSplit, setEqualSplit] = useState(true)
    const [currentAmount, setCurrentAmount] = useState(0)
    const [splitIsValid, setSplitIsValid] = useState(true)
    const [transactions, setTransactions] = useState([])
    const [comment, setComment] =useState("")
    const submitRef = useRef()
    
    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const currentFlat = JSON.parse(localStorage.getItem("currentFlat"));

    useEffect (() => {
        // console.log("usigeffect")
        const fetchMembers = async () => {
            // console.log("FetchingMembers")
            try {
                // console.log("Pulling from db")
                const res = await fetch(`${API}/api/flats/${currentFlat.id}/members`);
                const data = await res.json();
                // console.log(data.members)

                setFlatmates(data.members || []);
                // console.log("a")
                // console.log(flatmate)
            } catch (err) {
                console.error("Error fetching Members:", err);
            }
        };
        fetchMembers()
    }, []);
    
    const submitTransaction = async () => {
        console.log("submittingTransaction")
        try {
            const res = await fetch(`${API}/api/finance/add-transaction`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    flat_id: currentFlat.id,
                    amount: currentAmount,
                    comment: comment,
                    split: paymentSplit,
                    members: flatmate
                })
            })
            console.log("Transaction Submitted")
        }catch (err) {
                console.error("Error submitting transactions:", err);
            }
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

    const updatePaymentSplit = (event,index) => {
        setPaymentSplit([...paymentSplit.slice(0,index),Number(event),...paymentSplit.slice(index+1)])
        checkSplitValidity()
    }

    const addTransaction = (event) => {
        let temp = owes
        if(equalSplit){
            for(let i = 0; i < owes.length; i++){
                temp+=currentAmount/4
                }
        }else {
            for(let i = 0; i < owes.length; i++){
                temp+=currentAmount/4
                }
        }
        setOwes(temp)
    }

    const getTotalPaymentSplit = () => {
        let temp = 0
        for(let i = 0; i < paymentSplit.length; i++){
                temp+=paymentSplit[i]
                }
        return temp
    }

    const setSplitEqually = () => {
        let temp = paymentSplit
        console.log("Setting split equally")
        console.log(transactions)
        for(let i = 0; i < paymentSplit.length; i++){
            temp[i] = currentAmount/flatmate.length
        }
        setPaymentSplit(temp)
        console.log(paymentSplit)
    }

    const checkSplitValidity = () => {
        console.log("Checking Split Validity")
        if(equalSplit){
            setSplitIsValid(true)
            submitRef.current.disabled = false
            console.log("Split is equal so true")

        }else{
            if(Number(getTotalPaymentSplit()) === Number(currentAmount)){
                setSplitIsValid(true)
                submitRef.current.disabled = false
                console.log("paymentsplit and currentamount is equal so true")
            }else{
                setSplitIsValid(false)
                submitRef.current.disabled = true
                console.log("Neither is equal so false")
            }
        }
    }

    return (
                <main >
                    <div className = "welcome-section">
                        <h2>Finance</h2>
                        <p>Manage finances with your flatmates</p>
                    </div>
                    <div className="finance-grid">
                        <div className="finance-grid-element">
                            <h2>What your flatmates owe you</h2>
                            <table >
                                <tbody>
                                    {flatmate.map((currentFlatmate,x) => (
                                        <tr key={x}>
                                            <td>
                                                {currentFlatmate.name} owes you ${owes[x]}
                                            </td>
                                            <td>
                                                {owes[x] === 0 ? "" : "for examplecost1"}
                                            </td>
                                        </tr>    
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="finance-grid-element" >
                            <h2>
                                Add Transaction
                            </h2>
                            <div className="add-transaction">
                                <input 
                                    type="number"
                                    placeholder = "Enter Amount" 
                                    onChange={updateCurrentAmount}
                                />
                            </div>
                            <div className="add-transaction">
                                <input 
                                    type="text" 
                                    name = "TransactionComment"
                                    placeholder="Add Comment"
                                    onChange={updateComment}
                                />
                            </div>
                            <div>
                                <p>Who is paying?</p>
                                <input 
                                    type="checkbox" 
                                    name="isEqualSplit" 
                                    id="equalSplitCheck" 
                                    checked = {equalSplit}
                                    onChange={updateEqualSplit}
                                />
                                <label For="isEqualSplit">Everyone</label>
                            </div>
                            
                            {equalSplit ? (
                                <p></p>
                            ) : (
                                <div>
                                    <p>{Number(getTotalPaymentSplit())}/{Number(currentAmount)}</p>
                                    {flatmate.map((currentFlatmate,x) => (
                                        <div className="add-transaction">
                                            <input 
                                                type="number"
                                                id = {"box"+x}
                                                key = {"box"+x}
                                                value = {paymentSplit[x]}
                                                name={x}
                                                onChange={(e) => updatePaymentSplit(e.target.value,x)}
                                            />
                                            <label For={"box"+x}>{currentFlatmate}</label>
                                        </div>
                                    ))}
                                </div> )}
                            <p>Submit</p>
                            <input 
                                type="button" 
                                id = "TansactionSubmitButton" 
                                value="Add Transaction" 
                                ref={submitRef} 
                                onClick={submitTransaction}/>
                        </div>
                    </div>
                </main>
    )
}

export default Finance;
