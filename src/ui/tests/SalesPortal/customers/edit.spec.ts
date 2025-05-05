import { test, expect } from "fixtures/businessSteps.fixture";

test.describe("[UI] [Customers] [Edit]", async () => {
  test("Edit customer with smoke data", async ({ loginAsLocalUser, homePage, customersPage, editCustomerPage }) => {
    loginAsLocalUser();
    await homePage.clickModuleButton("Customers");
    await customersPage.waitForOpened();
    await customersPage.clickTableAction("user@domain.com	", "edit");
    await editCustomerPage.waitForOpened();
    await editCustomerPage.fillInputs({
      email: "user@domain.com!",
      // city: "@!#",
      // flat: 11111111111111,
      // house: 1111111111111111111,
      // name: "123!@#",
      // notes: "<>",
      // phone: "123",
      // street: "123!@#",
    });
    const errors = await editCustomerPage.getFormErrors();
    console.log(errors);
  });
});
