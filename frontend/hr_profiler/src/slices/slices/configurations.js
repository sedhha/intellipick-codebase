import { createSlice } from '@reduxjs/toolkit';
// import { dispatchSignInRequest } from '../apis/userInfoAPIs';
import {
  profileSelections,
  weights,
  zeroWeighted,
} from '../constants/availableSelections';
import { updateTypes } from '../constants/configUpdateTypes';
const initialState = {
  profileSelections,
  weights,
  showEditBar: { show: false, index: 0 },
};

export const configSlice = createSlice({
  name: 'configSlice',
  initialState,
  reducers: {
    updateSelection: (state, action) => {
      const { index, newValue } = action.payload;
      state.profileSelections[index].isActive = newValue;
      if (newValue === false) {
        state.weights[state.profileSelections[index].displayKeyHint] = {
          ...zeroWeighted[state.profileSelections[index].displayKeyHint],
        };
      } else {
        state.weights[state.profileSelections[index].displayKeyHint] = {
          ...weights[state.profileSelections[index].displayKeyHint],
        };
      }
    },
    updateEditMode: (state, action) => {
      const { modeIndex, value } = action.payload;
      state.showEditBar.show = value;
      state.showEditBar.index = modeIndex;
    },
    updateDevpostVariables: (state, action) => {
      const { index, updateType, value } = action.payload;
      switch (updateType) {
        case updateTypes.Devpost.UPDATE_SKILLS: {
          state.profileSelections[index].value.skills = value;
          break;
        }
        case updateTypes.Devpost.UPDATE_INTERESTS: {
          state.profileSelections[index].value.interests = value;
          break;
        }
        default: {
        }
      }
    },
    updateWeights: (state, action) => {
      const { primaryKey, secondaryKey, value } = action.payload;
      state.weights[primaryKey][secondaryKey] = value;
    },
  },

  extraReducers: () => {},
});

export const {
  updateSelection,
  updateEditMode,
  updateDevpostVariables,
  updateWeights,
} = configSlice.actions;

export const configData = (state) => state.config;

export default configSlice.reducer;
