/// <reference types="cypress" />

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');

    cy.visit('/');
    cy.wait('@getIngredients', { timeout: 20000 });

    // Ждём загрузки ингредиентов на странице
    cy.get('[data-testid^="ingredient-"]', { timeout: 15000 }).should('have.length.at.least', 2);
  });

  describe('Добавление ингредиентов', () => {
    it('должен добавлять булку в конструктор', () => {
      cy.get('[data-testid="ingredient-bun"]').first().as('bun');

      const dataTransfer = new DataTransfer();

      // Имитация полного цикла drag & drop
      cy.get('@bun').trigger('dragstart', { dataTransfer });
      cy.get('[data-testid="constructor-bun-top"]')
        .trigger('dragenter', { dataTransfer })
        .trigger('dragover', { dataTransfer })
        .trigger('drop', { dataTransfer })
        .trigger('dragend', { dataTransfer });

      // Проверяем, что элемент конструктора появился
      cy.get('[class*=constructor-element]', { timeout: 10000 })
        .first()
        .should('contain', 'Краторная булка');
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.get('[data-testid="ingredient-main"]').first().as('main');

      const dataTransfer = new DataTransfer();

      cy.get('@main').trigger('dragstart', { dataTransfer });
      cy.get('[data-testid="constructor-main"]')
        .trigger('dragenter', { dataTransfer })
        .trigger('dragover', { dataTransfer })
        .trigger('drop', { dataTransfer })
        .trigger('dragend', { dataTransfer });

      cy.get('[class*=constructor-element]', { timeout: 10000 })
        .should('contain', 'Говяжий метеорит');
    });
  });

  describe('Модальные окна', () => {
    it('должен открывать модальное окно ингредиента', () => {
      cy.get('[data-testid="ingredient-bun"]').first().click();

      cy.get('[class*=modal_modal]', { timeout: 10000 })
        .should('be.visible')
        .and('contain', 'Краторная булка N-200i');
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      cy.get('[data-testid="ingredient-bun"]').first().click();

      cy.get('[class*=modal_button] button', { timeout: 10000 })
        .click({ force: true });

      cy.get('[class*=modal_modal]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // AccessToken в cookies
      cy.setCookie('accessToken', 'Bearer test-access-token');
      // RefreshToken в localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      });

      // Добавляем булку
      const dt1 = new DataTransfer();
      cy.get('[data-testid="ingredient-bun"]').first()
        .trigger('dragstart', { dataTransfer: dt1 });
      cy.get('[data-testid="constructor-bun-top"]')
        .trigger('dragenter', { dataTransfer: dt1 })
        .trigger('dragover', { dataTransfer: dt1 })
        .trigger('drop', { dataTransfer: dt1 })
        .trigger('dragend', { dataTransfer: dt1 });

      // Добавляем начинку
      const dt2 = new DataTransfer();
      cy.get('[data-testid="ingredient-main"]').first()
        .trigger('dragstart', { dataTransfer: dt2 });
      cy.get('[data-testid="constructor-main"]')
        .trigger('dragenter', { dataTransfer: dt2 })
        .trigger('dragover', { dataTransfer: dt2 })
        .trigger('drop', { dataTransfer: dt2 })
        .trigger('dragend', { dataTransfer: dt2 });

      // Убедимся, что конструктор не пустой
      cy.get('[class*=constructor-element]', { timeout: 10000 })
        .should('have.length.at.least', 2); // булка + начинка
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      cy.window().then((win) => win.localStorage.removeItem('refreshToken'));
    });

    it('должен создавать заказ, показывать номер и очищать конструктор', () => {
      // Кнопка должна быть активна
      cy.get('button').contains('Оформить заказ')
        .should('be.visible')
        .and('not.be.disabled')
        .click();

      cy.wait('@createOrder', { timeout: 20000 });

      cy.get('[class*=modal_modal]', { timeout: 10000 }).should('be.visible');
      cy.get('[class*=order-details_title]').should('contain', '12345');

      cy.get('[class*=modal_button] button').click({ force: true });
      cy.get('[class*=modal_modal]').should('not.exist');

      // Проверяем очистку конструктора
      cy.get('[data-testid="constructor-bun-top"]').should('contain', 'Выберите булки');
      cy.get('[data-testid="constructor-main"]').should('contain', 'Выберите начинку');
    });
  });
});
