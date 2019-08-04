import { formatDate, convertToMilliseconds } from "./index";

describe("Utils tests", () => {
  describe("Convert to Milliseconds tests", () => {
    it("Should return value in milliseconds", () => {
      expect(convertToMilliseconds(0)).toEqual(0);
      expect(convertToMilliseconds(1564954928)).toEqual(1564954928 * 1000);
    });

    it("Should manage invalid arguments", () => {
      expect(convertToMilliseconds()).toEqual(0);
      expect(convertToMilliseconds("")).toEqual(0);
      expect(convertToMilliseconds(null)).toEqual(0);
      expect(convertToMilliseconds({})).toEqual(0);
    });
  });

  describe("Format date tests", () => {
    it("Should handle invalid arguments", () => {
      expect(formatDate()).toEqual("");
      expect(formatDate("")).toEqual("");
      expect(formatDate(null)).toEqual("");
      expect(formatDate({})).toEqual("");
    });
  });
});
