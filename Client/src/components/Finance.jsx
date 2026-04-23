import { useState } from "react";
import { useRef } from "react";
import "./Finance.css";
import { NavLink } from "react-router-dom";


function Finance({ user }) {
    
    const [flatmate,setFlatmates] = useState(["Flatmate1","Flatmate3","Flatmate2","Flatmate4"]);
    const [owes,setOwes] = useState([0,100,100,0])
    const [paymentSplit, setPaymentSplit] = useState([25,25,25,25])
    const [equalSplit, setEqualSplit] = useState(true)
    const [currentAmount, setCurrentAmount] = useState(0)
    const [splitIsValid, setSplitIsValid] = useState(true)
    const submitRef = useRef()

    const updateCurrentAmount = (event) => {
        setCurrentAmount(event.target.value)
        console.log(currentAmount)
    }

    const updateEqualSplit = (event) => {
        setEqualSplit(event.target.checked)
        setSplitEqually()
        checkSplitValidity()
        console.log(equalSplit)
    }

    const updatePaymentSplit = (event,index) => {
        checkSplitValidity()
        setPaymentSplit([...paymentSplit.slice(0,index),Number(event),...paymentSplit.slice(index+1)])
        
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
// setFlatmates(["Flatmate1","Flatmate3","Flatmate2"]);
    return (
                <main className="main-content">
                    <h2>Finance</h2>
                    <div className="finance-content">
                        <div className="finance-element">
                            <h2>What your flatmates owe you</h2>
                            <table >
                                <tbody>
                                    {flatmate.map((currentFlatmate,x) => (
                                        <tr key={x}>
                                            <td>
                                                {currentFlatmate} owes you ${owes[x]}
                                            </td>
                                            <td>
                                                {owes[x] === 0 ? "" : "for examplecost1"}
                                            </td>
                                        </tr>    
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="finance-element">
                            <h2>
                                Add Transaction
                            </h2>
                            <input 
                                type="number"
                                placeholder = "Enter Amount" 
                                onChange={updateCurrentAmount}
                            />
                            <div>
                                <input 
                                    type="text" 
                                    name = "TransactionComment"
                                    placeholder="Add Comment"
                                />
                            </div>
                            <p>Who is paying?</p>
                            <input 
                                type="checkbox" 
                                name="isEqualSplit" 
                                id="equalSplitCheck" 
                                checked = {equalSplit}
                                onChange={updateEqualSplit}
                            />
                            <label For="isEqualSplit">Everyone</label>
                            
                            {equalSplit ? (
                                <p></p>
                            ) : (
                                <div>
                                    <p>{Number(getTotalPaymentSplit())}/{Number(currentAmount)}</p>
                                    {flatmate.map((currentFlatmate,x) => (
                                        <div>
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
                            <input type="button" id = "TansactionSubmitButton" value="Add Transaction" ref={submitRef} onClick={addTransaction}/>
                        </div>
                    </div>
                </main>
    )
}

export default Finance;
