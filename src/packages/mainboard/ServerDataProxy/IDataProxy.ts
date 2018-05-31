export interface IDataProxy {
  query(options: any): Promise<any>
  update(options: any): Promise<any>
  delete(options: any): Promise<any>
  insert(options: any): Promise<any>
  subscribe(options: any, callbackFun: any)
}
