import { injectable } from 'inversify'
import 'reflect-metadata'
import { map, remove, matches, filter } from 'lodash'
import { IEntityManager } from './IEntityManager'
import { AbstractcBaseEntityForMemory } from '../BaseEntity'
/**
 * 管理持久实体数据池
 */
@injectable()
export class MemoryEntityManager<T extends AbstractcBaseEntityForMemory>
  implements IEntityManager<T> {
  private _entities: Array<T>

  constructor() {
    this._entities = new Array<T>()
  }
  public get Entities(): Array<T> {
    return this._entities
  }

  public findById(id: string): T {
    return this._entities.filter(value => {
      value.id == id
    })[0]
  }
  public findByIds(ids: string[]): T[] {
    return this._entities.filter(value => {
      return (
        ids.findIndex(id => {
          return id == value!.id
        }) !== -1
      )
    })
  }
  public find(conditions: Partial<T>): T[] {
    return filter(this._entities, matches(conditions))
  }
  public updateById(id: string, partialEntity: Partial<T>): T {
    let entity = this._entities.find(value => {
      return value!.id == id
    })
    let merged = Object.assign({}, entity, partialEntity)
    let index = this._entities.findIndex(value => {
      return value!.id == id
    })
    this._entities[index] = merged
    return merged
  }
  public update(conditions: Partial<T>, partialEntity: Partial<T>): T[] {
    this._entities = map(this._entities, value => {
      if (matches(conditions)(value)) {
        return Object.assign({}, value, partialEntity)
      }
      return value
    })
    return this._entities
  }
  public deleteById(id: string): T {
    const entities = remove(this._entities, value => value.id == id)
    return entities[0]
  }
  public delete(conditions: Partial<T>): T[] {
    const entities = remove(this._entities, matches(conditions))
    return this._entities
  }
  public save(entities: T[]) {
    this._entities = this._entities.concat(entities)
  }
  public clear() {
    this._entities = new Array<T>()
  }
}
