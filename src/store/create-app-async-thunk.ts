import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { AppThunkConfig } from '../types/state';

export const createAppAsyncThunk = <Returned, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: (
    arg: ThunkArg,
    thunkAPI: Parameters<
      Parameters<typeof createAsyncThunk<Returned, ThunkArg, AppThunkConfig> >[1]
    >[1],
  ) => Promise<Returned>,
) =>
    createAsyncThunk<Returned, ThunkArg, AppThunkConfig>(
      typePrefix,
      async (arg, thunkAPI) => {
        try {
          return await payloadCreator(arg, thunkAPI);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            const data = error.response.data as { message?: string } | undefined;
            return thunkAPI.rejectWithValue({
              status: error.response.status,
              message: data?.message || error.message,
            });
          }
          return thunkAPI.rejectWithValue({
            status: 500,
            message: 'Unknown error',
          });
        }
      },
    );
