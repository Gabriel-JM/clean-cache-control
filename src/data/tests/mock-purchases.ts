import { SavePurchases } from '@/domain/usecases'
import faker from 'faker'

const { random, date } = faker

export const mockPurchases = (): SavePurchases.Params[] => [
  {
    id: random.uuid(),
    date: date.recent(),
    value: random.number()
  },
  {
    id: random.uuid(),
    date: date.recent(),
    value: random.number()
  }
]