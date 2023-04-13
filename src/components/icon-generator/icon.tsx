import { VehicleType } from '@/constants/constants';
import Image from 'next/image';
import Car from '@/icons/car.svg';
import Scooter from '@/icons/scooter.svg';

const getVehicleTypeIcon = (type: VehicleType) => {
    switch (type) {
        case VehicleType.Car:
            return Car;
        case VehicleType.Motorbike:
            return Scooter;
        default:
            return undefined;
    }
};

const Icon = ({ type }: { type: VehicleType }) => {
    return (
        <Image
            // className={styles.icon}
            src={getVehicleTypeIcon(type)}
            alt={`This is an icon of ${type}`}
            width={20}
            height={20}
        />
    );
};

export default Icon;
