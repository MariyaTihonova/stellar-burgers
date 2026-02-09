import { describe, expect, test } from '@jest/globals';
import store from '../store';

describe('store (rootReducer)', () => {
  test('должен возвращать корректное начальное состояние', () => {
    const initialState = store.getState();
    
    expect(initialState).toEqual({
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null,
      },
      burgerConstructor: {
        bun: null,
        ingredients: [],
      },
      order: {
        order: null,
        isLoading: false,
        error: null,
      },
      user: {
        user: null,
        isLoading: false,
        error: null,
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null,
      },
      profileOrders: {
        orders: [],
        isLoading: false,
        error: null,
      },
      currentIngredient: {
        ingredient: null,
      },
      currentOrder: {
        order: null,
        isLoading: false,
        error: null,
      },
    });
  });
});
