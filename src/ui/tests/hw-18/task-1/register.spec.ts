/*
  Разработайте смоук тест-сьют с тестами на REGISTER на странице https://anatoly-karpovich.github.io/demo-login-form/

  Требования:
      Username: обязательное, от 3 до 40 символов включительно, запрещены префиксные/постфиксные пробелы, как и имя состоящее из одних пробелов
      Password: обязательное, от 8 до 20 символов включительно, необходима хотя бы одна буква в верхнем и нижнем регистрах, пароль из одних пробелов запрещен
*/


import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("[UI] [tests] Register", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "https://anatoly-karpovich.github.io/demo-login-form/"
    );
    await page.locator("#registerOnLogin").click();
  });

  test.afterEach(async ({ page }) => {
    await page.reload();
  });

  test("Registration with all valid data", async ({ page }) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const password = faker.internet.password();

    await page.locator("#userNameOnRegister").fill(`${firstName} ${lastName}`);
    await page.locator("#passwordOnRegister").fill(password);
    await page.locator("#register").click();
    await expect(page.locator("#errorMessageOnRegister")).toHaveText("Successfully registered! Please, click Back to return on login page");  });
});
