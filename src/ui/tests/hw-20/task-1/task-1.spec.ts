/*
Создать тест сьют используя DDT подход с негативными тест-кейсами по регистрации на сайте
https://anatoly-karpovich.github.io/demo-login-form/

Требования:
Страница регистрации:
  Username: обязательное, от 3 до 40 символов включительно, запрещены префиксные/постфиксные пробелы, как и имя состоящее из одних пробелов
  Password: обязательное, от 8 до 20 символов включительно, необходима хотя бы одна буква в верхнем и нижнем регистрах, пароль из одних пробелов запрещен

Страница логина:
  Username: обязательное
  Password: обязательное
*/

/*

import { test, expect } from "@playwright/test";

test.describe("[UI] [tests] e2e", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "https://anatoly-karpovich.github.io/aqa-course-project/#"
    );
  });

  test.afterEach(async ({ page }) => {
    await page.reload();
  });

  test("Check user state", async ({ page }) => {
    const emailAddress = "test@gmail.com";
    const password = "12345678";
    const spinnerSelector = page.locator(".spinner-border");

    await page.locator("#emailinput").fill(emailAddress);
    await page.locator("#passwordinput").fill(password);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByRole("heading", { name: "Welcome to Sales Management Portal" })).toBeVisible();
    await expect(spinnerSelector).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Anatoly" })).toBeVisible();
    await expect(page.locator("#sidebar")).toHaveScreenshot("sidebar-after-login.png");
   });
});
*/


import { test, expect } from '@playwright/test';

// Набор тестовых данных: username, password и описание ошибки
const negativeRegistrationData = [
  {
    username: '',
    password: 'ValidPass123',
    errorDescription: 'Username is required',
  },
  {
    username: 'ab',
    password: 'ValidPass123',
    errorDescription: 'Username should contain at least 3 characters',
  },
  {
    username: '   ',
    password: 'ValidPass123',
    errorDescription: 'Prefix and postfix spaces are not allowed is username',
  },
  {
    username: 'validUsername',
    password: '',
    errorDescription: 'Password is required',
  },
  {
    username: 'validUsername',
    password: 'short',
    errorDescription: 'Password should contain at least 8 characters',
  },
  {
    username: 'validUsername',
    password: '        ',
    errorDescription: 'Password is required',
  },
  {
    username: 'validUsername',
    password: 'onlylowercase',
    errorDescription: 'Password must contain at least one uppercase letter',
  },
  {
    username: 'validUsername',
    password: 'ONLYUPPERCASE',
    errorDescription: 'Password should contain at least one character in lower case',
  },
];

// Используем DDT - перебираем все варианты данных
test.describe('Negative Registration Tests (DDT)', () => {
  for (const data of negativeRegistrationData) {
    test(`should show error when username="${data.username}" and password="${data.password}"`, async ({ page }) => {
      // Шаг 1. Открыть страницу регистрации
      await page.goto('https://anatoly-karpovich.github.io/demo-login-form/');

      // Шаг 2. Переключиться на вкладку "Register"
      await page.locator("#registerOnLogin").click();

      // Шаг 3. Заполнить поля username и password
      await page.locator("#userNameOnRegister").fill(data.username);
      await page.locator("#passwordOnRegister").fill(data.password);

      // Шаг 4. Нажать кнопку "Submit"
      await page.getByRole('button', { name: 'register' }).click();

      // Шаг 5. Проверить, что появилось сообщение об ошибке
      const errorLocator = page.locator('#errorMessageOnRegister'); 
      await expect(errorLocator).toHaveText(data.errorDescription); 
    });
  }
});
