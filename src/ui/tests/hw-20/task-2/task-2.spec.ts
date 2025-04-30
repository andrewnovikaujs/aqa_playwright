/*
Разработать тест со следующими шагами:
https://anatoly-karpovich.github.io/demo-shopping-cart/
  - добавить продукты 2,4,6,8,10
  - завалидировать бейдж с количеством
  - открыть чекаут
  - завалидировать сумму и продукты
  - ввести все найденные вами промокоды (вспоминаем первую лекцию)
  - завалидировать конечную сумму
  - зачекаутиться
  - завалидировать сумму
*/




import { test, expect, Page, Locator } from "@playwright/test";

test.describe("[UI] [Demo Shopping Cart] [E2E]", () => {
  test("Successful checkout with 5 products and all valid promocodes", async ({ page }) => {
    await page.goto("https://anatoly-karpovich.github.io/demo-shopping-cart/");

    const products = ["Product 2", "Product 4", "Product 6", "Product 8", "Product 10"];
    
    // Добавляем продукты в корзину
    for (const product of products) {
      await getAddToCartButton(product, page).click();
    }

    // Получаем цены всех продуктов
    const productPrices = await Promise.all(products.map(product => getProductPrice(product, page)));
    const initialTotal = productPrices.reduce((acc, price) => acc + price, 0);

    // Проверяем бейдж с количеством товаров
    await expect(page.locator("#badge-number")).toHaveText(products.length.toString());

    // Открываем корзину
    await page.getByRole("button", { name: "Shopping Cart" }).click();

    // Проверяем сумму до скидок
    await expect(getTotalPrice(page)).resolves.toBe(initialTotal);

    // Применяем все промокоды и вычисляем финальную цену
    const finalPrice = await applyPromocodesAndCalculateFinalPrice(initialTotal, page);

    const displayedTotal = await getDisplayedTotal(page);

    // Проверяем финальную сумму после применения всех промокодов
    await expect(getTotalPrice(page)).resolves.toBe(finalPrice);

    // Завершаем покупку
    await page.getByRole("button", { name: "Checkout" }).click();

    // Проверяем сообщение об успешной покупке
    await expect(page.getByText("Thanks for ordering!")).toBeVisible();

    // Финальная проверка суммы  
    const orderTotal = await getOrderTotal(page);
    expect(orderTotal).toBe(displayedTotal);   

  });
});

// ===== Вспомогательные функции =====

// Находим кнопку "Add to card" для конкретного продукта
function getAddToCartButton(productName: string, page: Page): Locator {
  return page
    .locator("div.card-body")
    .filter({ has: page.getByText(productName, { exact: true }) })
    .getByRole("button", { name: "Add to card" });
}

// Получаем цену продукта
async function getProductPrice(productName: string, page: Page): Promise<number> {
  const priceText = await page
    .locator("div.card-body")
    .filter({ has: page.getByText(productName, { exact: true }) })
    .locator("span")
    .innerText();
  
  return +priceText.replace("$", "");
}

// Извлекаем сумму из строки
async function getTotalPrice(page: Page): Promise<number> {
  const totalText = await page.locator("#total-price").innerText();
  const totalPrice = totalText.match(/\$([\d,]+\.\d{2})/); // извлекаем только сумму

  if (totalPrice) {
    return parseFloat(totalPrice[1].replace(",", "")); // возвращаем только цифры
  }

  throw new Error("Total price not found");
}

// Применяем промокоды по очереди и рассчитываем финальную цену
async function applyPromocodesAndCalculateFinalPrice(initialTotal: number, page: Page): Promise<number> {
  let currentTotal = initialTotal;

  // Применяем все промокоды по очереди
  for (const promocode of Object.values(Promocodes)) {
    const discountedPrice = await applyPromocodeAndGetDiscountedPrice(promocode, currentTotal, page);
    currentTotal = discountedPrice;
  }

  return currentTotal;
}

// Применяем один промокод и рассчитываем новую цену
async function applyPromocodeAndGetDiscountedPrice(promocode: string, currentTotal: number, page: Page): Promise<number> {
  const spinner = page.locator(".spinner-border");

  await page.locator("#rebate-input").fill(""); // Очищаем поле
  await page.locator("#rebate-input").fill(promocode);
  await page.getByRole("button", { name: "Redeem" }).click();

  // Ждём скрытия спиннера
  await expect(spinner).toBeHidden();

  // Получаем текущую цену после скидки
  const priceText = await page.locator("#total-price").innerText();
  const newTotal = parseFloat(priceText.replace("$", "").split(" ")[0]);

  return newTotal;
}

async function getDisplayedTotal(page: Page): Promise<number> {
  const totalText = await page.locator("#total-price").innerText();
  const totalAmountText = totalText.split(" ")[0];
  return parseFloat(totalAmountText.replace("$", ""));
}

async function getOrderTotal(page: Page): Promise<number> {
  const totalOrder = await page.locator(".text-muted").last().innerText();
  return parseFloat(totalOrder.replace("$", ""));
}

// Перечисление всех промокодов
enum Promocodes {
  DISCOUNT20 = "HelloThere",
  DISCOUNT15 = "15-PERCENT-FOR-CSS",
  DISCOUNT10 = "HOT-COURSE",
  DISCOUNT10_BASIC = "10-PERCENT-FOR-REDEEM",
  DISCOUNT8 = "NO-PYTHON",
  DISCOUNT7 = "JAVA-FOR-BOOMERS",
  DISCOUNT5 = "5-PERCENT-FOR-UTILS",
}