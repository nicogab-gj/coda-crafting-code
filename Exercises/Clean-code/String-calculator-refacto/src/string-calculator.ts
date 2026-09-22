import { SommeTotal, SommeTotal_EntreDeuxVariable } from "./utils";

export function add(input: string): number {
  if (input === '') return 0;

  if (input.startsWith('//')) return SommeTotal(input);

  if (input.includes(',') || input.includes('\n')) return SommeTotal_EntreDeuxVariable(input);

  return Number(input);
}