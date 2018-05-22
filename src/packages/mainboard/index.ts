import { AbstractcBaseEntity } from './BaseEntity'
import { field, entity } from './Decorator/EntityDecorator'
import { RepositoryFactory } from './Repository/RepositoryFactory'
import { withMessageBus } from './MapToStream/withMessageBus'
import { compose } from './MapToStream/compose'
import { withDefaults } from './MapToStream/withDefaults'
import { withState } from './MapToStream/withState'

export default {
  field,
  entity,
  RepositoryFactory,
  withMessageBus,
  compose,
  withDefaults,
  withState,
  AbstractcBaseEntity,
}
export { ObjectLiteral, IEntityConstructor } from './BaseEntity'
