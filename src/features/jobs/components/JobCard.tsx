import { Link } from 'react-router-dom'
import type { Job } from '@/features/jobs/types'
import { Card } from '@/shared/components/Card'

export function JobCard({ job }: { job: Job }) {
  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Link
        to={`/vagas/${job.id}`}
        style={{ fontWeight: 600, fontSize: '1.05rem', color: '#0f172a' }}
      >
        {job.title}
      </Link>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 14, color: '#64748b' }}>
        {job.location ? <span>{job.location}</span> : null}
        {job.type ? <span>· {job.type}</span> : null}
        {job.status ? <span>· {job.status}</span> : null}
      </div>
    </Card>
  )
}
