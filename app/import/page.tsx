"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Student {
  student_number: string
  first_name: string
  last_name: string
  email?: string
  class_name?: string
  birth_date?: string
}

export default function ImportPage() {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.name.endsWith(".csv")) {
      setErrors(["Seuls les fichiers CSV sont acceptés"])
      return
    }

    setFile(selectedFile)
    setErrors([])

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      parseCSV(text)
    }
    reader.readAsText(selectedFile)
  }

  const parseCSV = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim())
    if (lines.length < 2) {
      setErrors(["Le fichier doit contenir au moins une ligne d'en-tête et une ligne de données"])
      return
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const requiredHeaders = ["numero_etudiant", "prenom", "nom"]
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))

    if (missingHeaders.length > 0) {
      setErrors([`Colonnes manquantes: ${missingHeaders.join(", ")}`])
      return
    }

    const parsedStudents: Student[] = []
    const newErrors: string[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim())
      if (values.length !== headers.length) {
        newErrors.push(`Ligne ${i + 1}: nombre de colonnes incorrect`)
        continue
      }

      const student: Student = {
        student_number: values[headers.indexOf("numero_etudiant")] || "",
        first_name: values[headers.indexOf("prenom")] || "",
        last_name: values[headers.indexOf("nom")] || "",
        email: values[headers.indexOf("email")] || undefined,
        class_name: values[headers.indexOf("classe")] || undefined,
        birth_date: values[headers.indexOf("date_naissance")] || undefined,
      }

      if (!student.student_number || !student.first_name || !student.last_name) {
        newErrors.push(`Ligne ${i + 1}: champs obligatoires manquants`)
        continue
      }

      parsedStudents.push(student)
    }

    setStudents(parsedStudents)
    setErrors(newErrors)
  }

  const handleImport = async () => {
    setImporting(true)
    try {
      // Simulate API call - replace with actual database integration
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setImported(true)
    } catch (error) {
      setErrors(["Erreur lors de l'importation des données"])
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Import des Étudiants</h1>
              <p className="text-sm text-muted-foreground">Importez la liste des étudiants depuis un fichier CSV</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!imported ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sélectionner un fichier</CardTitle>
                <CardDescription>Glissez-déposez votre fichier CSV ou cliquez pour le sélectionner</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">{file ? file.name : "Glissez votre fichier CSV ici"}</p>
                    <p className="text-sm text-muted-foreground">ou cliquez pour parcourir vos fichiers</p>
                  </div>
                  <Input type="file" accept=".csv" onChange={handleFileInput} className="hidden" id="file-upload" />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button className="mt-4 bg-transparent" variant="outline">
                      Parcourir les fichiers
                    </Button>
                  </Label>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Format requis:</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Votre fichier CSV doit contenir les colonnes suivantes:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>
                      <strong>numero_etudiant</strong> (obligatoire)
                    </li>
                    <li>
                      <strong>prenom</strong> (obligatoire)
                    </li>
                    <li>
                      <strong>nom</strong> (obligatoire)
                    </li>
                    <li>
                      <strong>email</strong> (optionnel)
                    </li>
                    <li>
                      <strong>classe</strong> (optionnel)
                    </li>
                    <li>
                      <strong>date_naissance</strong> (optionnel, format: YYYY-MM-DD)
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Aperçu des données
                </CardTitle>
                <CardDescription>Vérifiez les données avant l'importation</CardDescription>
              </CardHeader>
              <CardContent>
                {errors.length > 0 && (
                  <Alert className="mb-4" variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {students.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{students.length} étudiant(s) trouvé(s)</p>
                      <Button
                        onClick={handleImport}
                        disabled={importing || errors.length > 0}
                        className="flex items-center gap-2"
                      >
                        {importing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Importation...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Importer les données
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="border rounded-lg max-h-96 overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Numéro</TableHead>
                            <TableHead>Prénom</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Classe</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.slice(0, 10).map((student, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-mono text-sm">{student.student_number}</TableCell>
                              <TableCell>{student.first_name}</TableCell>
                              <TableCell>{student.last_name}</TableCell>
                              <TableCell className="text-muted-foreground">{student.email || "--"}</TableCell>
                              <TableCell>{student.class_name || "--"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {students.length > 10 && (
                        <div className="p-2 text-center text-sm text-muted-foreground border-t">
                          ... et {students.length - 10} autre(s) étudiant(s)
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!file && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Sélectionnez un fichier pour voir l'aperçu</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Success state */
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 mx-auto text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Import réussi!</h3>
                  <p className="text-muted-foreground">{students.length} étudiant(s) ont été importés avec succès.</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Link href="/">
                    <Button>Retour au tableau de bord</Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImported(false)
                      setFile(null)
                      setStudents([])
                      setErrors([])
                    }}
                  >
                    Importer d'autres étudiants
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
