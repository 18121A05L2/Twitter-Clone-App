import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  data: [],
  error: false,
};

const dataReducer = createSlice({
  name: "data",
    initialState,
  extraReducers: builder => {
    builder.addCase(fetchData.pending, (state) => {
      state.loading = true;
      state.error = false;
      
    })
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = false;
    })
    builder.addCase(fetchData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    })
  }
});
