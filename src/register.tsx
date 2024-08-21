import React, {useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {SubmitHandler, useForm} from 'react-hook-form';
import * as z from 'zod';

const cardSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  count: z.coerce
    .number()
    .min(1, '1枚以上必要です')
    .max(4, '4枚以下にしてください'),
  type: z.coerce.number(),
});

/**
 * name : string
 * count: number
 * have : number
 * type : number
 */

type deck = {
  title: string;
};

type Inputs = {
  name: string;
  count: number;
  type: number;
};

export const Register = () => {
  const [deckTitle, setDeckTitle] = useState('');
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<Inputs>({
    // zodResolver関数を使って、バリデーション用のリゾルバを作成し、
    // そのまま作成したリゾルバを渡します
    resolver: zodResolver(cardSchema),
  });

  const onSubmitCard = (data: Inputs) => {
    const CARDLIST_KEY = 'cardList';
    let cardList = [];

    const check = localStorage.getItem(CARDLIST_KEY);
    if (check === null) localStorage.setItem(CARDLIST_KEY, []);

    const storage = localStorage.getItem(CARDLIST_KEY);
    if (storage) cardList = JSON.parse(storage);

    const matchItem = cardList.find((val) => val.name === data.name);
    if (matchItem === undefined) {
      const cardItem = {
        name: data.name,
        type: data.type,
      };
      cardList.push(cardItem);
      localStorage.setItem(CARDLIST_KEY, JSON.stringify(cardList));
    }
  };

  return (
    <div>
      <p>登録ページ</p>
      <input
        type="text"
        placeholder="デッキ名"
        value={deckTitle}
        onChange={(e) => setDeckTitle(e.currentTarget.value)}
      />
      {deckTitle.length > 0 ?
      <form onSubmit={handleSubmit(onSubmitCard)}>
        <input type="text" placeholder="カード名" {...register('name')} />
        {errors.name && <span>{errors.name.message}</span>}

        <input type="number" placeholder="必要枚数" {...register('count')} />
        {errors.count && <span>{errors.count.message}</span>}

        <input type="number" placeholder="カードタイプ" {...register('type')} />
        {errors.type && <span>{errors.type.message}</span>}

        <button type="submit">送信</button>
      </form> : undefined
      }
    </div>
  );
};
