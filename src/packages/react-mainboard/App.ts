export default class App {
  private _name: string
  private _values: Map<string, any>
  public get Name() {
    return this._name
  }
  public set Name(value: string) {
    this.Name = value
  }
  public set Values(values: Map<string, any>) {
    this._values = values
  }
  public getValue(key: string) {
    return this._values.get(key)
  }
}
