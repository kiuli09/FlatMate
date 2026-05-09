import "./Timetable.css";
import { useState, useEffect } from "react";

function Timetable() {

    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);
    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const currentFlat = JSON.parse(localStorage.getItem("currentFlat"));
    const user = JSON.parse(localStorage.getItem("user"));

    const hours = Array.from({ length: 18 }, (_, i) => i + 7);

    
    const closeEventModal = () => {
        setShowEventModal(false);
    };

    const addtimetableCell = async (hour, day) => {
        setSelectedCell({ hour, day });
        console.log(`${hour} ${day} was clicked`);
        setShowEventModal(true);
        //fetch timetable data for flat and user
        //if there is a task at this hour and day, return a cell with the task name
        //otherwise return an empty cell
        
    }

    const saveEvent = async (hour,day) => {
        console.log("SAving event for hour: ", hour, "day: ", day);
        setShowEventModal(false);
    }

    return (
        <div className="timetable-container">
            <h2>{currentFlat?.name}'s Timetable</h2>
            <div className="timetable">
                <div className="timetable-grid">
                    <div className="cell header time">Time</div>
                    <div className="cell header">Monday</div>
                    <div className="cell header">Tuesday</div>
                    <div className="cell header">Wednesday</div>
                    <div className="cell header">Thursday</div>
                    <div className="cell header">Friday</div>
                    <div className="cell header">Saturday</div>
                    <div className="cell header">Sunday</div>

                    {hours.map((hour) => (
                        <>
                            <div className="cell time-col">{hour}:00</div>
                            <div className="cell" onClick={() => addtimetableCell(hour, "Monday")}></div>
                            <div className="cell" onClick={() => addtimetableCell(hour, "Tuesday")}></div>
                            <div className="cell" onClick={() => addtimetableCell(hour, "Wednesday")}></div>
                            <div className="cell" onClick={() => addtimetableCell(hour, "Thursday")}></div>
                            <div className="cell" onClick={() => addtimetableCell(hour, "Friday")}></div>
                            <div className="cell" onClick={() => addtimetableCell(hour, "Saturday")}></div>
                            <div className="cell" onClick={() => addtimetableCell(hour, "Sunday")}></div>
                        </>
                    ))}
                </div>
            </div>
            {showEventModal && (
                <div className="modal-overlay" onClick={closeEventModal}>
                    <div
                        className="event-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3>Add Event</h3>
                            <button className="close-modal-btn" onClick={closeEventModal}>
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="event-name">Event Name</label>
                                    <input type="text" id="event-name" placeholder="Enter event name" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="event-description">Description</label>
                                    <textarea id="event-description" placeholder="Enter event description"></textarea>
                                </div>
                                <button onClick={() => saveEvent(selectedCell.hour, selectedCell.day)} className="save-event-btn">
                                    Save Event
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Timetable;