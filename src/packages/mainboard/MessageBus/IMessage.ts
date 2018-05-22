
/**
 * 消息数据类型枚举
 */
export enum DataType {
  Entity,
  ValueObject
}
/**
 * message interface
 */
export interface IMessage {
  Channel: string;
  Topic: string;
  Data: any;
  MessageType: DataType;
  // HandleMethod:string,
  // FilterMethod:string,
}
