export function enumToArray(theEnum): any[] {
    let retArray: any[];
    retArray = [];
    for (const enumMember in theEnum) {
        if (theEnum.hasOwnProperty(enumMember)) {
            const intVal = parseInt(enumMember, 10);
            const isValueProperty = intVal >= 0;
            if (isValueProperty) {
                retArray.push(theEnum[enumMember]);
            }
        }
    }
    return retArray;
}

export function enumValueIndex(enumVal: string, e: any): number {
    let idx = 0;
    for (const enumMember in e) {
        if (e.hasOwnProperty(enumMember)) {
            if (enumMember === enumVal) {
                break;
            }
            idx++;
        }
    }
    return idx;
}

export function enumToString<E>(enumMember: string, e: E): string {
    return e[enumMember];
}
