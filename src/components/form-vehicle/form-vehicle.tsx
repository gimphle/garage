import { Store, VehicleType } from '@/constants/constants';
import useIndexedDb from '@/hooks/use-indexed-db';
import Vehicle from '@/types/vehicle';
import { getSuccessMessage, handleChange } from '@/utils/utils';
import React, { useState } from 'react';
import TypeDropdown from '../type-dropdown/type-dropdown';
import Input from '../input/input';
import Space from '@/types/space';
import Button from '../button/button';
import { useSelectedLevel } from '@/contexts/level-context';

const FormVehicle = () => {
    const [vehicle, setVehicle] = useState<Vehicle>({
        licensePlate: '',
        type: VehicleType.Car,
    });
    const { addData, removeData } = useIndexedDb(Store.Vehicles);
    const { editData, findFirstWhere } = useIndexedDb<Space>(Store.Spaces);
    const { selectedLevel } = useSelectedLevel();

    const onChange = handleChange(setVehicle);

    const registerVehicle = async () => {
        const firstAvailableSpace = await findFirstWhere({ type: vehicle.type, vehicle: '' });

        if (!firstAvailableSpace) {
            alert(`No space left for vehicle type: ${vehicle.type}`);
            return;
        }

        const firstSpaceWithVehicle = await findFirstWhere({ vehicle: vehicle.licensePlate });

        if (firstSpaceWithVehicle) {
            alert(`Vehicle with plate: ${vehicle.licensePlate} has already been entered in a different space`);
            return;
        }

        await addData(vehicle);
        await editData(firstAvailableSpace.id!, {
            vehicle: vehicle.licensePlate,
        });

        if (selectedLevel !== firstAvailableSpace.level) {
            alert(
                getSuccessMessage(
                    `Entered vehicle ${vehicle.licensePlate} to space L${firstAvailableSpace.level}-${firstAvailableSpace.id}`
                )
            );
        }
    };

    const exitVehicle = async (plate: string) => {
        await removeData(plate);

        const occupiedSpace = await findFirstWhere({ vehicle: vehicle.licensePlate });

        if (!occupiedSpace?.id) {
            alert(`Can't find any occupied space with ${vehicle.type} license plate: ${vehicle.licensePlate}`);
            return;
        }

        await editData(occupiedSpace.id, { vehicle: '' });

        if (selectedLevel !== occupiedSpace.level) {
            alert(getSuccessMessage(`Exited vehicle ${plate} from space L${occupiedSpace.level}-${occupiedSpace.id}`));
        }
    };

    return (
        <form className="df-fxdc">
            <h2>Enter/Exit vehicle</h2>
            <sub>Vehicles entered this way will be registered to any available spaces across the floors</sub>
            <TypeDropdown onChange={onChange} />

            <Input label="License Plate" value={vehicle.licensePlate} id="licensePlate" onChange={onChange} />
            <div className="df g-5">
                <Button onClick={registerVehicle}>Enter</Button>
                <Button onClick={() => exitVehicle(vehicle.licensePlate)}>Exit</Button>
            </div>
        </form>
    );
};

export default FormVehicle;
