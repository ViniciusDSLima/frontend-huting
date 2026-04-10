import type { Job } from '@/features/jobs/types'

export type Application = {
  id: string
  job_id?: string
  candidate_id?: string
  status?: string
  stage?: string
  notes?: string
  job?: Job
  candidate?: {
    email?: string
    name?: string
  }
}
