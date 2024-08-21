import React, {forwardRef} from 'react';
import {FieldError} from 'react-hook-form';
import classNames from "classnames/bind"
import styles from '@/components/form/NumberInput/numberInput.module.scss';

interface Props extends React.ComponentPropsWithRef<'input'> {
  id: string;
  placeholder: string;
  label: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: FieldError | undefined;
  min: number | string;
  max: number | string;
}

const cx = classNames.bind(styles)

export const NumberInput = forwardRef<HTMLInputElement, Props>(
  ({
    id,
    placeholder,
    label,
    min = 1,
    max = 4,
    onChangeHandler,
    error,
    ...props
  }, ref) => {

    const inputClassNames = cx({
      form_input: true,
      form_input_error: !!error?.message
    })
    return (
      <div className={styles.input_box}>
        <div className={styles.label_box}>
          <label htmlFor={id}>{label}</label>
          {error && (
            <span className={styles.error_message}>{error.message}</span>
          )}
        </div>
        <input
          id={id}
          className={inputClassNames}
          placeholder={placeholder}
          min={min}
          max={max}
          onChange={onChangeHandler}
          ref={ref}
          {...props}
          type="number"
          autoComplete="off"
          defaultValue={1}
        />
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';
