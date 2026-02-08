import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload;
    },

    updateAnecdoteInStore(state, action) {
      const updatedAnecdote = action.payload;

      const updatedState = state.map((anecdote) =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      );

      return [...updatedState].sort(
        (a1, a2) => a2.votes - a1.votes
      );
    },

    createNewAnecdote(state, action) {
      const newAnecdote = action.payload;
      const updatedState = [...state, newAnecdote];

      return [...updatedState].sort(
        (a1, a2) => a2.votes - a1.votes
      );
    },
  },
});

export const {
  setAnecdotes,
  updateAnecdoteInStore,
  createNewAnecdote,
} = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();

    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.create(content);
    dispatch(createNewAnecdote(newAnecdote));
  };
};

export const voteAnecdote = (id) => {
  return async (dispatch, getState) => {
    const currentState = getState().anecdotes;

    const anecdoteToVote = currentState.find(
      (anecdote) => anecdote.id === id
    );

    const updatedAnecdote = {
      ...anecdoteToVote,
      votes: anecdoteToVote.votes + 1,
    };

    const result = await anecdoteService.update(id, updatedAnecdote);

    dispatch(updateAnecdoteInStore(result));
  };
};

export default anecdoteSlice.reducer;
