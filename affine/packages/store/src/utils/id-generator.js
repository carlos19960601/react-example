import { nanoid as nanoidGenerator } from "nanoid";

export function nanoid() {
  return nanoidGenerator(10);
}
