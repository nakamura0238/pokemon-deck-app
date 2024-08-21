import React from "react";
import { Link } from "react-router-dom";
import styles from "./top.module.scss";

export const Top = () => {
  return (
    <div className={styles.top_layout}>
      <div className={styles.top_container}>
        <p>ポケモンカード用ツール</p>

        <p>簡単にデッキレシピを作成できます</p>
        <p>登録したデッキを比較して、共通のカードを確認できます</p>

        <div className={styles.link_container}>
          <Link to={"/create"}>デッキ登録</Link>
          <Link to={"/deck"}>デッキ一覧</Link>
          <Link to={"/compare"}>比較</Link>
        </div>

        <div className={styles.notice_container}>
          <p>注意</p>
          <p>
            データはブラウザに保存されるため、デバイスごとに登録が必要になります
          </p>
          <p>
            他のデバイスで登録したデータを使用したい場合は、デッキレシピのエクスポート機能を使用してください
          </p>
        </div>
      </div>
    </div>
  );
};
