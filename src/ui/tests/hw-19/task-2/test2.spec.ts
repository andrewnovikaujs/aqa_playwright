/*
Разработать тест со следующими шагами:
 - Открыть url https://anatoly-karpovich.github.io/aqa-course-project/#
 - Войти в приложения используя учетные данные test@gmail.com / 12345678 при этом:
 - дождаться исчезновения спиннеров
 - проверить действительно ли пользователь с логином Anatoly вошел в систему
 - Проверить скриншотом боковое навигационное меню с выбранной страницей Home
*/



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