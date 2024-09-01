import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import styles from "./items.module.scss";
import { db } from "@/db/db";
import classNames from "classnames";
import { editContext } from "..";

type Props = {
  id: number;
};

export const Items: React.FC<Props> = ({ id }) => {
  const navigate = useNavigate();

  const {
    checkArray,
    setCheckArray,
    selectedList,
    setSelectedList,
  } = useContext(editContext);

  /**
   * データ取得
   */
  const deck = useLiveQuery(async () => {
    const deck = await db.decks.get(id);
    if (!deck) {
      navigate("/");
      return;
    }
    const tmpDeckItems = await db.deckItems
      .where("deck_id")
      .equals(id)
      .toArray();
    const tempArray = new Array(tmpDeckItems.length).fill(false);
    setSelectedList([...tempArray]);
    return { deckName: deck.name, deckItems: tmpDeckItems };
  });

  /**
   * チェックボックス選択処理
   * @param event
   * @param id
   * @param index
   */
  const handleCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
    index: number
  ) => {
    const newSelected = [...selectedList];
    newSelected[index] = event.target.checked;
    setSelectedList([...newSelected]);

    if (event.target.checked) {
      setCheckArray([...checkArray, id]);
    } else {
      const tempArray = checkArray.filter((val) => val != id);
      setCheckArray([...tempArray]);
    }
  };


  return (
    <>
      <form>
        <div className={styles.deckItem_grid}>
          <div className={styles.item_label_box}>
            <span className={styles.deckItem_cell}>カード名</span>
            <span className={classNames(styles.deckItem_cell, styles.number)}>
              枚数
            </span>
            <span className={classNames(styles.deckItem_cell, styles.type)}>
              カード種類
            </span>
          </div>
          {deck?.deckItems.map((val, i) => {
            return (
              <label
                htmlFor={`${val.deck_id}-${val.id}`}
                key={val.name}
                className={styles.deckItem_box}
              >
                <input
                  id={`${val.deck_id}-${val.id}`}
                  className={styles.checkbox}
                  hidden
                  type="checkbox"
                  value={val.id}
                  checked={selectedList[i]}
                  onChange={(e) => handleCheck(e, val.id, i)}
                />
                <span className={styles.deckItem_cell}>{val.name}</span>
                <span
                  className={classNames(styles.deckItem_cell, styles.number)}
                >
                  {val.count}
                </span>
                <span className={classNames(styles.deckItem_cell, styles.type)}>
                  {val.type}
                </span>
              </label>
            );
          })}
        </div>
      </form>
    </>
  );
};
