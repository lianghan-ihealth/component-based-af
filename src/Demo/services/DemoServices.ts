import { RepositoryFactory } from '../../packages/mainboard/Repository/RepositoryFactory'
import { Patient, Device } from '../entities/index'

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
