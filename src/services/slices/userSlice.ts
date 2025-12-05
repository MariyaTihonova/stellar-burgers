import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';

interface UserState {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null
};

// Валидация пароля по требованиям API
const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return 'Пароль должен содержать не менее 6 символов';
  }
  if (!/\d/.test(password)) {
    return 'Пароль должен содержать хотя бы одну цифру';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Пароль должен содержать хотя бы одну заглавную букву';
  }
  return null;
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      // Валидация пароля
      const passwordError = validatePassword(data.password);
      if (passwordError) {
        return rejectWithValue(passwordError);
      }

      const response = await registerUserApi(data);

      if (!response.success) {
        return rejectWithValue('Ошибка регистрации');
      }

      // Сохраняем токены
      const token = response.accessToken;
      if (token && token.startsWith('Bearer ')) {
        setCookie('accessToken', token.split('Bearer ')[1]);
      } else if (token) {
        setCookie('accessToken', token);
      }

      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      return response.user;
    } catch (error: any) {
      // Обрабатываем ошибки API
      if (error.message && error.message.includes('User already exists')) {
        return rejectWithValue('Пользователь с таким email уже существует');
      }
      if (
        error.message &&
        error.message.includes('Email, password and name are required fields')
      ) {
        return rejectWithValue('Все поля обязательны для заполнения');
      }
      if (error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Ошибка при регистрации');
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);

      if (!response.success) {
        return rejectWithValue('Ошибка входа');
      }

      // Сохраняем токены
      const token = response.accessToken;
      if (token && token.startsWith('Bearer ')) {
        setCookie('accessToken', token.split('Bearer ')[1]);
      } else if (token) {
        setCookie('accessToken', token);
      }

      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      return response.user;
    } catch (error: any) {
      if (
        error.message &&
        error.message.includes('email or password are incorrect')
      ) {
        return rejectWithValue('Неверный email или пароль');
      }
      if (error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Ошибка при входе');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    } catch (error: any) {
      // Даже при ошибке логаута очищаем токены на клиенте
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      if (error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Ошибка при выходе');
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        throw new Error('Токен не найден');
      }
      const response = await getUserApi();
      return response.user;
    } catch (error: any) {
      if (error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Ошибка проверки авторизации');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      // Валидация пароля при обновлении (если пароль передается)
      if (data.password && data.password.length > 0) {
        const passwordError = validatePassword(data.password);
        if (passwordError) {
          return rejectWithValue(passwordError);
        }
      }

      const response = await updateUserApi(data);
      return response.user;
    } catch (error: any) {
      if (error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Ошибка при обновлении данных');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Регистрация
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка регистрации';
      })

      // Вход
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка входа';
      })

      // Выход
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null; // Все равно очищаем пользователя
        state.error = (action.payload as string) || 'Ошибка при выходе';
      })

      // Проверка авторизации
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error =
          (action.payload as string) || 'Ошибка проверки авторизации';
      })

      // Обновление данных
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Ошибка при обновлении данных';
      });
  }
});

export const { clearError, setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
