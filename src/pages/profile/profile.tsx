import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.user);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      const newValues = {
        name: user.name,
        email: user.email,
        password: ''
      };
      setFormValue(newValues);
      setInitialValues(newValues);
    }
  }, [user]);

  // Проверяем, изменились ли поля - возвращаем ТОЛЬКО boolean
  const isFormChanged = Boolean(
    formValue.name !== initialValues.name ||
      formValue.email !== initialValues.email ||
      (formValue.password && formValue.password.trim() !== '')
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Собираем только измененные данные
    const updateData: any = {};

    if (formValue.name !== initialValues.name) {
      updateData.name = formValue.name;
    }

    if (formValue.email !== initialValues.email) {
      updateData.email = formValue.email;
    }

    // Отправляем пароль только если он был введен (не пустая строка)
    if (formValue.password && formValue.password.trim() !== '') {
      updateData.password = formValue.password;
    }

    // Если есть что отправлять
    if (Object.keys(updateData).length > 0) {
      dispatch(updateUser(updateData))
        .unwrap()
        .then(() => {
          // Сбрасываем пароль после успешного обновления
          const updatedValues = {
            name: formValue.name,
            email: formValue.email,
            password: ''
          };
          setFormValue(updatedValues);
          setInitialValues(updatedValues);
        })
        .catch(() => {});
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    // Восстанавливаем исходные значения
    setFormValue({
      name: initialValues.name,
      email: initialValues.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={error || ''}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
