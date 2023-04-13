import { Store } from '@/constants/constants';
import Space from '@/types/space';
import { useLiveQuery } from 'dexie-react-hooks';
import React, { useState } from 'react';
import db from '../../../database.config';
import styles from './parking-list.module.css';
import classNames from 'classnames';
import { isArrayValid, toCapitalize, validateInput } from '@/utils/utils';
import useIndexedDb from '@/hooks/use-indexed-db';
import Vehicle from '@/types/vehicle';
import Input from '../input/input';
import Cross from '@/icons/cross.svg';
import Image from 'next/image';
import { useSelectedLevel } from '@/contexts/level-context';
// import Icon from '../icon-generator/icon';

const ParkingList = () => {
    const { selectedLevel } = useSelectedLevel();
    const spaces = useLiveQuery<Space[]>(
        () => db.table(Store.Spaces).where({ level: selectedLevel }).toArray(),
        [selectedLevel]
    );
    const { addData, findFirstWhere, removeData } = useIndexedDb<Vehicle>(Store.Vehicles);
    const {
        editData,
        findFirstWhere: findFirstSpaceWhere,
        removeData: removeSpaceData,
    } = useIndexedDb<Space>(Store.Spaces);
    const [spaceIdOfInput, setSpaceIdOfInput] = useState(0);
    const [inputPlate, setInputPlate] = useState('');

    const exitVehicle = async (spaceId: number, licensePlate: string) => {
        const vehicleWithLicensePlate = await findFirstWhere({ licensePlate });

        if (!vehicleWithLicensePlate?.licensePlate) {
            alert(`Can't find vehicle with plate: ${licensePlate}`);
            return;
        }

        await removeData(vehicleWithLicensePlate?.licensePlate);
        await editData(spaceId, { vehicle: '' });
    };

    const enterVehicle = async (space: Space, licensePlate: string) => {
        if (!validateInput({ licensePlate })) return;

        const existingSpaceWithVehicle = await findFirstSpaceWhere({ vehicle: licensePlate });

        if (existingSpaceWithVehicle) {
            alert(`Vehicle with plate: ${licensePlate} has already been entered in a different space`);
            return;
        }

        setSpaceIdOfInput(0);
        await addData({ type: space.type, licensePlate });
        await editData(space.id!, { vehicle: licensePlate });
    };

    const onDeleteButtonClick = async (space: Space) => {
        const isConfirmedDelete = confirm(`Do you want to delete space named ${`L${space.level}-${space.id}?`}`);

        if (isConfirmedDelete) {
            await removeSpaceData(space.id!);
            await removeData(space.vehicle);
        }
    };

    const renderButtons = (space: Space) => {
        if (space.vehicle) return <button onClick={() => exitVehicle(space.id!, space.vehicle!)}>Exit</button>;

        return <button onClick={() => setSpaceIdOfInput(space.id!)}>Enter</button>;
    };

    const renderInputOrButtons = (space: Space) => {
        if (spaceIdOfInput === space.id)
            return (
                <>
                    <Input
                        label={''}
                        value={inputPlate}
                        id={`${space}-${space.id}-input`}
                        onChange={(_, value) => setInputPlate(value)}
                    />
                    <button onClick={() => enterVehicle(space, inputPlate)}>Enter</button>
                </>
            );

        return renderButtons(space);
    };

    return (
        <section className={styles.parkingList}>
            {spaces?.map((space) => {
                return (
                    <article
                        key={`space-${space.id}`}
                        className={classNames(styles.parkingSpace, {
                            [styles.occupied]: space.vehicle,
                        })}
                    >
                        <button className={styles.deleteButton} onClick={() => onDeleteButtonClick(space)}>
                            <Image src={Cross} alt="cross" width={20} height={20} />
                        </button>

                        <div className={styles.parkingSpaceHeader}>
                            <h1>
                                {`L${space.level}`}-{space.id}
                            </h1>
                            {/* <Icon type={space.type} /> */}
                            <p>{space.vehicle && 'Occupied'}</p>
                        </div>

                        <div className={styles.parkingSpaceBody}>
                            <h2>
                                <em>{space.vehicle || ''}</em>
                            </h2>
                            <p>{toCapitalize(space.type)}</p>
                            {renderInputOrButtons(space)}
                        </div>
                    </article>
                );
            })}

            {!isArrayValid(spaces) && <p>No spaces added to this level yet</p>}
        </section>
    );
};

export default ParkingList;
