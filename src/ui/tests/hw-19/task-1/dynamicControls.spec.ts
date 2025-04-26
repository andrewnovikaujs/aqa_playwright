/*
Разработать тест со следующими шагами:

  - открыть https://the-internet.herokuapp.com/
  - перейти на страницу Dynamic Controls
  - Дождаться появления кнопки Remove
  - Завалидировать текста в заголовке страницы
  - Чекнуть чекбокс
  - Кликнуть по кнопке Remove
  - Дождаться исчезновения чекбокса
  - Проверить наличие кнопки Add
  - Завалидировать текст It's gone!
  - Кликнуть на кнопку Add
  - Дождаться появления чекбокса
  - Завалидировать текст It's back!
*/

import { test, expect } from "@playwright/test";

test.describe("[UI] [tests] dynamicControls", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/");
    await page.locator(`[href="/dynamic_controls"]`).click();
  });

  test.afterEach(async ({ page }) => {
    await page.reload();
  });

  test("Dynamic Controls", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Remove" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Dynamic Controls" })
    ).toBeVisible();
    await page.locator("input[type='checkbox']").check();
    await page.getByRole("button", { name: "Remove" }).click();
    await expect(page.locator("input[type='checkbox']")).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Add" })).toBeVisible();
    await expect(page.getByText("It's gone!")).toBeVisible();
    await page.getByRole("button", { name: "Add" }).click();
    await expect(page.locator("input[type='checkbox']")).toBeVisible();
    await expect(page.getByText("It's back!")).toBeVisible();
  });
});
