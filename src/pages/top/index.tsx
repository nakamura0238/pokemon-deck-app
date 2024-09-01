import React from "react";
import { Link } from "react-router-dom";
import styles from "./top.module.scss";

export const Top = () => {
  return (
    <div className={styles.top_layout}>
      <div className={styles.top_container}>
        <div className={styles.discription_container}>
          <h1>ポケモンカード用ツール</h1>
          <p>デッキレシピの作成と、デッキレシピの比較が行えるツールです。</p>
        </div>

        <div className={styles.link_container}>
          <Link className={styles.primary} to={"/create"}>デッキ登録</Link>
          <Link className={styles.primary} to={"/deck"}>デッキ一覧</Link>
          <Link className={styles.primary} to={"/compare"}>比較</Link>
        </div>

        <div className={styles.notice_container}>
          <p className={styles.notice_label}>注意</p>
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
