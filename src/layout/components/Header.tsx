import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from '@/layout/components/header.module.scss';

const cx = classNames.bind(styles)

export const Header = () => {
  const pathname = useLocation().pathname;
  const currentPage = pathname.split("/")[1];

  const top = cx({
    link: true,
    current: currentPage === ""
  })
  const deck = cx({
    link: true,
    current: currentPage === "deck"
  })
  const create = cx({
    link: true,
    current: currentPage === "create"
  })
  const compare = cx({
    link: true,
    current: currentPage === "compare"
  })
  
  return (
    <header className={styles.header_container}>
      <div className={styles.nav_container}>
        <Link className={top} to={"/"}>TOP</Link>
        <Link className={deck} to={'/deck'}>デッキ一覧</Link>
        <Link className={create} to={'/create'}>デッキ登録</Link>
        <Link className={compare} to={'/compare'}>比較</Link>
      </div>
    </header>
  );
};
