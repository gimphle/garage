import { VehicleType } from '@/constants/constants';
import Dropdown from '../dropdown/dropdown';

type TypeDropdownProps = {
    onChange: (id: string, value: any) => void;
};

const TypeDropdown = ({ onChange }: TypeDropdownProps) => {
    return (
        <Dropdown label={'Select vehicle type'} id={'type'} defaultOption={'Vehicle type'} onChange={onChange}>
            {Object.entries(VehicleType).map(([key, value]) => (
                <option value={value} key={key}>
                    {key}
                </option>
            ))}
        </Dropdown>
    );
};

export default TypeDropdown;
