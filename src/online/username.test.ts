import { expect, it } from "vitest";
import { accountAddress } from "./username";
it("kullanıcı adını tutarlı teknik hesap kimliğine dönüştürür", () => {
  expect(accountAddress(" Ritim_Kedisi ")).toBe("ritim_kedisi@accounts.eylunica.netlify.app");
  for (const name of ["", "ab", "gerçek_ad", "ad soyad", "1isim", "isim@email.com", "a".repeat(21)])
    expect(() => accountAddress(name)).toThrow("Kullanıcı adı");
});
