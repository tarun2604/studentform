import { useState } from 'react'
import { Container, CssBaseline } from '@mui/material'
import Login from './components/Login'
import DynamicForm from './components/DynamicForm'
import { FormResponse } from './types/form'

function App() {
  const [formData, setFormData] = useState<FormResponse | null>(null)

  const handleLoginSuccess = (data: FormResponse) => {
    setFormData(data)
  }

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      {!formData ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <DynamicForm formData={formData} />
      )}
    </Container>
  )
}

export default App
