import React, {useState} from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Register } from './register';

function App() {
  const [count, setCount] = useState(0);

  const fromDeck = {
    title: 'デッキA',
    deck: [
      {name: 'hoge', count: 4},
      {name: 'foo', count: 4},
      {name: 'bar', count: 2},
      {name: 'piyo', count: 4},
    ],
  };

  const toDeck = {
    title: 'デッキB',
    deck: [
      {name: 'hoge', count: 4},
      {name: 'foo', count: 2},
      {name: 'bar', count: 4},
      {name: 'fuga', count: 4},
    ],
  };

  type matchListItem = {
    name: string;
    count: number;
  };

  type resultItem = {
    from: matchListItem | undefined;
    to: matchListItem | undefined;
    move: {
      count: number;
      lack: number;
    };
  };

  const generateCardList = () => {
    const matchList: Array<matchListItem>[] = [];
    const mismatchFromList: [matchListItem, undefined][] = [];
    const mismatchToList: [undefined, matchListItem][] = [];
    const resultList: Array<resultItem> = [];

    // fromDeck から toDeck を比較
    fromDeck.deck.map((fromItem) => {
      // 一致するもの  ： matchList
      // 一致しないもの： mismatchFromList
      const findToItem = toDeck.deck.find(
        (toDeckVal) => toDeckVal.name == fromItem.name
      );
      if (findToItem) matchList.push([fromItem, findToItem]);
      else mismatchFromList.push([fromItem, undefined]);
    });

    // toDeck から matchList にないものを抽出し mismatchToList に格納
    toDeck.deck.map((toItem) => {
      const findToItem = matchList.find(
        (matchListItem) => matchListItem[0]?.name == toItem.name
      );
      if (!findToItem) mismatchToList.push([undefined, toItem]);
    });

    // resultList
    matchList.forEach((items) => {
      const fromItem = items[0];
      const toItem = items[1];

      const moveObj = {
        count: 0,
        lack: 0,
      };
      if (toItem.count > fromItem.count) {
        moveObj.count = fromItem.count;
        moveObj.lack = toItem.count - fromItem.count;
      } else {
        moveObj.count = toItem.count;
      }

      resultList.push({
        from: fromItem,
        to: toItem,
        move: moveObj,
      });
    });

    mismatchFromList.forEach((items) => {
      resultList.push({
        from: items[0],
        to: items[1],
        move: {
          count: 0,
          lack: 0,
        },
      });
    });
    mismatchToList.forEach((items) => {
      resultList.push({
        from: items[0],
        to: items[1],
        move: {
          count: 0,
          lack: 0,
        },
      });
    });
    console.log('resultList: ', resultList);

    return resultList;
  };

  const res = generateCardList();

  return (
    <>
      {res.map((val, i) => {
        const from = val.from;
        const to = val.to;
        const move = val.move;
        return (
          // コンポーネント作成する
          <div key={i}>

            {/* <span>
              <span>{from.name}</span>：<span>{from.count}</span>
            </span>
            <span>
              ＞<span>{move.count}</span>：<span>{move.lack}</span>＞
            </span>
            <span>
              <span>{to.name}</span>：<span>{to.count}</span>
            </span> */}
          </div>
        );
      })}
    </>
  );
}

export default App;
