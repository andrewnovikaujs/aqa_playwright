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
    await page.locator("button[type='submit']").click();
    await expect(page.getByRole("heading", { name: "Registration Details" })).toBeVisible();
    await expect(page.locator("#fullName")).toHaveText(`${firstName} ${lastName}`);
    await expect(page.locator("#address")).toHaveText(address);
    await expect(page.locator("#email")).toHaveText(email);
    await expect(page.locator("#phone")).toHaveText(phone);
    await expect(page.locator("#country")).toHaveText("USA");
    await expect(page.locator("#gender")).toHaveText("male");
    await expect(page.locator("#language")).toHaveText("Russian");
    await expect(page.locator("#skills")).toHaveText("JavaScript");
    await expect(page.locator("#hobbies")).toHaveText("Travelling, Movies");
  });
});
