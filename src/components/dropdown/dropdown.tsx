import { ReactNode } from 'react';

type DropdownProps = {
    label: string;
    id: string;
    defaultOption: string;
    onChange: (id: string, value: any) => void;
    children: ReactNode;
    isValueNumber?: boolean;
    value?: number;
};

const Dropdown = ({ onChange, children, defaultOption, id, label, value, isValueNumber = false }: DropdownProps) => {
    return (
        <>
            <label htmlFor={id} hidden>
                {label}
            </label>
            <select
                value={value}
                name={id}
                id={id}
                onChange={(e) => onChange(e.target.id, isValueNumber ? Number(e.target.value) : e.target.value)}
            >
                <option value="" disabled>
                    {defaultOption}
                </option>

                {children}
            </select>
        </>
    );
};

export default Dropdown;
