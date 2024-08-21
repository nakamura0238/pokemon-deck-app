import { cardTypes } from "@/db/db";

// デッキ一覧とその中身
export type DeckList = {
  [key: string]: DeckItem[]
}

export type DeckItem = {
  id: string,
  name: string,
  count: number,
  type: number,
}

// 使用されたカード一覧
export type CardList = {
  items: Array<CardListItem>;
  total: number;
};

export type CardListItem = {
  name: string;
  type: number;
};


// エクスポート
export type exportDeckItem = {
  count: number,
  name: string,
  sort_num: number,
  type: cardTypes,
}

export type exportDeckJson = {
  deckName: string,
  deckItems: Array<exportDeckItem>
}

export type exportDeckArray = Array<exportDeckJson>