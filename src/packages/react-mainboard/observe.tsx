import * as React from 'react'
import { Observable } from 'rxjs/Observable'
//import { get } from 'lodash'

export default function observe(fn) {
  return Component => {
    class ComponentFromStream extends React.Component {
      state = { streamProps: {} }
      subscription: any
      props$ = fn()

      componentWillMount() {
        this.subscription = this.props$.subscribe({
          next: props => {
            // if (props) {
            //   console.log('props: ', get(props, 'getUserByIds'))
            // }
            this.setState({ streamProps: props })
          },
        })
      }
      componentWillReceiveProps(nextProps) {
        this.setState({ streamProps: nextProps })
      }
      shouldComponentUpdate(nextProps, nextState) {
        return nextState.streamProps !== this.state.streamProps
      }
      componentWillUnmount() {
        this.subscription.unsubscribe()
      }
      render(): JSX.Element {
        const { streamProps } = this.state
        return (
          <div>
            <Component {...streamProps} />
          </div>
        )
      }
    }
    return ComponentFromStream
  }
}
