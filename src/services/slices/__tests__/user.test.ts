import { describe, expect, test } from '@jest/globals';
import {
  userReducer,
  registerUser,
  loginUser,
  logoutUser,
  checkUserAuth,
  updateUser,
  clearError
} from '../userSlice';

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

const mockUser = {
  email: 'test@example.com',
  name: 'Test User',
};

describe('user reducer', () => {
  test('должен устанавливать isLoading в true при запросе регистрации', () => {
    const action = { type: registerUser.pending.type };
    const state = userReducer(initialState, action);
    
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен записывать пользователя и устанавливать isLoading в false при успешной регистрации', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: mockUser
    };
    const state = userReducer(
      { ...initialState, isLoading: true },
      action
    );
    
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeNull();
  });

  test('должен записывать ошибку при ошибке регистрации', () => {
    const errorMessage = 'Ошибка регистрации';
    const action = {
      type: registerUser.rejected.type,
      error: { message: errorMessage }
    };
    const state = userReducer(
      { ...initialState, isLoading: true },
      action
    );
    
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.user).toBeNull();
  });

  test('должен очищать ошибку', () => {
    const stateWithError = {
      user: null,
      isLoading: false,
      error: 'Ошибка',
    };
    
    const action = clearError();
    const state = userReducer(stateWithError, action);
    
    expect(state.error).toBeNull();
  });

  test('должен очищать пользователя при выходе', () => {
    const stateWithUser = {
      user: mockUser,
      isLoading: false,
      error: null,
    };
    
    const action = { type: logoutUser.fulfilled.type };
    const state = userReducer(stateWithUser, action);
    
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});
