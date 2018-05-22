import { injectable } from 'inversify'
import 'reflect-metadata'
import { IMessage, DataType } from './IMessage'

/**
 * 消息类，用于结构化消息体
 */
@injectable()
export class Message<T> implements IMessage {
  private _channel: string
  private _topic: string
  //private _data: T[]
  private _data: T
  private _messageType: DataType
  // private _handleMethod:string;
  // private _filterMethod:string;

  constructor() {
    this._channel = ''
    this._topic = ''
    //this._data = []
    this._data = undefined
    this._messageType = DataType.Entity
    // this._handleMethod ="";
    // this._filterMethod = "";
  }
  public get Channel(): string {
    return this._channel
  }

  public set Channel(value: string) {
    this._channel = value
  }

  public get Topic(): string {
    return this._topic
  }

  public set Topic(value: string) {
    this._topic = value
  }

  public get Data(): T {
    return this._data
  }

  public set Data(value: T) {
    this._data = value
  }

  public get MessageType(): DataType {
    return this._messageType
  }

  public set MessageType(value: DataType) {
    this._messageType = value
  }
}
