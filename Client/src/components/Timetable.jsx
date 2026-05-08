import "./Timetable.css";
import { useState, useEffect } from "react";

function Timetable() {

    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const currentFlat = JSON.parse(localStorage.getItem("currentFlat"));
    const user = JSON.parse(localStorage.getItem("user"));

    const hours = Array.from({ length: 18 }, (_, i) => i + 7);
    return (
        <div className="timetable-container">
            <h2>{currentFlat?.name}'s Timetable</h2>
            <div className="timetable">
                <div className="timetable-grid">
    {/* Header */}
    <div className="cell header time">Time</div>
    <div className="cell header">Monday</div>
    <div className="cell header">Tuesday</div>
    <div className="cell header">Wednesday</div>
    <div className="cell header">Thursday</div>
    <div className="cell header">Friday</div>
    <div className="cell header">Saturday</div>
    <div className="cell header">Sunday</div>

    {/* Rows */}
    {hours.map((hour) => (
        <>
            <div className="cell time-col">{hour}:00</div>
            <div className="cell"></div>
            <div className="cell"></div>
            <div className="cell"></div>
            <div className="cell"></div>
            <div className="cell"></div>
            <div className="cell"></div>
            <div className="cell"></div>
        </>
    ))}
</div>
            </div>
        </div>
    );
}

export default Timetable;