import React, { createContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./edit.module.scss";
import { Title } from "./components/Title";
import { Items } from "./components/Items";
import { ItemForm } from "./components/Form";
import { db } from "@/db/db";

export const editContext = createContext(
  {} as {
    checkArray: Array<number>;
    setCheckArray: React.Dispatch<React.SetStateAction<number[]>>;
    selectedList: Array<boolean>;
    setSelectedList: React.Dispatch<React.SetStateAction<boolean[]>>;
    resetFunc: () => void;
  }
);

export const DeckEdit = () => {
  const navigate = useNavigate();
  const [checkArray, setCheckArray] = useState<Array<number>>([]);
  const [selectedList, setSelectedList] = useState<boolean[]>([]);

  const params = useParams<{ id: string }>();
  if (!params.id) {
    navigate("/");
  }
  const deckId = parseInt(params.id as string);

  const resetFunc = () => {
    const newSelected = [...selectedList];
    newSelected.fill(false);
    setSelectedList([...newSelected]);
    setCheckArray([]);
  };

  const exportDeck = async () => {
    const deck = await db.decks.where("id").equals(deckId).toArray();
    const deckItems = await db.deckItems.where("deck_id").equals(deckId).toArray();
    const items = deckItems.map((val) => {
      return {
        count: val.count,
        name: val.name,
        sort_num: val.sort_num,
        type: val.type,
      };
    });
    const exportJson = [
      {
        deckName: deck[0].name,
        deckItems: items,
      },
    ];
    const blob = new Blob([JSON.stringify(exportJson, null, "  ")], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${deck[0].name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <editContext.Provider
      value={{
        checkArray,
        setCheckArray,
        selectedList,
        setSelectedList,
        resetFunc,
      }}
    >
      <div className={styles.deckItem_layout}>
        <section className={styles.deckItem_container}>
          <div className={styles.page_title}>
            <p>デッキ編集</p>

            <button type="button" className={styles.primary} onClick={exportDeck}>
              エクスポート
            </button>
          </div>
          <Title id={deckId} />
          <Items id={deckId} />
        </section>
        <ItemForm id={deckId} />
      </div>
    </editContext.Provider>
  );
};
