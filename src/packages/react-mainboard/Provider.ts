import * as React from 'react'
import App from './App'

interface Props {
  app: App
}
export default class Provider extends React.Component<Props, any> {
  app: App

  getChildContext(): Props {
    return {
      app: this.app,
    }
  }
  constructor(props, context) {
    super(props, context)
    console.log(props.app)
    this.app = props.app
  }

  render() {
    return React.Children.only(this.props.children)
  }
}
