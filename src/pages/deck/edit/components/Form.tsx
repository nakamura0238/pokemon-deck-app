import React, { useContext } from "react";
import { db } from "@/db/db";
import type { cardTypes } from "@/db/db";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./form.module.scss";
import { NumberInput } from "@/components/form/NumberInput";
import { TextInput } from "@/components/form/TextInput";
import { Select } from "@/components/form/Select";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import toast from "react-hot-toast";
import { editContext } from "..";

type Props = {
  id: number;
};

type Inputs = {
  name: string;
  count: number;
  type: cardTypes;
};

const itemSchema = z.object({
  name: z.string().min(1, "カード名は必須です"),
  count: z.coerce.number().min(1, "1枚以上必要です"),
  type: z.coerce.string(),
});

export const ItemForm: React.FC<Props> = ({ id }) => {
  const {
    checkArray,
    setCheckArray,
    selectedList,
    setSelectedList,
    resetFunc,
  } = useContext(editContext);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(itemSchema),
  });

  const watchType = watch("type");

  const onSubmitItem: SubmitHandler<Inputs> = async (data: Inputs) => {
    console.log(data);
    const tmpDeckItems = await db.deckItems
      .where("deck_id")
      .equals(id)
      .toArray();
    const matchItem = tmpDeckItems.find((val) => val.name === data.name);
    const itemCount = tmpDeckItems.length;

    if (matchItem === undefined) {
      // ない場合は追加する
      await db.deckItems.add({
        deck_id: id,
        name: data.name,
        count: data.count,
        type: data.type,
        sort_num: itemCount + 1,
      });
      reset({ name: "", count: 1 });
    } else {
      toast.error("同名のカードが登録されています");
    }
  };

  const countLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = 1;
    const max = watchType === "エネルギー" ? 60 : 4;
    if (parseInt(e.target.value) < min) {
      e.target.value = min.toString();
    } else if (parseInt(e.target.value) > max) {
      e.target.value = max.toString();
    }
  };

  /**
   * 削除処理
   */
  const handleDelete = async () => {
    await db.deckItems.bulkDelete(checkArray);
    resetFunc();
  };

  return (
    <aside className={styles.aside}>
      <div className={styles.aside_inner_add}>
        {checkArray.length < 1 ? (
          <form
            className={styles.form_container}
            onSubmit={handleSubmit(onSubmitItem)}
          >
            {/* カード種類 */}
            <Select
              id={"card_type"}
              label={"カード種類"}
              error={errors.type}
              {...register("type")}
            />

            {/* カード枚数 */}
            <NumberInput
              id={"card_count"}
              placeholder={"枚数"}
              label={"枚数"}
              onChangeHandler={countLimit}
              error={errors.count}
              min={1}
              max={watchType === "エネルギー" ? 60 : 4}
              {...register("count")}
            />

            {/* カード名 */}
            <TextInput
              id={"card_name"}
              label={"カード名"}
              placeholder={"カード名"}
              error={errors.name}
              {...register("name")}
            />

            <button type="submit" className={styles.primary}>
              追加
            </button>
          </form>
        ) : (
          <div className={styles.delete_container}>
            <p>選択したカードを削除</p>
            <div>
              <button
                type="button"
                className={styles.cancel}
                onClick={resetFunc}
              >
                リセット
              </button>
              <button
                type="button"
                className={styles.delete_enter}
                onClick={handleDelete}
              >
                削除
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
