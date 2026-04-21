import { useState } from "react";
import "./Finance.css";
import { NavLink } from "react-router-dom";


function Finance({ user }) {
    
    const [flatmate,setFlatmates] = useState(["Flatmate1","Flatmate3","Flatmate2","Flatmate4"]);
    const [owes,setOwes] = useState([0,100,100,0])
    const [paymentSplit, setPaymentSplit] = useState([25,25,25,25])
    const [equalSplit, setEqualSplit] = useState(true)
    const [currentAmount, setCurrentAmount] = useState(0)

    const updateCurrentAmount = (event) => {
        setCurrentAmount(event.target.value)
        console.log(currentAmount)
    }

    const updateEqualSplit = (event) => {
        setEqualSplit(event.target.checked)
        console.log(equalSplit)
    }

    const updatePaymentSplit = (event,index) => {
        setPaymentSplit([...paymentSplit.slice(0,index),Number(event),...paymentSplit.slice(index+1)])
    }

    const addTransaction = (event) => {
        let temp = owes
        for(let i = 0; i < owes.length; i++){
            temp+=currentAmount/4
            }
        setOwes(temp)
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
                                                {owes[x] === 0 ? "" : "for examplecost"}
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
                                placeholder = "Enter amount" 
                                onChange={setCurrentAmount}
                            />
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
                            <input type="button" value="Add Transaction" onClick={addTransaction}/>
                        </div>
                    </div>
                </main>
    )
}

export default Finance;
