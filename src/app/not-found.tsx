import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
          Página no encontrada
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8">
          Lo sentimos, la página que buscas no existe.
        </p>
        <Button asChild>
          <Link href="/">
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  )
}