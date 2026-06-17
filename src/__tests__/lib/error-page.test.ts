import { describe, it, expect } from "vitest";
import { renderErrorPage } from "@/lib/error-page";

describe("renderErrorPage", () => {
  it("returns a valid HTML string", () => {
    const html = renderErrorPage();
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("</html>");
  });

  it("contains the error title", () => {
    const html = renderErrorPage();
    expect(html).toContain("This page didn't load");
  });

  it("contains a try again button", () => {
    const html = renderErrorPage();
    expect(html).toContain("Try again");
    expect(html).toContain("location.reload()");
  });

  it("contains a go home link", () => {
    const html = renderErrorPage();
    expect(html).toContain('href="/"');
    expect(html).toContain("Go home");
  });

  it("includes viewport meta tag for mobile", () => {
    const html = renderErrorPage();
    expect(html).toContain('name="viewport"');
    expect(html).toContain("width=device-width");
  });
});
