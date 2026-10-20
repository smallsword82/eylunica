import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ShapeText } from "./ShapeText";
it("renk ve doluluk gerçek SVG ile çizilir, açıklama görünür yazılmaz", () => {
  const { container } = render(<ShapeText text="■ Kare · Mor · içi dolu → □ Kare · içi boş → ● Daire · Kırmızı" />);
  expect(container.textContent).toBe(" →  → ");
  expect(screen.getByRole("img", { name: "Mor kare, içi dolu" })).toBeVisible();
  const shapes = container.querySelectorAll("svg");
  expect(shapes[0]).toHaveAttribute("fill", "#c49aff");
  expect(shapes[1]).toHaveAttribute("fill", "none");
  expect(shapes[1]).toHaveAttribute("stroke", "#ffe16a");
  expect(shapes[2]).toHaveAttribute("fill", "#ff727f");
});
it("ek nokta, yıldız ve sıralar yazısız görsellerle korunur", () => {
  const { container } = render(<ShapeText text="Sırayla seç: ◆ Baklava · Turuncu · ek nokta → ✦ Yıldız." />);
  expect(container.textContent).toBe("Sırayla seç:  → .");
  expect(screen.getByRole("img", { name: /ek noktalı/ }).querySelector("circle")).not.toBeNull();
  expect(container.querySelectorAll("svg")).toHaveLength(2);
});
it("okuma ve sayısal yanıtların metnini değiştirmez", () => {
  const { container } = render(<ShapeText text="Mavi kurdeleler, 15" />);
  expect(container.textContent).toBe("Mavi kurdeleler, 15");
  expect(container.querySelector("svg")).toBeNull();
});
