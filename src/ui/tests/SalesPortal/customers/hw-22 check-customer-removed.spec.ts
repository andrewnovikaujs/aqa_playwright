/*
Создайте e2e тест со следующими шагами:
1. Зайти на сайт Sales Portal
2. Залогиниться с вашими кредами
3. Перейти на страницу Customers List
4. Перейти на станицу Add New Customer
5. Создать покупателя
6. Проверить наличие покупателя в таблице
7. Кликнуть на кнопку "Delete" в таблице для созданного покупателя
8. В модалке удаления кликнуть кнопку Yes, Delete
9. Дождаться исчезновения модалки и загрузки страницы
10. Проверить, что покупатель отсутствует в таблице

Вам понадобится:

- PageObject модалки удаления покупателя
- Подключить модалку в PageObject страницы Customers
- Использовать фикстуры
*/

import { generateCustomerData } from "data/customers/generateCustomer.data";
import { NOTIFICATIONS, EMPTY_TABLE_ROW_TEXT } from "data/notifications.data";
import { expect, test } from "fixtures/businessSteps.fixture";
import _ from "lodash";


test.describe("[UI] [Sales Portal] [Customers]", async () => {
  test("Should check removed customer on Customer page", async ({
    loginAsLocalUser,
    homePage,
    customersPage,
    addNewCustomerPage
  }) => {
    await loginAsLocalUser();
    await homePage.waitForOpened();
    await homePage.clickModuleButton("Customers");
    await customersPage.waitForOpened();
    await customersPage.clickAddNewCustomer();
    await addNewCustomerPage.waitForOpened();
    const data = generateCustomerData();
    await addNewCustomerPage.fillInputs(data);
    await addNewCustomerPage.clickSaveNewCustomer();
    await customersPage.waitForOpened();
    await customersPage.waitForNotification(NOTIFICATIONS.CUSTOMER_CREATED);
    const actualCustomerData = await customersPage.getCustomerData(data.email);
    expect(actualCustomerData.email).toBe(data.email);
    expect(actualCustomerData.name).toBe(data.name);
    expect(actualCustomerData.country).toBe(data.country);
    await customersPage.clickDeleteCustomer(data.email);
    await customersPage.deleteCustomerModal.waitForOpened();
    await customersPage.deleteCustomerModal.clickDelete();
    await customersPage.deleteCustomerModal.waitForClosed();
    await customersPage.waitForOpened();
    await customersPage.waitForNotification(NOTIFICATIONS.CUSTOMER_DELETED);
    await expect(customersPage.tableRowByEmail(data.email)).not.toBeVisible();
    await customersPage.search(data.email);
    await expect(customersPage.emptyTableRow).toHaveText(EMPTY_TABLE_ROW_TEXT);    
  });
});