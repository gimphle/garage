import { Store } from '@/constants/constants';
import Level from '@/types/level';
import Space from '@/types/space';
import Vehicle from '@/types/vehicle';
import Dexie, { Table } from 'dexie';

export class MySubClassedDexie extends Dexie {
    // We just tell the typing system this is the case
    [Store.Levels]!: Table<Level>;
    [Store.Spaces]!: Table<Space>;
    [Store.Vehicles]!: Table<Vehicle>;

    constructor() {
        super('myDb');
        this.version(1).stores({
            [Store.Levels]: 'number',
            [Store.Spaces]: '++id, vehicle, level, type, [vehicle+type]',
            [Store.Vehicles]: 'licensePlate, type',
        });
        this.on('populate', function (transaction) {
            transaction.table(Store.Levels).add({ number: 1 });
        });
    }
}

const db = new MySubClassedDexie();

export default db;
