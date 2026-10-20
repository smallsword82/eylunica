import { test, expect } from "./local-test";

test("müzik ayarları gizli başlar, simgeyle açılır ve Escape ile kapanır", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Ses ve müzik ayarları", exact: true });
  const menu = page.locator("#music-settings");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeHidden();
  await toggle.click();
  await expect(menu).toBeVisible();
  await page.getByRole("combobox", { name: "Ses modu" }).selectOption("effects");
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await expect(page.getByRole("combobox", { name: "Ses modu" })).toHaveValue("effects");
  await page.getByRole("button", { name: "Müzik ayarlarını kapat ×" }).click();
  await expect(menu).toBeHidden();
  await page.reload();
  await expect(menu).toBeHidden();
});
