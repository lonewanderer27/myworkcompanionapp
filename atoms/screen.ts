import { atom } from "jotai";

export const screenAtom = atom<{
  fromScreen: string;
  id: string;
}>();
