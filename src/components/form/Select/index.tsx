import React, {forwardRef} from 'react';
import {FieldError} from 'react-hook-form';
import classNames from "classnames/bind"
import styles from '@/components/form/Select/select.module.scss';
import { cardTypesArray } from '@/db/db';
import caretDown from '@/assets/caret-down.svg';

interface Props extends React.ComponentPropsWithRef<'select'> {
  id: string;
  label: string;
  error: FieldError | undefined;
}

const cx = classNames.bind(styles)

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({
    id,
    label,
    error,
    ...props
  }, ref) => {

    const selectClassNames = cx({
      form_input: true,
      form_input_error: !!error?.message,
      select: true,
    })
    return (
      <div className={styles.input_box}>
        <div className={styles.label_box}>
          <label htmlFor={id}>{label}</label>
          {error && (
            <span className={styles.error_message}>{error.message}</span>
          )}
        </div>
        <select
          id={id}
          className={selectClassNames}
          style={{backgroundImage: `url(${caretDown})`}}
          defaultValue={1}
          {...props}
          ref={ref}
        >
          {cardTypesArray.map((val) => {
            return (
              <option key={val} value={val}>
                {val}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
);

Select.displayName = 'Select';
