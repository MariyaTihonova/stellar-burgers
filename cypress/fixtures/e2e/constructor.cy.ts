describe('Конструктор бургеров', () => {
  beforeEach(() => {
    // Мокаем запрос за ингредиентами
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Мокаем запрос данных пользователя
    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    // Мокаем запрос создания заказа
    cy.intercept('POST', 'api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов', () => {
    it('должен добавлять булку в конструктор', () => {
      // Находим булку и перетаскиваем в конструктор
      cy.get('[class^=burger-ingredient_ingredient]').first().as('bun');
      
      cy.get('@bun').trigger('dragstart');
      cy.get('[class*=burger-constructor_noBuns]').first().trigger('drop');
      
      // Проверяем, что булка добавилась
      cy.get('[class*=constructor-element]').first().should('contain', 'Краторная булка');
    });

    it('должен добавлять начинку в конструктор', () => {
      // Находим начинку и перетаскиваем в конструктор
      cy.get('[class^=burger-ingredient_ingredient]').eq(1).as('main');
      
      cy.get('@main').trigger('dragstart');
      cy.get('[class*=burger-constructor_noBuns]').last().trigger('drop');
      
      // Проверяем, что начинка добавилась
      cy.get('[class*=constructor-element]').should('contain', 'Говяжий метеорит');
    });
  });

  describe('Модальные окна', () => {
    it('должен открывать модальное окно ингредиента', () => {
      cy.get('[class^=burger-ingredient_ingredient]').first().click();
      
      cy.get('[class*=modal_modal]').should('be.visible');
      cy.get('[class*=modal_modal]').should('contain', 'Краторная булка N-200i');
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      cy.get('[class^=burger-ingredient_ingredient]').first().click();
      cy.get('[class*=modal_button] button').click();
      
      cy.get('[class*=modal_modal]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Устанавливаем токен авторизации в localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('accessToken', 'Bearer test-token');
      });
      
      // Добавляем ингредиенты в конструктор
      cy.get('[class^=burger-ingredient_ingredient]').first().trigger('dragstart');
      cy.get('[class*=burger-constructor_noBuns]').first().trigger('drop');
      
      cy.get('[class^=burger-ingredient_ingredient]').eq(1).trigger('dragstart');
      cy.get('[class*=burger-constructor_noBuns]').last().trigger('drop');
    });

    it('должен создавать заказ и показывать номер', () => {
      cy.get('button').contains('Оформить заказ').click();
      cy.wait('@createOrder');
      
      // Проверяем, что модальное окно открылось с номером заказа
      cy.get('[class*=modal_modal]').should('be.visible');
      cy.get('[class*=order-details_title]').should('contain', '12345');
      
      // Закрываем модальное окно
      cy.get('[class*=modal_button] button').click();
      cy.get('[class*=modal_modal]').should('not.exist');
    });
  });
});
