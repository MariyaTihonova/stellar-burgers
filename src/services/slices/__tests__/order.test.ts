import { describe, expect, test } from '@jest/globals';
import { orderReducer, createOrder, clearOrder } from '../orderSlice';

const initialState = {
  order: null,
  isLoading: false,
  error: null,
};

const mockOrder = {
  _id: '12345',
  ingredients: ['60666c42cc7b410027a1a9b1', '60666c42cc7b410027a1a9b5'],
  status: 'done',
  name: 'Space бургер',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345
};

describe('order reducer', () => {
  test('должен устанавливать isLoading в true при создании заказа', () => {
    const action = { type: createOrder.pending.type };
    const state = orderReducer(initialState, action);
    
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен записывать заказ и устанавливать isLoading в false при успехе', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    };
    const state = orderReducer(
      { ...initialState, isLoading: true },
      action
    );
    
    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  test('должен записывать ошибку и устанавливать isLoading в false при ошибке', () => {
    const errorMessage = 'Ошибка создания заказа';
    const action = {
      type: createOrder.rejected.type,
      error: { message: errorMessage }
    };
    const state = orderReducer(
      { ...initialState, isLoading: true },
      action
    );
    
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.order).toBeNull();
  });

  test('должен очищать заказ', () => {
    const stateWithOrder = {
      order: mockOrder,
      isLoading: false,
      error: null,
    };
    
    const action = clearOrder();
    const state = orderReducer(stateWithOrder, action);
    
    expect(state.order).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});
