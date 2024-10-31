import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchTicketById,
  addTicketNote,
  fetchTicketNotesById,
} from "../features/ticket/ticketSlice";

const TicketReplies = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [noteText, setNoteText] = useState("");
  const { ticket } = useSelector((state) => state.ticket);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchTicketById(id));
    dispatch(fetchTicketNotesById(id));
  }, [dispatch, id]);

  const handleAddNote = () => {
    if (noteText.trim()) {
      const newNote = {
        ticketId: id,
        text: noteText,
        addedBy: user?._id,
      };

      dispatch(addTicketNote(newNote));
      window.location.reload();

      setNoteText("");
    }
  };

  return (
    <div className="container-fluid px-5 my-4">
      {/* Ticket Details Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{ticket?.title}</h5>
          <p className="card-text text-capitalize">
            <strong>Status:</strong> {ticket?.status}
          </p>
          <p className="card-text">
            <strong>Last Updated:</strong>{" "}
            {new Date(ticket?.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h2 className="mb-3">Ticket Replies</h2>

      {/* Replies Container */}
      <div className="replies-container mb-4">
        {ticket?.notes?.map((note, index) => {
          const isUser = note?.addedBy === user?._id;
          return (
            <div
              key={index}
              className={`d-flex ${isUser ? "justify-content-end" : ""}`}
            >
              <div
                className={`p-2 px-4 rounded-pill ${
                  isUser ? "bg-primary text-white" : "bg-light text-dark"
                } mb-2`}
              >
                <p className="mb-0">{note.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input for Adding Notes */}
      <div className="input-group mt-auto">
        <input
          type="text"
          className="form-control"
          placeholder="Type your reply..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddNote}>
          Send
        </button>
      </div>
    </div>
  );
};

export default TicketReplies;
