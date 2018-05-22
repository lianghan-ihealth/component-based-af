import { AbstractcBaseEntity } from "../BaseEntity";


export interface IEntityManager <T extends AbstractcBaseEntity>{
    findById(id:string):T;
    findByIds(ids:string[]):T[];
    find(conditions:Partial<T>):T[];
    updateById(id:string,partialEntity:Partial<T>):T;
    update(conditions:Partial<T>,partialEntity:Partial<T>):T[];
    deleteById(id:string):T;
    delete(conditions:Partial<T>):T[];
    save(entities:T[]):void;
    clear():void;
    Entities:Array<T>;
}