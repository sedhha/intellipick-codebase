import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { triggerUIPath } from '../apis/uipathTrigger';

const initialState = {
  isLoading: false,
  causedError: false,
  dataFetched: false,
  data: [],
  programmingData: [],
  genericDataActive: true,
};

export const dispatchUIPathAction = createAsyncThunk(
  'dataSlice/dispatchUIPathAction',
  async ({ allResponses, alertPopupFunction, weights }) => {
    const response = await triggerUIPath({ allResponses, weights });
    return { response, alertPopupFunction };
  }
);

export const dataSlice = createSlice({
  name: 'dataSlice',
  initialState,
  reducers: {
    setLoadingStatus: (state, action) => {
      state.isLoading = action.payload;
    },
    resetTable: (state) => {
      state.dataFetched = false;
      state.data = [];
    },
    updateGenericActivity: (state, action) => {
      state.genericDataActive = action.payload;
    },
    performOperationsViaSocket: (state, action) => {
      const { response, alertPopupFunction } = action.payload;
      const { error } = response;
      if (error) {
        state.causedError = true;
        alertPopupFunction(response.msg);
      } else {
        const { as_data } = response;
        state.dataFetched = true;
        state.data = as_data.payload.sheetObjects;
      }
      state.isLoading = false;
    },
    beginSocketReq: (state) => {
      state.isLoading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(dispatchUIPathAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(dispatchUIPathAction.fulfilled, (state, action) => {
        const { response, alertPopupFunction } = action.payload;
        if (response.error) {
          state.causedError = true;
          alertPopupFunction(response.msg);
        } else {
          const { as_data, programming_data } = response;
          state.dataFetched = true;
          state.data = as_data.payload.sheetObjects;
          state.programmingData = programming_data.payload.sheetObjects;
        }
        state.isLoading = false;
      })
      .addCase(dispatchUIPathAction.rejected, (state, action) => {
        console.log('Caused Error', action.payload);
        state.causedError = true;
        state.isLoading = false;
      });
  },
});

export const {
  setLoadingStatus,
  resetTable,
  performOperationsViaSocket,
  beginSocketReq,
  updateGenericActivity,
} = dataSlice.actions;

export const scrappedData = (state) => state.scrappedData;

export default dataSlice.reducer;
