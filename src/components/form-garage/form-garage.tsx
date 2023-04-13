import { Store, VehicleType } from '@/constants/constants';
import useIndexedDb from '@/hooks/use-indexed-db';
import Level from '@/types/level';
import { getSuccessMessage, handleChange, isArrayValid, validateInput } from '@/utils/utils';
import React, { useState } from 'react';
import TypeDropdown from '../type-dropdown/type-dropdown';
import Input from '../input/input';
import Space from '@/types/space';
import LevelDropdown from '../level-dropdown/level-dropdown';
import Button from '../button/button';
import Vehicle from '@/types/vehicle';
import { useSelectedLevel } from '@/contexts/level-context';

const FormGarage = () => {
    const [level, setLevel] = useState<Level>({ number: 1 });
    const [space, setSpace] = useState({
        type: VehicleType.Car,
        total: 0,
        level: 1,
    });

    const { addData, removeData, findFirstWhere } = useIndexedDb(Store.Levels);
    const { bulkAddData, bulkRemoveData: bulkRemoveSpaces, findArrayWhere } = useIndexedDb<Space>(Store.Spaces);
    const { bulkRemoveData: bulkRemoveVehicles } = useIndexedDb<Vehicle>(Store.Vehicles);
    const { resetLevel } = useSelectedLevel();

    const onChangeLevel = handleChange(setLevel);
    const onChangeSpace = handleChange(setSpace);

    const createLevel = async () => {
        if (!validateInput(level)) return;

        const isLevelAlreadyAdded = await findFirstWhere({ number: level.number });

        if (isLevelAlreadyAdded) {
            alert(`Level ${level.number} is already added`);
            return;
        }

        await addData(level);
        alert(getSuccessMessage(`Added level ${level.number}`));
    };

    const deleteLevel = async () => {
        if (!validateInput(level)) return;
        if (level.number === 1) {
            alert(`Can't delete level 1`);
            return;
        }

        const isConfirmedDeleteLevel = confirm(`Do you want to delete level ${level.number}`);
        if (!isConfirmedDeleteLevel) return;

        const firstFoundLevel = await findFirstWhere({ number: level.number });

        if (!firstFoundLevel) {
            alert(`Level ${level.number} has not been added yet`);
            return;
        }

        const spacesWithDeletedLevel = await findArrayWhere({ level: level.number });
        const idsOfDeletedSpaces = spacesWithDeletedLevel?.map((space) => space.id!);
        const vehiclesOfDeletedSpaces = spacesWithDeletedLevel?.map((space) => space.vehicle!);

        await removeData(level.number!);

        if (isArrayValid(idsOfDeletedSpaces)) {
            await bulkRemoveSpaces(idsOfDeletedSpaces!);
        }

        if (isArrayValid(vehiclesOfDeletedSpaces)) {
            await bulkRemoveVehicles(vehiclesOfDeletedSpaces!);
        }

        resetLevel();
        alert(getSuccessMessage(`Deleted level ${level.number} and all of its spaces and occupying vehicles`));
    };

    const addSpaces = async () => {
        if (!validateInput(space)) return;

        await bulkAddData(space.total!, { type: space.type, level: space.level!, vehicle: '' } as Space);
        alert(getSuccessMessage(`Added ${space.total} space(s) on level ${space.level} for type ${space.type}`));
    };

    return (
        <form>
            {/* Level */}
            <div className="df-fxdc">
                <h2 className="mt-0">Create/Delete level</h2>
                <Input type="number" label="Level number" value={level.number} id="number" onChange={onChangeLevel} />
                <div className="df g-5">
                    <Button onClick={createLevel}>Create</Button>
                    <Button onClick={deleteLevel}>Delete</Button>
                </div>
            </div>

            {/* Maximum Space */}
            <div className="df-fxdc">
                <h2>Add space to parking level</h2>
                <TypeDropdown onChange={onChangeSpace} />
                <LevelDropdown onChange={onChangeSpace} />
                <Input
                    type="number"
                    label="Total space to be added"
                    value={space.total}
                    id="total"
                    onChange={onChangeSpace}
                />
                <Button onClick={addSpaces}>Create</Button>
            </div>
        </form>
    );
};

export default FormGarage;
