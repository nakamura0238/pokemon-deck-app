import React, {forwardRef} from 'react';
import styles from './textInput.module.scss';
import {FieldError} from 'react-hook-form';
import classNames from 'classnames/bind';

interface Props extends React.ComponentPropsWithRef<'input'> {
  id: string;
  placeholder: string;
  label: string;
  error: FieldError | undefined;
}

const cx = classNames.bind(styles);

export const TextInput = forwardRef<HTMLInputElement, Props>(
  ({id, placeholder, label, error, ...props}, ref) => {
    const inputClassNames = cx({
      form_input: true,
      form_input_error: !!error?.message,
    });

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
          type="text"
          placeholder={placeholder}
          autoComplete="off"
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';
