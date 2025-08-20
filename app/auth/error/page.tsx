"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "access_denied":
        return "Accès refusé. Vous avez annulé la connexion."
      case "server_error":
        return "Erreur serveur. Veuillez réessayer plus tard."
      case "temporarily_unavailable":
        return "Service temporairement indisponible."
      default:
        return errorDescription || "Une erreur d'authentification s'est produite."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-600 p-3 rounded-full">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">Erreur d'authentification</CardTitle>
          <CardDescription>Un problème est survenu lors de la connexion</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Alert variant="destructive">
            <AlertDescription>{getErrorMessage(error)}</AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Link href="/auth/login">
              <Button className="w-full bg-green-600 hover:bg-green-700">Retour à la connexion</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button variant="outline" className="w-full bg-transparent">
                Créer un compte
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
