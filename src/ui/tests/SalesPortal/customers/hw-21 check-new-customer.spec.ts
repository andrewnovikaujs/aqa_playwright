/*
Разработать е2е теста со следующими шагами:
 - Открыть url https://anatoly-karpovich.github.io/aqa-course-project/#
 - Войти в приложения используя ваши учетные данные 
 - Создать покупателя (модуль Customers)
 - Верифицировать появившуюся нотификацию
 - Верифицировать созданного покупателя в таблице (сравнить все имеющиеся поля, покупатель должен быть самым верхним)
*/

import { generateCustomerData } from "data/customers/generateCustomer.data";
import { NOTIFICATIONS } from "data/notifications.data";
import { expect, test } from "fixtures/businessSteps.fixture";
import _ from "lodash";


test.describe("[UI] [Sales Portal] [Customers]", async () => {
  test("Should check created customer on Customer page", async ({
    loginAsLocalUser,
    homePage,
    customersPage,
    addNewCustomerPage
  }) => {
    //preconditions
    await loginAsLocalUser();
    await homePage.waitForOpened();
    await homePage.clickModuleButton("Customers");
    await customersPage.waitForOpened();
    await customersPage.clickAddNewCustomer();
    await addNewCustomerPage.waitForOpened();
    const data = generateCustomerData();
    await addNewCustomerPage.fillInputs(data);
    await addNewCustomerPage.clickSaveNewCustomer();
    //act
    await customersPage.waitForOpened();
    await customersPage.waitForNotification(NOTIFICATIONS.CUSTOMER_CREATED);
    const actualCustomerData = await customersPage.getCustomerData(data.email);
    expect(actualCustomerData.email).toBe(data.email);
    expect(actualCustomerData.name).toBe(data.name);
    expect(actualCustomerData.country).toBe(data.country);
     
  });

});
