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
}
