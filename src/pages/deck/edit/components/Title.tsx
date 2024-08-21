import React, { useRef, useState } from "react";
import { db } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { z } from "zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "@/pages/deck/edit/components/title.module.scss";
import { TextInput } from "@/components/form/TextInput";

type Props = {
  id: number;
};

type DeckName = {
  deckName: string;
};

const deckNameSchema = z.object({
  deckName: z.string().min(1, "デッキ名は必須です"),
});

export const Title: React.FC<Props> = ({ id }) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeckName>({
    resolver: zodResolver(deckNameSchema),
  });

  const deck = useLiveQuery(async () => {
    const deck = await db.decks.get(id);
    return deck;
  });

  const changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const deckName = event.target.value;

    if (deckName == deck?.name || deckName.length < 1) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  };

  const onSubmitName: SubmitHandler<DeckName> = async (data: DeckName) => {
    console.log(data);
  };

  return (
    <div>
      <form className={styles.title_form} onSubmit={handleSubmit(onSubmitName)}>
        <TextInput
          id={"deckName"}
          placeholder={""}
          label={"デッキ名"}
          error={errors.deckName}
          defaultValue={deck?.name}
          autoComplete="off"
          {...register("deckName")}
          onChange={changeName}
        />
        <button className={styles.button} type="submit" disabled={isDisabled}>
          更新
        </button>
      </form>
    </div>
  );
};
