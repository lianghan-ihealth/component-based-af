import * as React from 'react'
import * as ReactDOM from 'react-dom'
import HocComponent from './components/demo'
import { createApp, Provider } from '../../packages/react-mainboard'
const app = createApp({ appName: 'demo' })
// ReactDOM.render(
//   <Provider app={app}>
//     <HocComponent />
//   </Provider>,
//   document.getElementById('example')
// )
ReactDOM.render(<HocComponent />, document.getElementById('example'))
