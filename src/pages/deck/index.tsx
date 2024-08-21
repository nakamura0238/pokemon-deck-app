import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/db";
import styles from "./deckList.module.scss";
import { exportDeckItem } from "@/types";

export const Deck = () => {
  const [modalElm, setModalElm] = useState<JSX.Element | undefined>(undefined);

  const decks = useLiveQuery(async () => {
    const tmpDecks = await db.decks.toArray();
    return tmpDecks;
  });

  const openModal = (deckId: number, deckName: string) => {
    setModalElm(
      <div
        className={styles.modal_overlay}
        onClick={(e) => e.target === e.currentTarget && closeModal()}
      >
        <div className={styles.modal_inner}>
          <p>「{deckName}」</p>
          <p>デッキを削除しますか？</p>
          <div>
            <button
              type="button"
              className={styles.cancel}
              onClick={closeModal}
            >
              キャンセル
            </button>
            <button
              type="button"
              className={styles.delete_enter}
              onClick={() => deleteDeck(deckId)}
            >
              削除
            </button>
          </div>
        </div>
      </div>
    );
  };

  const deleteDeck = async (deckId: number) => {
    await db.deckItems.where("deck_id").equals(deckId).delete();
    await db.decks.delete(deckId);
    closeModal();
  };

  const closeModal = () => {
    setModalElm(undefined);
  };

  const exportDecks = async () => {
    const decks = await db.decks.toArray();
    const deckItems = await db.deckItems.toArray();

    const exportDecks = decks.map((deck) => {
      const items: exportDeckItem[] = deckItems.reduce(
        (accumulator: exportDeckItem[], currentValue) => {
          if (currentValue.deck_id === deck.id) {
            accumulator.push({
              count: currentValue.count,
              name: currentValue.name,
              sort_num: currentValue.sort_num,
              type: currentValue.type,
            });
          }
          return accumulator;
        },
        []
      );

      return {
        deckName: deck.name,
        deckItems: items,
      };
    });

    const blob = new Blob([JSON.stringify(exportDecks, null, "  ")], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `deckList.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.deckList_layout}>
      <div className={styles.deckList_container}>
        <div className={styles.page_title}>
          <p>デッキ一覧</p>
          <button
            type="button"
            className={styles.primary}
            onClick={exportDecks}
          >
            エクスポート
          </button>
        </div>

        {decks?.map((val) => {
          return (
            <div key={val.id} className={styles.deck_box}>
              <Link className={styles.deck_link} to={`/deck/${val.id}`}>
                {val.name}
              </Link>
              <button
                type="button"
                className={styles.delete}
                onClick={() => openModal(val.id, val.name)}
              >
                削除
              </button>
            </div>
          );
        })}
      </div>
      {modalElm}
    </div>
  );
};
