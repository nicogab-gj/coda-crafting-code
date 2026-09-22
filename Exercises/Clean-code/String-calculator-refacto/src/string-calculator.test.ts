import { describe, expect, it } from "vitest";
import { stringCalculator } from "./string-calculator.js";

describe("stringCalculator", () => {
  it("returns 0 for an empty string", () => {
    expect(stringCalculator("")).toBe(0);
  });

  it("returns the number itself for a single number", () => {
    expect(stringCalculator("1")).toBe(1);
  });

  it("sums two numbers separated by a comma", () => {
    expect(stringCalculator("1,2")).toBe(3);
  });

  it("sums any amount of numbers", () => {
    expect(stringCalculator("1,2,3,4,5")).toBe(15);
  });

  it("accepts newlines as delimiters too", () => {
    expect(stringCalculator("1\n2,3")).toBe(6);
  });

  it("accepts a custom delimiter declared on the first line", () => {
    expect(stringCalculator("//;\n1;2")).toBe(3);
  });

  it("throws listing every negative number found", () => {
    expect(() => stringCalculator("1,-2,-5")).toThrow(
      "negatives not allowed: -2, -5",
    );
  });

  it("throws when a negative number is found even with custom delimiters", () => {
    expect(() => stringCalculator("//;\n1;-2")).toThrow(
      "negatives not allowed: -2",
    );
  });

  it("ignores numbers above 1000", () => {
    expect(stringCalculator("2,1001")).toBe(2);
  });

  it("still ignores numbers above 1000 even with custom delimiters", () => {
    expect(stringCalculator("//[***]\n2***1001")).toBe(2);
  });

  it("accepts a delimiter of any length", () => {
    expect(stringCalculator("//[***]\n1***2***3")).toBe(6);
  });

  it("accepts several declared delimiters", () => {
    expect(stringCalculator("//[*][%]\n1*2%3")).toBe(6);
  });
});
