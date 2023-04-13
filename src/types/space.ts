import { VehicleType } from '@/constants/constants';

type Space = {
    id?: number;
    vehicle: string;
    level: number;
    type: VehicleType;
};

export default Space;
