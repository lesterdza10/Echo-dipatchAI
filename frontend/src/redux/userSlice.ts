import { IuserState } from './types';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Define the initial state using that type
const initialState: IuserState = {
  userData: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<any>) => {
      state.userData = action.payload;
    },
  },
})

export const { setUserData } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type

export default userSlice.reducer