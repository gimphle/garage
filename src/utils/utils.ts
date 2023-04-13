export const handleChange = <T>(setState: React.Dispatch<React.SetStateAction<T>>) => {
    const returnFunc = (id: string, value: any) => {
        setState((prev) => {
            const newState = { ...prev };
            newState[id as keyof T] = value;

            return newState;
        });
    };
    return returnFunc;
};

export const validateInput = <T extends object>(object: T): boolean => {
    const objectKeys = Object.keys(object);

    for (const key of objectKeys) {
        if (!object[key as keyof T] || object[key as keyof T] <= 0) {
            alert(`Validation error!\nInput of field ${key} is invalid`);
            return false;
        }
    }

    return true;
};

export const withHandler = async <T>(func: Function): Promise<T | undefined> => {
    try {
        const res = await func();
        console.log(res);
        return res;
    } catch (e) {
        alert(e);
    }
};

export const toCapitalize = (str: string): string => {
    const newString = `${str[0].toUpperCase()}${str.slice(1)}`;
    return newString;
};

export const getSuccessMessage = (str: string): string => {
    return `Success!\n${str}`;
};

export const isArrayValid = (arr?: any[]): boolean => {
    if (!arr) return false;

    return Array.isArray(arr) && !!arr.length;
};
