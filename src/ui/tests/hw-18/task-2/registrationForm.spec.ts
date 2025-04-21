import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("[UI] [tests] Registration form filling", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "https://anatoly-karpovich.github.io/demo-registration-form/"
    );
  });

  test("Registration with all valid data", async ({ page }) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const address = faker.location.streetAddress();
    const phone = faker.phone.number();
    const password = faker.internet.password();

    await page.locator("#firstName").fill("test");
    await page.locator("#firstName").fill(firstName);
    await page.locator("#lastName").fill(lastName);
    await page.locator("#address").fill(address);
    await page.locator("#email").fill(email);
    await page.locator("#phone").fill(phone);
    await page.locator("#country").selectOption("USA");
    await page.locator("input[value='male']").click();
    await page.locator("input[value='Travelling']").click();
    await page.locator("input[value='Movies']").click();
    await page.locator("#language").fill("Russian");
    await page.locator("#skills").selectOption(["JavaScript"]);
    await page.locator("#year").selectOption("1990");
    await page.locator("#month").selectOption("October");
    await page.locator("#day").selectOption("22");
    await page.locator("#password").fill(password);
    await page.locator("#password-confirm").fill(password);
    await expect(page.locator("#firstName")).toHaveValue(firstName);
    await expect(page.locator("#lastName")).toHaveValue(lastName);
    await expect(page.locator("#address")).toHaveValue(address);
    await expect(page.locator("#email")).toHaveValue(email);
    await expect(page.locator("#phone")).toHaveValue(phone);
    await expect(page.locator("#country")).toHaveValue("USA");
    await expect(page.locator("input[value='male']")).toBeChecked();
    await expect(page.locator("input[value='Travelling']")).toBeChecked();
    await expect(page.locator("input[value='Movies']")).toBeChecked();
    await expect(page.locator("#language")).toHaveValue("Russian");
    await expect(page.locator("#skills")).toHaveValue("JavaScript");
    await expect(page.locator("#year")).toHaveValue("1990");
    await expect(page.locator("#month")).toHaveValue("October");
    await expect(page.locator("#day")).toHaveValue("22");
    await expect(page.locator("#password")).toHaveValue(password);
    await expect(page.locator("#password-confirm")).toHaveValue(password);
    await page.locator("button[type='submit']").click();
    await page.locator("//title[text()='Register Form']");
  });
});
