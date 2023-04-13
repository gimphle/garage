import React, { HTMLInputTypeAttribute } from 'react';

type InputProps = {
    label: string;
    value: any;
    id: string;
    type?: HTMLInputTypeAttribute;
    onChange: (id: string, value: any) => void;
};

const Input = ({ type = 'text', ...props }: InputProps) => {
    return (
        <>
            <label htmlFor={props.id} hidden>
                {props.label}
            </label>
            <input
                type={type}
                name={props.id}
                value={props.value}
                placeholder={props.label}
                min={1}
                onChange={(e) =>
                    props.onChange(
                        e.target.name,
                        type === 'number' && e.target.value ? Number(e.target.value) : e.target.value
                    )
                }
            />
        </>
    );
};

export default Input;
