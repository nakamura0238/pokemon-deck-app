import React from "react";
import classNames from "classnames/bind";
import styles from "@/components/form/Select/select.module.scss";
import { db } from "@/db/db";
import caretDown from "@/assets/caret-down.svg";
import { useLiveQuery } from "dexie-react-hooks";

interface Props extends React.ComponentPropsWithRef<"select"> {
  id: string;
  label: string;
  setDeckId: React.Dispatch<React.SetStateAction<number>>;
}

const cx = classNames.bind(styles);

export const DeckSelect: React.FC<Props> = ({
  id,
  label,
  setDeckId,
  ...props
}) => {
  const selectClassNames = cx({
    form_input: true,
    select: true,
  });

  const deckArray = useLiveQuery(async () => {
    return await db.decks.toArray();
  });

  const setSelectId = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setDeckId(id);
  };

  return (
    <div className={styles.input_box}>
      <div className={styles.label_box}>
        <label htmlFor={id}>{label}</label>
      </div>
      <select
        id={id}
        className={selectClassNames}
        style={{ backgroundImage: `url(${caretDown})` }}
        {...props}
        onChange={setSelectId}
      >
        <option value={0}></option>
        {deckArray &&
          deckArray.map((val) => {
            return (
              <option key={`${val.id}-${val.name}`} value={val.id}>
                {val.name}
              </option>
            );
          })}
      </select>
    </div>
  );
};
