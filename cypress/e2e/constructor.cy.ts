/// <reference types="cypress" />

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');

    cy.visit('/');
    cy.wait('@getIngredients', { timeout: 20000 });
    cy.get('[data-testid^="ingredient-"]', { timeout: 15000 }).should('have.length.at.least', 2);
  });

  describe('Добавление ингредиентов', () => {
    it('должен добавлять булку в конструктор', () => {
      cy.get('[data-testid="ingredient-bun"]').first()
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.get('[data-testid="constructor-bun-top-filled"]', { timeout: 10000 })
        .should('contain', 'Краторная булка');
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.get('[data-testid="ingredient-main"]').first()
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.get('[data-testid="constructor-element"]', { timeout: 10000 })
        .should('contain', 'Говяжий метеорит');
    });
  });

  describe('Модальные окна', () => {
    it('должен открывать модальное окно ингредиента', () => {
      cy.get('[data-testid="ingredient-bun"]').first().click({ force: true });

      cy.get('[data-testid="modal"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain', 'Краторная булка N-200i');
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      cy.get('[data-testid="ingredient-bun"]').first().click({ force: true });

      cy.get('[data-testid="modal-close"]', { timeout: 10000 })
        .click({ force: true });

      cy.url().should('eq', 'http://localhost:4000/');
      cy.get('[data-testid="modal"]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
  beforeEach(() => {
    cy.setCookie('accessToken', 'Bearer test-access-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    // Перезагружаем страницу, чтобы применились токены
    cy.reload();
    cy.wait('@getIngredients', { timeout: 20000 });
    cy.get('[data-testid^="ingredient-"]', { timeout: 15000 }).should('have.length.at.least', 2);

    // Ждём появления имени пользователя в шапке
    cy.contains('Test User', { timeout: 15000 }).should('be.visible');

    // Добавляем булку
    cy.get('[data-testid="ingredient-bun"]').first()
      .closest('li')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    cy.get('[data-testid="constructor-bun-top-filled"]', { timeout: 10000 })
      .should('contain', 'Краторная булка');

    // Добавляем начинку
    cy.get('[data-testid="ingredient-main"]').first()
      .closest('li')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    cy.get('[data-testid="constructor-element"]', { timeout: 10000 })
      .should('have.length.at.least', 1);

    cy.wait(500);
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then((win) => win.localStorage.removeItem('refreshToken'));
  });

  it('должен создавать заказ, показывать номер и очищать конструктор', () => {
    cy.get('button').contains('Оформить заказ')
      .should('be.visible')
      .and('not.be.disabled')
      .click({ force: true });

    cy.wait('@createOrder', { timeout: 20000 });

    cy.get('[data-testid="modal"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="order-number"]').should('contain', '12345');

    cy.get('[data-testid="modal-close"]').click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');

    // Проверяем очистку конструктора
    cy.get('[data-testid="constructor-bun-top"]').should('contain', 'Выберите булки');
    cy.get('[data-testid="constructor-main"]').should('contain', 'Выберите начинку');
  });
});
});
