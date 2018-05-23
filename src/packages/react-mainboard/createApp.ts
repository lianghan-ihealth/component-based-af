import App from './App'
export class AppOptions {
  appName: string
  values?: Map<string, any>
}
export function createApp(options: AppOptions): App {
  const app = new App()
  //console.log('test')
  //app.Name = options.appName
  if (options.values) {
    app.Values = options.values
  }
  return app
}
