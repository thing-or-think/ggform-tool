import { useQuery } from '@tanstack/react-query'
import { api } from './services/api'

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await api.get('/health')
      return res.data
    }
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Backend connection failed</p>

  return (
    <div>
      <h1>GGForm Tool</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default App