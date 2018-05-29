import { AbstractcBaseEntity, field, entity } from '../../packages/mainboard'

@entity('Device')
export class Device extends AbstractcBaseEntity {
  @field() private model: string
  @field() private appVersion: string
  @field() private systemName: string
  @field() private systemVersion: string
}
@entity('Patient')
export class Patient extends AbstractcBaseEntity {
  @field() private _id: string
  @field() private mobile: string
  @field() private avatar: string
  @field() private isBound: boolean
  @field(Device) private device: Device
}
