export type Job = {
  id: string
  title: string
  description?: string
  location?: string
  type?: string
  status?: string
  stages?: string[]
  recruiter_id?: string
  created_at?: string
  updated_at?: string
}

export type UpsertJobRequest = {
  title: string
  description?: string
  location?: string
  type?: string
  status?: string
  stages?: string[]
}

export type JobSearchParams = {
  q?: string
  location?: string
  type?: string
  status?: string
}
