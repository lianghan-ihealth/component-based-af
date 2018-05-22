export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> }
export interface ObjectLiteral {
  [key: string]: any
}
export abstract class AbstractcBaseEntity implements ObjectLiteral {
  //abstract id: string
}
export abstract class AbstractcBaseEntityForMemory implements ObjectLiteral {
  abstract id: string
}
export interface IEntityConstructor<T> {
  new (): T
  // name:string;
  //create<T>(ctor: { new(): T }):T
}

// export class EntityConstructor<T extends AbstractcBaseEntity> implements IEntityConstructor<T>{
//     public create<T>(ctor: { new(): T }) {
//         return new ctor();
//     }
// }

// export interface NewableEntity<T> {
//     new(): T;
// }
// export class NewableEntity<T> implements NewableEntity<T> {
//     // ...
// }
