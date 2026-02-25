export const getIngredientsApi = jest.fn(() =>
  Promise.resolve([
    {
      _id: '60666c42cc7b410027a1a9b1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      __v: 0,
    },
  ])
);

export const orderBurgerApi = jest.fn(() =>
  Promise.resolve({
    success: true,
    name: 'Space бургер',
    order: {
      number: 12345,
    },
  })
);

export const loginUserApi = jest.fn(() =>
  Promise.resolve({
    success: true,
    user: { email: 'test@example.com', name: 'Test User' },
    accessToken: 'Bearer test-token',
    refreshToken: 'test-refresh-token',
  })
);

export const registerUserApi = jest.fn(() =>
  Promise.resolve({
    success: true,
    user: { email: 'test@example.com', name: 'Test User' },
    accessToken: 'Bearer test-token',
    refreshToken: 'test-refresh-token',
  })
);

export const logoutApi = jest.fn(() => Promise.resolve({ success: true }));

export const getUserApi = jest.fn(() =>
  Promise.resolve({
    success: true,
    user: { email: 'test@example.com', name: 'Test User' },
  })
);

export const updateUserApi = jest.fn(() =>
  Promise.resolve({
    success: true,
    user: { email: 'test@example.com', name: 'Test User' },
  })
);

export const forgotPasswordApi = jest.fn(() =>
  Promise.resolve({ success: true })
);

export const resetPasswordApi = jest.fn(() =>
  Promise.resolve({ success: true })
);

export const getFeedsApi = jest.fn(() =>
  Promise.resolve({
    success: true,
    orders: [],
    total: 0,
    totalToday: 0,
  })
);

export const getOrdersApi = jest.fn(() =>
  Promise.resolve([])
);

export const getOrderByNumberApi = jest.fn(() =>
  Promise.resolve({
    success: true,
    orders: [
      {
        _id: '12345',
        ingredients: [],
        status: 'done',
        name: 'Test Order',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        number: 12345,
      },
    ],
  })
);
