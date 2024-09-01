import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./create.module.scss";
import { db } from "../../db/db";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { TextInput } from "@/components/form/TextInput";
import { exportDeckArray } from "@/types";
import toast from "react-hot-toast";

type Inputs = {
  name: string;
};

const deckNameSchema = z.object({
  name: z.string().refine((value) => {
    return Boolean(value.trim().length);
  }, "デッキ名は必須です"),
});

export const Create = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(deckNameSchema),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [jsonName, setJsonName] = useState<string>("");
  const [jsonData, setJsonData] = useState<exportDeckArray>([]);

  const createHandler: SubmitHandler<Inputs> = async (data: Inputs) => {
    const deckTitle = data.name;
    if (deckTitle.length > 0) {
      const id = await db.decks.add({
        name: deckTitle,
      });
      navigate(`/deck/${id}`);
    }
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.error("ファイルを選択して下さい");

      setJsonName("");
      setJsonData([]);
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      try {
        const json = JSON.parse(content as string);
        setJsonName(file.name);
        setJsonData(json);
      } catch (error) {
        console.error("JSONファイルを解析できませんでした。", error);
      }
    };
    reader.readAsText(file);
  };

  const importDecks = async () => {
    await Promise.all(
      jsonData.map(async (json) => {
        const deckId = await db.decks.add({
          name: json.deckName,
        });
        const insertItems = json.deckItems.map((item) => {
          return {
            deck_id: deckId,
            name: item.name,
            count: item.count,
            type: item.type,
            sort_num: item.sort_num,
          };
        });
        await db.deckItems.bulkAdd(insertItems);
      })
    );

    // jsonData.forEach(async (json) => {
    //   // デッキ名登録
    //   const checkDeckName = await db.decks
    //     .where("name")
    //     .equals(json.deckName)
    //     .toArray();

    //   console.info(checkDeckName);
    //   if (checkDeckName.length === 0) {
    //     const deckId = await db.decks.add({
    //       name: json.deckName,
    //     });
    //     console.info(deckId);
    //     const insertItems = json.deckItems.map((item) => {
    //       return {
    //         deck_id: deckId,
    //         name: item.name,
    //         count: item.count,
    //         type: item.type,
    //         sort_num: item.sort_num,
    //       };
    //     });
    //     await db.deckItems.bulkAdd(insertItems);
    //   } else {
    //     console.log("duplicate");
    //     errorCount = errorCount + 1;
    //   }
    //   return;
    // });

    // 終了の通知
    toast.success("インポートが完了しました");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setJsonName("");
    setJsonData([]);
  };

  return (
    <div className={styles.createDeck_layout}>
      <div className={styles.createDeck_container}>
        <div className={styles.page_title}>
          <p>デッキ登録</p>
        </div>
        <form
          className={styles.form_box}
          onSubmit={handleSubmit(createHandler)}
        >
          <TextInput
            id={"deckName"}
            placeholder={""}
            label={"デッキ名"}
            error={errors.name}
            {...register("name")}
          />
          <button type="submit" className={styles.button}>
            登録
          </button>
        </form>
      </div>

      <div className={styles.createDeck_container}>
        <div className={styles.page_title}>
          <p>デッキインポート</p>
        </div>
        <form className={styles.form_box}>
          <button
            type="button"
            className={styles.button}
            onClick={() => fileInputRef.current?.click()}
          >
            ファイルを選択
          </button>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={onSelectFile}
            style={{ display: "none" }}
          />
        </form>
        {jsonData.length > 0 ? (
          <div className={styles.import_box}>
            <p>{jsonName}</p>
            <button
              type="button"
              className={styles.button}
              onClick={() => importDecks()}
            >
              インポート
            </button>
          </div>
        ) : undefined}
      </div>
    </div>
  );
};
