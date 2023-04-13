import { Store } from '@/constants/constants';
import { withHandler } from '@/utils/utils';
import db from '../../database.config';

const useIndexedDb = <T,>(store: Store) => {
    const table = db.table<T>(store);

    // Add
    const addData = async (object: T) => await withHandler(async () => await table.add(object));

    const bulkAddData = async (numbersToAdd: number, valueToAdd: T) =>
        await withHandler(async () => {
            const dataToBeAdded = Array(numbersToAdd).fill(valueToAdd);
            await table.bulkAdd(dataToBeAdded);
        });

    // Find
    const findCountWhere = async (criterias: Partial<T>) =>
        await withHandler<number>(async () => await table.where(criterias as { [key: string]: any }).count());

    const findFirstWhere = async (criterias: Partial<T>) =>
        await withHandler<T>(async () => await table.where(criterias as { [key: string]: any }).first());

    const findArrayWhere = async (criterias: Partial<T>) =>
        await withHandler<T[]>(async () => await table.where(criterias as { [key: string]: any }).toArray());

    // Delete
    const removeData = async (key: string | number) => await withHandler(async () => await table.delete(key));

    const bulkRemoveData = async (keys: string[] | number[]) =>
        await withHandler(async () => await table.bulkDelete(keys));

    // Update
    const editData = async (key: string | number, changes: Partial<T>) =>
        await withHandler(async () => await table.update(key, changes as { [keyPath: string]: any }));

    const functions = {
        addData,
        bulkAddData,
        editData,
        removeData,
        bulkRemoveData,
        findCountWhere,
        findFirstWhere,
        findArrayWhere,
    };

    return functions;
};

export default useIndexedDb;
