import "./Timetable.css";
import { useState, useEffect } from "react";

function Timetable() {

    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);
    const [events, setEvents] = useState([]);
    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [duration, setDuration] = useState(1);
    const [editingEvent, setEditingEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const currentFlat = JSON.parse(localStorage.getItem("currentFlat"));
    const user = JSON.parse(localStorage.getItem("user"));

    const hours = Array.from({ length: 18 }, (_, i) => i + 7);
      useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${API}/api/flats/${currentFlat.id}/timetable`);
                const data = await res.json();
                setEvents(data.events);
                console.log("Fetched events:", data.events.id);
            } catch (err) {
                console.error(err);
            }
        };

        if (currentFlat?.id) {
            fetchEvents();
        }
    }, [API, currentFlat?.id]);
    const getEventForCell = (hour, day) => {
        return events.find(
            (event) => event.hour === hour && event.day === day
        );
    };
    const closeEventModal = () => {
        setEventName("");
        setEventDescription("");
        setDuration(1);
        setShowEventModal(false);
    };

    const addtimetableCell = async (hour, day) => {
        setSelectedCell({ hour, day });
        console.log(`${hour} ${day} was clicked`);
        setEditingEvent(null);
        setIsEditing(false);
        setShowEventModal(true);
        //fetch timetable data for flat and user
        //if there is a task at this hour and day, return a cell with the task name
        //otherwise return an empty cell

    }

    const saveEvent = () => {
        if (!eventName.trim()) return;

        if (isEditing) {
            const res = fetch(`${API}/api/flats/${currentFlat.id}/timetable/${editingEvent.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    hour: selectedCell.hour,
                    day: selectedCell.day,
                    duration,
                    name: eventName,
                    description: eventDescription
                })
            });
            setEvents((prev) =>
                prev.map((event) =>
                    event.id === editingEvent.id
                        ? {
                            ...event,
                            name: eventName,
                            description: eventDescription,
                            duration,
                        }
                        : event
                )
            );
        } else {
            const newEvent = {
                id: Date.now(),
                hour: selectedCell.hour,
                day: selectedCell.day,
                duration,
                name: eventName,
                description: eventDescription,
            };
            const res = fetch(`${API}/api/flats/${currentFlat.id}/timetable`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newEvent)
            });
            setEvents((prev) => [...prev, newEvent]);
        }
        setEventName("");
        setEventDescription("");
        setDuration(1);
        setShowEventModal(false);
    };

    const deleteEvent = async () => {
        if (!editingEvent) return;
        console.log(`Deleting event with id ${editingEvent.id}`);
        const res = await fetch(`${API}/api/flats/${currentFlat.id}/timetable/${editingEvent.id}`, {
            method: "DELETE",
        }); 
        if (!res.ok) {
            console.error("Failed to delete event");
            return;
        }
        setEvents((prev) =>
            prev.filter((event) => event.id !== editingEvent.id)
        );

        setShowEventModal(false);
    };
    const openEditEvent = (event) => {
        setSelectedCell({
            hour: event.hour,
            day: event.day,
        });

        setEventName(event.name);
        setEventDescription(event.description);
        setDuration(event.duration);

        setEditingEvent(event);
        setIsEditing(true);

        setShowEventModal(true);
    };

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    const eventsOverlap = (a, b) => {
        const aEnd = a.hour + a.duration;
        const bEnd = b.hour + b.duration;
        return a.hour < bEnd && b.hour < aEnd;
    };
    const processedEvents = events.map((event) => {
        const overlapping = events.filter(
            (e) =>
                e.day === event.day &&
                eventsOverlap(event, e)
        );

        const index = overlapping.findIndex(
            (e) => e.id === event.id
        );

        return {
            ...event,
            overlapCount: overlapping.length,
            overlapIndex: index,
        };
    });


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
                            <div
                                className="cell"
                                onClick={() => addtimetableCell(hour, "Monday")}
                            >
                            </div>
                            <div className="cell" onClick={() => addtimetableCell(hour, "Tuesday")}>

                            </div>
                            <div className="cell" onClick={() => addtimetableCell(hour, "Wednesday")}>

                            </div>
                            <div className="cell" onClick={() => addtimetableCell(hour, "Thursday")}>

                            </div>
                            <div className="cell" onClick={() => addtimetableCell(hour, "Friday")}>

                            </div>
                            <div className="cell" onClick={() => addtimetableCell(hour, "Saturday")}>

                            </div>
                            <div className="cell" onClick={() => addtimetableCell(hour, "Sunday")}>

                            </div>
                        </>
                    ))}
                    <div className="events-layer">
                        {processedEvents.map((event) => {
                            const dayIndex = days.indexOf(event.day);

                            return (
                                <div
                                    key={event.id}
                                    className="event-block" onClick={() => openEditEvent(event)}
                                    style={{
                                        gridColumn: dayIndex + 2,
                                        gridRow: `${event.hour - 5} / span ${event.duration}`,

                                        width: `calc((100% - ${(event.overlapCount - 1) * 6
                                            }px) / ${event.overlapCount})`,

                                        marginLeft: `calc(
                        (${100 / event.overlapCount}%)
                        * ${event.overlapIndex}
                    )`,
                                    }}
                                >
                                    <strong>{event.name}</strong>
                                    <small>{event.duration} hr</small>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {showEventModal && (
                <div className="modal-overlay" onClick={closeEventModal}>
                    <div
                        className="event-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3>{isEditing ? "Edit Event" : "Add Event"}</h3>
                            <button className="close-modal-btn" onClick={closeEventModal}>
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="event-name">Event Name</label>
                                    <input type="text" id="event-name" placeholder="Enter event name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="event-description">Description</label>
                                    <textarea id="event-description" placeholder="Enter event description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)}></textarea>
                                </div>
                                <button type="button" onClick={saveEvent}  className="save-event-btn" >
                                    {isEditing ? "Update Event" : "Save Event"}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={deleteEvent}
                                        className="delete-event-btn"
                                    >
                                        Remove Event
                                    </button>
                                )}
                                <div className="form-group">
                                    <label htmlFor="duration">Duration (hours)</label>
                                    <input
                                        type="number" id="duration" min="1" max="12" value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Timetable;