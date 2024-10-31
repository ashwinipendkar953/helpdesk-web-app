import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Create Ticket Thunk
export const createTicket = createAsyncThunk(
  "tickets/createTicket",
  async ({ title, description, customer }, thunkAPI) => {
    try {
      const response = await api.post(
        "/tickets",
        { title, description, customer },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchAllTickets = createAsyncThunk(
  "tickets/all",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/tickets", {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const updateTicketStatus = createAsyncThunk(
  "tickets/updateStatus",
  async ({ ticketId, status }, thunkAPI) => {
    try {
      const response = await api.put(
        `/tickets/${ticketId}/status`,
        { status },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchCustomerAllTickets = createAsyncThunk(
  "ticket/fetchCustomerAllTickets",
  async (customerId, thunkAPI) => {
    try {
      const response = await api.get(`/tickets/customer/${customerId}`, {
        headers: { "Content-Type": "application/json" },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const addTicketNote = createAsyncThunk(
  "ticket/addTicketNote",
  async ({ ticketId, text, addedBy }, thunkAPI) => {
    console.log(ticketId, text, addedBy);
    try {
      const response = await api.post(
        `/tickets/${ticketId}/notes`,
        { text, addedBy },
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  "tickets/ticket",
  async (ticketId, thunkAPI) => {
    try {
      const response = await api.get(`/tickets/${ticketId}`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchTicketNotesById = createAsyncThunk(
  "tickets/ticket/notes",
  async (ticketId, thunkAPI) => {
    try {
      const response = await api.get(`/tickets/${ticketId}/notes`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const ticketSlice = createSlice({
  name: "ticket",
  initialState: {
    ticket: null,
    tickets: [],
    notes: [],
    totalTickets: 0,
    totalCustomers: 0,
    isLoading: false,
    isError: false,
    message: "",
  },
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ticket = action.payload.ticket;
        state.message = action.payload.message;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(fetchAllTickets.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload.tickets;
        state.totalTickets = action.payload.totalTickets;
        state.totalCustomers = action.payload.totalCustomers;
      })
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const updatedTicket = action.payload.ticket;
        const index = state.tickets.findIndex(
          (ticket) => ticket._id === updatedTicket._id
        );
        if (index !== -1) {
          state.tickets[index] = updatedTicket;
        }
        state.message = action.payload.message;
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(fetchCustomerAllTickets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCustomerAllTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchCustomerAllTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.error.message;
      })

      .addCase(fetchTicketById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ticket = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.error.message;
      })

      .addCase(fetchTicketNotesById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTicketNotesById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = action.payload.notes;
      })
      .addCase(fetchTicketNotesById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.error.message;
      })

      .addCase(addTicketNote.fulfilled, (state, action) => {
        state.ticket = action.payload.ticket;
      });
  },
});

export const { resetState } = ticketSlice.actions;

export const ticketReducer = ticketSlice.reducer;
