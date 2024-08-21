import Dexie, {type EntityTable} from 'dexie';

type Deck = {
  id: number;
  name: string;
};

type cardTypes =
  | 'ポケモン'
  | 'どうぐ'
  | 'ポケモンのどうぐ'
  | 'サポート'
  | 'スタジアム'
  | 'エネルギー';

const cardTypesArray: cardTypes[] = [
  'ポケモン',
  'どうぐ',
  'ポケモンのどうぐ',
  'サポート',
  'スタジアム',
  'エネルギー',
];

type DeckItem = {
  id: number;
  deck_id: number;
  name: string;
  count: number;
  type: cardTypes;
  sort_num: number;
};

const db = new Dexie('PokemonCardDatabase') as Dexie & {
  decks: EntityTable<Deck, 'id'>;
  deckItems: EntityTable<DeckItem, 'id'>;
};

// Schema declaration:
db.version(1).stores({
  decks: '++id, name',
  deckItems: '++id, deck_id, name, count, type, sort_num',
});

export type {Deck, DeckItem, cardTypes};
export {db, cardTypesArray};
