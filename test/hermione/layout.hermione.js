const URL = "http://localhost:3000/hw/store/";

describe("Верстка", async () => {
    it("Адаптируется под ширину экрана", async ({ browser }) => {
        await browser.url(URL);

        browser.setWindowSize(400, 4000);
        await browser.assertView("layout_400", "body");

        browser.setWindowSize(1920, 1080);
        await browser.assertView("layout_1920", "body");
    });
});

describe("Шапка", async () => {
    it("Содержит ссылки на все страницы и корзину", async ({ browser }) => {
        await browser.url(URL);

        const links = ["catalog", "delivery", "contacts", "cart"];

        await browser.$$(".navbar-nav a.nav-link").forEach(async (el, i) => {
            await expect(el).toHaveHrefContaining(links[i]);
        });
    });
    it("Название магазина должно быть ссылкой на главную страницу", async ({ browser }) => {
        await browser.url(`${URL}/catalog`);

        await browser.$(".Application-Brand.navbar-brand").click();

        await expect(browser).toHaveUrl(URL);
    });
});

describe("Гамбургер", async () => {
    it("Появляется при ширине меньше 576px", async ({ browser }) => {
        await browser.url("http://localhost:3000/hw/store/");

        browser.setWindowSize(575, 1080);
        await expect(browser.$(".Application-Toggler.navbar-toggler")).toBeDisplayed();

        browser.setWindowSize(576, 1080);
        await expect(browser.$(".Application-Toggler.navbar-toggler")).not.toBeDisplayed();
    });
    // bug #4
    it("Схлопывается при переходе на другую страницу", async ({ browser }) => {
        await browser.url("http://localhost:3000/hw/store/");

        browser.setWindowSize(575, 1080);
        await browser.$(".Application-Toggler.navbar-toggler").click();
        await browser.$(".Application-Menu.navbar-collapse .nav-link").click();

        await expect(browser.$(".Application-Menu.navbar-collapse")).not.toBeDisplayed();
    });
});
