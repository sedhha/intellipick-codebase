import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { dispatchSignInRequest } from '../apis/userInfoAPIs';

// const unAuthenticatedDevelopment = false;

const initialState = {
  isAuthenticated: false,
  geoData: {},
  userData: {},
  pending: false,
  identityToken: {},
};

export const updateAuthenticated = createAsyncThunk(
  'userInfoSlice/updateAuthenticated',
  async ({ googleData, errorObject }, { getState }) => {
    const geoData = getState().userInfo.geoData;
    const response = await dispatchSignInRequest({
      googleData,
      errorObject,
      geoData,
    });
    return { response, googleData };
  }
);

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    updateAuthentication: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    updateGeoData: (state, action) => {
      state.geoData = action.payload;
    },
    updateSecondGeoData: (state, action) => {
      state.secondGeoData = action.payload;
    },
    logoutUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateAuthenticated.pending, (state) => {
        state.pending = true;
      })
      .addCase(updateAuthenticated.fulfilled, (state, action) => {
        const { googleData } = action.payload;
        const { error } = googleData;

        if (!error) {
          state.userData = googleData.profileObj;
          state.isAuthenticated = true;
          state.identityToken = googleData.tokenObj;
        }
        state.pending = false;
      })
      .addCase(updateAuthenticated.rejected, (state, action) => {
        console.log('Rejected because: ');
        console.log('Action = ', action);
        state.pending = false;
      });
  },
});

export const { updateGeoData, logoutUser } = userSlice.actions;

export const userInfo = (state) => state.userInfo;

export default userSlice.reducer;
