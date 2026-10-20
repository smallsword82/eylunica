import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import config from "../capacitor.config";
it("Android görünen adı eylunica olur; güncelleme ve veri kimliği korunur", () => {
  expect(config.appName).toBe("eylunica");
  expect(config.appId).toBe("com.ritma.matematiksahnesi");
  const strings = readFileSync("android/app/src/main/res/values/strings.xml", "utf8");
  expect(strings).toContain('<string name="app_name">eylunica</string>');
  expect(strings).toContain('<string name="title_activity_main">eylunica</string>');
  expect(strings).toContain('<string name="package_name">com.ritma.matematiksahnesi</string>');
});
