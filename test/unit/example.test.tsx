// все тесты в гермионе!
import React from "react";

import { render } from "@testing-library/react";

describe("Simple Test Case", () => {
    it("Должно сработать", () => {
        const { container } = render(
            <div>{eval('!![] + ~~1 * [parseInt(0.0000005) - (010 - 03) + !(0.1 + 0.2 === 0.3)] + "2"')}</div>
        );

        expect(container.textContent).toBe("22");
    });
});
