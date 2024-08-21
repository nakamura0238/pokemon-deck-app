import { db, DeckItem } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import styles from "./compare.module.scss";
import classNames from "classnames";

import { useState } from "react";
import { DeckSelect } from "@/components/form/DeckSelect";

type CompareRow = {
  rightDeck: DeckItem | undefined;
  leftDeck: DeckItem | undefined;
};
export const Compare = () => {
  const [deck1Id, setDeck1Id] = useState<number>(0);
  const [deck2Id, setDeck2Id] = useState<number>(0);
  /**
   * データ取得
   */
  // TODO: Hooksに切り分ける
  const test = useLiveQuery(async () => {
    // TODO: Promise.allで書き直す
    const deck = await db.decks.get(deck1Id);
    const tmpDeckItems = await db.deckItems
      .where("deck_id")
      .equals(deck1Id)
      .toArray();

    const deck2 = await db.decks.get(deck2Id);
    const tmpDeckItems2 = await db.deckItems
      .where("deck_id")
      .equals(deck2Id)
      .toArray();

    const duplicateArray: CompareRow[] = [];
    const onlyDeck1: CompareRow[] = [];
    const onlyDeck2: CompareRow[] = [];

    // デッキ比較処理
    if (tmpDeckItems && tmpDeckItems2) {
      tmpDeckItems.forEach((item1) => {
        const itemName = item1.name;
        const resItem2 = tmpDeckItems2.find((item2) => item2.name == itemName);
        if (resItem2) {
          duplicateArray.push(GenerateRowData(item1, resItem2));
        } else {
          onlyDeck1.push(GenerateRowData(item1, undefined));
        }
      });

      tmpDeckItems2.forEach((item2) => {
        const itemName = item2.name;
        const res = tmpDeckItems.find((item1) => item1.name == itemName);
        if (!res) {
          onlyDeck2.push(GenerateRowData(undefined, item2));
        }
      });
    } else if (tmpDeckItems) {
      tmpDeckItems.forEach((item1) => {
        onlyDeck1.push(GenerateRowData(item1, undefined));
      });
    } else if (tmpDeckItems2) {
      tmpDeckItems2.forEach((item2) => {
        onlyDeck2.push(GenerateRowData(undefined, item2));
      });
    }

    const comparedRows = [...duplicateArray, ...onlyDeck1, ...onlyDeck2];
    return {
      deckName: deck?.name,
      deckName2: deck2?.name,
      comparedRows,
    };
  }, [deck1Id, deck2Id]);

  const GenerateRowData = (
    item1: DeckItem | undefined,
    item2: DeckItem | undefined
  ) => {
    return {
      leftDeck: item1,
      rightDeck: item2,
    };
  };

  return (
    <div className={styles.compare_layout}>
      <div className={styles.compare_container}>
        <div className={styles.page_title}>
          <p>デッキ比較</p>
        </div>
        <div className={styles.select_box}>
          <DeckSelect id={"deck1"} label={"デッキ１"} setDeckId={setDeck1Id} />
          <DeckSelect id={"deck2"} label={"デッキ2"} setDeckId={setDeck2Id} />
        </div>
        <div className={styles.comparedRows_grid}>
          <div
            className={classNames(
              styles.comparedRow_box,
              styles.bottom_separator
            )}
          >
            <span className={styles.comparedRow_name_cell}>カード名</span>
            <span
              className={classNames(
                styles.comparedRow_count_cell,
                styles.border_left
              )}
            >
              枚数
            </span>
            <span className={styles.comparedRow_separator}></span>
            <span
              className={classNames(
                styles.comparedRow_count_cell,
                styles.border_right
              )}
            >
              枚数
            </span>
            <span className={styles.comparedRow_name_cell}>カード名</span>
          </div>
          {test?.comparedRows.map((row, i) => {
            return (
              <div className={styles.comparedRow_box} key={i}>
                <span className={styles.comparedRow_name_cell}>
                  {row.leftDeck?.name}
                </span>
                <span
                  className={classNames(
                    styles.comparedRow_count_cell,
                    styles.border_left
                  )}
                >
                  {row.leftDeck?.count}
                </span>
                <span className={styles.comparedRow_separator}></span>
                <span
                  className={classNames(
                    styles.comparedRow_count_cell,
                    styles.border_right
                  )}
                >
                  {row.rightDeck?.count}
                </span>
                <span className={styles.comparedRow_name_cell}>
                  {row.rightDeck?.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
