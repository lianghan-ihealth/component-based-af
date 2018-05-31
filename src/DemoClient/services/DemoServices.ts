import { Patient, Device } from '../entities/index'
import { RepositoryFactory } from '../../packages/mainboard'

export class DemoServices {
  public getPatient() {
    const rf = new RepositoryFactory()
    const graphqlRepo = rf.createGraphQLRespository<Patient>(Patient)
    const p = graphqlRepo.find(
      { patientId: 'patient2' },
      { from: 'patient', queryName: 'getUserByIds' }
    )
  }
  public getAddMessage() {
    const rf = new RepositoryFactory()
    const graphqlRepo = rf.createGraphQLRespository<Patient>(Patient)
    graphqlRepo.execQuery(`query Messages {
      patient(patientId: "patient6") {
        _id
        fullName
        # avator
        boundDetails {
          chatRoom {
            _id
            messages {
              sender {
                _id
                avatar
              }
              type: __typename
              createdAt
              ... on TextMessage {
                text
                _id
              }
            }
          }
        }
      }
    }`)
    const p = graphqlRepo.execsubscribe(
      `subscription chatMessageAdded {
      chatMessageAdded(chatRoomId:"chatRoom1") {
        _id
        sender {
          _id
          avatar
        }
        ... on TextMessage {
          text
        }
        createdAt
      }
    }
`
    )
  }
}
