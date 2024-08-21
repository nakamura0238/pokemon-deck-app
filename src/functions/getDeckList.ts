import { DeckList } from "../types";

const DECK_LIST_KEY = 'deckList';

export const getDeckKeys = () => {
  const storedValue = localStorage.getItem(DECK_LIST_KEY)
  if (!storedValue) return null
  const deckList: DeckList = JSON.parse(storedValue)
  return Object.keys(deckList);
}