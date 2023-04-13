import { Store } from '@/constants/constants';
import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';
import db from '../../../database.config';
import Dropdown from '../dropdown/dropdown';

type LevelDropdownProps = {
    value?: number;
    onChange: (id: string, value: any) => void;
};

const LevelDropdown = ({ onChange, value }: LevelDropdownProps) => {
    const levels = useLiveQuery(() => db.table(Store.Levels).toArray(), []);

    return (
        <Dropdown
            value={value}
            label={'Select level'}
            id={'level'}
            defaultOption={'Level'}
            onChange={onChange}
            isValueNumber
        >
            {levels?.map((level) => (
                <option key={`level-${level.number}`} value={level.number}>
                    {level.number}
                </option>
            ))}
        </Dropdown>
    );
};

export default LevelDropdown;
