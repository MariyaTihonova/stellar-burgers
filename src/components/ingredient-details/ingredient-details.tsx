import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  // Получаем все ингредиенты из хранилища
  const { ingredients, isLoading } = useSelector((state) => state.ingredients);

  // Находим нужный ингредиент по ID
  const ingredientData = ingredients.find((ing) => ing._id === id);

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h3 className='text text_type_main-large'>Ингредиент не найден</h3>
        <p className='text text_type_main-default mt-10'>
          Попробуйте выбрать другой ингредиент
        </p>
      </div>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
