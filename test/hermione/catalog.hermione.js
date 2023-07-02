const { assert } = require("chai");

const URL = "http://localhost:3000/hw/store/catalog";

// слышал про pageobjects, но уже нет времени на рефакторинг(
const addProduct = async (browser) => {
    await browser.url(URL);
    await browser.$(".ProductItem-DetailsLink").click();
    await browser.$(".ProductDetails-AddToCart").click();

    return await browser.$(".CartBadge").isExisting();
};

describe("Продукт", async () => {
    // bug #1
    it("Корректно отображается", async ({ browser }) => {
        await browser.url(URL);

        assert.isNotEmpty(await browser.$(".ProductItem-Name").getText(), "Отсутствует название");
        assert.isNotEmpty(await browser.$(".ProductItem-Price").getText(), "Отсутствует цена");
        assert.isNotEmpty(
            await browser.$(".ProductItem-DetailsLink").getText(),
            "Отсутствует ссылка на страницу продукта"
        );
    });
    // bug #3
    it("Ведет на свою страницу при клике на ссылку", async ({ browser }) => {
        await browser.url(URL);

        const products = await browser.$$(".ProductItem");
        const product = products[products.length - 1];
        const id = await product.getAttribute("data-testid");
        const name = await product.$(".ProductItem-Name").getText();
        const link = product.$(".ProductItem-DetailsLink");
        await link.scrollIntoView();
        await link.waitForClickable();
        await link.click();

        expect(browser).toHaveUrl(`${URL}/${id}`);

        await expect(browser.$(".ProductDetails-Name")).toBeDisplayed();
    });
    // bug #9
    it("Кнопка добавления в корзину отображается корректно", async ({ browser }) => {
        await browser.url(URL);

        await browser.$$(".ProductItem")[0].$(".ProductItem-DetailsLink").click();

        await expect(browser.$(".ProductDetails-AddToCart")).toBeDisplayed();
        await browser.assertView("product_details_add_to_cart", ".ProductDetails-AddToCart");
    });

    // bug #7
    it("Добавляется в корзину", async ({ browser }) => {
        assert.isTrue(await addProduct(browser), "Продукт не был добавлен в корзину");
    });
});

module.exports = {
    addProduct,
};
