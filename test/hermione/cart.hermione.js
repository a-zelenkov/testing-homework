const { assert } = require("chai");
const { addProduct } = require("./catalog.hermione");

const URL = "http://localhost:3000/hw/store/cart";

const fillForm = async (browser) => {
    await browser.url(URL);

    // наверно, должен быть более элегантный способ скипать тесты, но в доке было только про скипы в определенных браузерах
    if (!(await browser.$(".Form").isExisting())) return false;

    await browser.$("#f-name").setValue("test");
    await browser.$("#f-phone").setValue("88005553535");
    await browser.$("#f-address").setValue("test");
    return true;
};

beforeEach(async ({ browser }) => {
    await addProduct(browser);
});

describe("Корзина", async () => {
    // bug #6
    it("Сохраняет добавленные продукты при перезагрузке страницы", async ({ browser }) => {
        if (!(await addProduct(browser))) return;
        assert.isTrue(await fillForm(browser), "Продукт не сохранился");
    });
});

describe("Форма оплаты", async () => {
    // bug #10
    it("Валидирует телефон", async ({ browser }) => {
        if (!(await fillForm(browser))) return;

        await browser.$("#f-phone").setValue("test");
        await browser.$(".Form-Submit").click();

        await expect(browser.$("#f-phone + .invalid-feedback")).toBeDisplayed();

        await browser.$("#f-phone").setValue("88005553535");
        await browser.$(".Form-Submit").click();

        await expect(browser.$("#f-phone + .invalid-feedback")).not.toBeDisplayed();
    });
});

describe("Оповещение об успешной покупке", async () => {
    // bug #5
    it("Отображается после отправки формы", async ({ browser }) => {
        if (!(await fillForm(browser))) return;

        await browser.$(".Form-Submit").click();
        await expect(browser.$(".Cart-SuccessMessage")).toBeDisplayed();
    });
    // bug #8
    it("Выглядит корректно", async ({ browser }) => {
        if (!(await fillForm(browser))) return;

        await browser.$(".Form-Submit").click();

        if (await browser.$(".Cart-SuccessMessage").isExisting()) {
            await browser.assertView("cart_success_message", ".Cart-SuccessMessage", {
                ignoreElements: ["p:has(.Cart-Number)"],
            });
        }
    });
    // bug #2
    it("Имеет правильный id заказа", async ({ browser }) => {
        if (!(await fillForm(browser))) return;

        await browser.$(".Form-Submit").click();
        if (!(await browser.$(".Cart-SuccessMessage").isExisting())) return;

        const lastId = Number(await browser.$(".Cart-Number").getText());
        await addProduct(browser);
        await fillForm(browser);
        await browser.$(".Form-Submit").click();
        const currId = Number(await browser.$(".Cart-Number").getText());

        assert.equal(lastId, currId - 1);
    });
});

afterEach(async ({ browser }) => {
    await browser.url(URL);

    if (await browser.$(".Cart-Clear").isExisting()) {
        await browser.$(".Cart-Clear").click();
    }
});
