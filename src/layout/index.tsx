import React from 'react';
import {Link, Outlet} from 'react-router-dom';
import {Header} from './components/Header';
import styles from "@/layout/layout.module.scss"

export function AppLayout() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <Outlet />
      </div>
    </>
  );
}
