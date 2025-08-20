"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Download,
  FileText,
  FileSpreadsheet,
  FileImage,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  BookOpen,
} from "lucide-react"
import Link from "next/link"

interface ExportConfig {
  type: string
  format: string
  filters: {
    classes: string[]
    subjects: string[]
    dateRange: string
    includeComments: boolean
    includeStatistics: boolean
  }
}

export default function ExportPage() {
  const [config, setConfig] = useState<ExportConfig>({
    type: "",
    format: "",
    filters: {
      classes: [],
      subjects: [],
      dateRange: "",
      includeComments: false,
      includeStatistics: false,
    },
  })
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const exportTypes = [
    {
      id: "grades",
      name: "Notes des Étudiants",
      description: "Export détaillé de toutes les notes par étudiant et matière",
      icon: FileText,
    },
    {
      id: "bulletins",
      name: "Bulletins de Notes",
      description: "Bulletins formatés avec moyennes et appréciations",
      icon: FileImage,
    },
    {
      id: "statistics",
      name: "Statistiques",
      description: "Analyses et statistiques par classe et matière",
      icon: FileSpreadsheet,
    },
  ]

  const formats = [
    { id: "csv", name: "CSV", description: "Fichier texte séparé par virgules", icon: FileText },
    { id: "excel", name: "Excel", description: "Classeur Microsoft Excel", icon: FileSpreadsheet },
    { id: "pdf", name: "PDF", description: "Document PDF formaté", icon: FileImage },
  ]

  const classes = ["3ème A", "3ème B", "3ème C", "4ème A", "4ème B", "5ème A", "5ème B"]
  const subjects = ["Mathématiques", "Français", "Histoire-Géographie", "Sciences Physiques", "Anglais", "EPS"]
  const dateRanges = [
    { id: "current", name: "Trimestre Actuel" },
    { id: "semester", name: "Semestre" },
    { id: "year", name: "Année Scolaire" },
    { id: "custom", name: "Période Personnalisée" },
  ]

  const handleClassToggle = (className: string) => {
    setConfig((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        classes: prev.filters.classes.includes(className)
          ? prev.filters.classes.filter((c) => c !== className)
          : [...prev.filters.classes, className],
      },
    }))
  }

  const handleSubjectToggle = (subject: string) => {
    setConfig((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        subjects: prev.filters.subjects.includes(subject)
          ? prev.filters.subjects.filter((s) => s !== subject)
          : [...prev.filters.subjects, subject],
      },
    }))
  }

  const handleExport = async () => {
    if (!config.type || !config.format) {
      setErrors(["Veuillez sélectionner un type d'export et un format"])
      return
    }

    setExporting(true)
    setErrors([])

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate file download
      const fileName = `export_${config.type}_${new Date().toISOString().split("T")[0]}.${config.format}`
      const blob = new Blob(["Données exportées..."], { type: "text/plain" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setExported(true)
      setTimeout(() => setExported(false), 5000)
    } catch (error) {
      setErrors(["Erreur lors de l'export des données"])
    } finally {
      setExporting(false)
    }
  }

  const selectedExportType = exportTypes.find((t) => t.id === config.type)
  const selectedFormat = formats.find((f) => f.id === config.format)

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
              <h1 className="text-2xl font-bold text-foreground">Export des Données</h1>
              <p className="text-sm text-muted-foreground">
                Exportez les notes et statistiques dans différents formats
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {errors.length > 0 && (
          <Alert className="mb-6" variant="destructive">
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

        {exported && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Export terminé avec succès! Le fichier a été téléchargé.</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Export Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Type d'Export</CardTitle>
                <CardDescription>Sélectionnez le type de données à exporter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {exportTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <div
                        key={type.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          config.type === type.id
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-primary/50"
                        }`}
                        onClick={() => setConfig((prev) => ({ ...prev, type: type.id }))}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{type.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Format Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Format de Fichier</CardTitle>
                <CardDescription>Choisissez le format de sortie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {formats.map((format) => {
                    const Icon = format.icon
                    return (
                      <div
                        key={format.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          config.format === format.id
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-primary/50"
                        }`}
                        onClick={() => setConfig((prev) => ({ ...prev, format: format.id }))}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{format.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{format.description}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filtres et Options</CardTitle>
                <CardDescription>Personnalisez votre export</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Classes */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Classes
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {classes.map((className) => (
                      <div key={className} className="flex items-center space-x-2">
                        <Checkbox
                          id={`class-${className}`}
                          checked={config.filters.classes.includes(className)}
                          onCheckedChange={() => handleClassToggle(className)}
                        />
                        <Label htmlFor={`class-${className}`} className="text-sm">
                          {className}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Subjects */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Matières
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject) => (
                      <div key={subject} className="flex items-center space-x-2">
                        <Checkbox
                          id={`subject-${subject}`}
                          checked={config.filters.subjects.includes(subject)}
                          onCheckedChange={() => handleSubjectToggle(subject)}
                        />
                        <Label htmlFor={`subject-${subject}`} className="text-sm">
                          {subject}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Date Range */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Période
                  </Label>
                  <Select
                    value={config.filters.dateRange}
                    onValueChange={(value) =>
                      setConfig((prev) => ({
                        ...prev,
                        filters: { ...prev.filters, dateRange: value },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une période" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRanges.map((range) => (
                        <SelectItem key={range.id} value={range.id}>
                          {range.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Additional Options */}
                <div className="space-y-3">
                  <Label>Options Supplémentaires</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-comments"
                        checked={config.filters.includeComments}
                        onCheckedChange={(checked) =>
                          setConfig((prev) => ({
                            ...prev,
                            filters: { ...prev.filters, includeComments: checked as boolean },
                          }))
                        }
                      />
                      <Label htmlFor="include-comments" className="text-sm">
                        Inclure les commentaires
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-statistics"
                        checked={config.filters.includeStatistics}
                        onCheckedChange={(checked) =>
                          setConfig((prev) => ({
                            ...prev,
                            filters: { ...prev.filters, includeStatistics: checked as boolean },
                          }))
                        }
                      />
                      <Label htmlFor="include-statistics" className="text-sm">
                        Inclure les statistiques
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Résumé de l'Export</CardTitle>
              <CardDescription>Vérifiez votre configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedExportType && (
                <div>
                  <Label className="text-sm font-medium">Type d'export</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedExportType.name}</p>
                </div>
              )}

              {selectedFormat && (
                <div>
                  <Label className="text-sm font-medium">Format</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedFormat.name}</p>
                </div>
              )}

              {config.filters.classes.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Classes sélectionnées</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {config.filters.classes.map((className) => (
                      <Badge key={className} variant="outline" className="text-xs">
                        {className}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {config.filters.subjects.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Matières sélectionnées</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {config.filters.subjects.map((subject) => (
                      <Badge key={subject} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {config.filters.dateRange && (
                <div>
                  <Label className="text-sm font-medium">Période</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {dateRanges.find((r) => r.id === config.filters.dateRange)?.name}
                  </p>
                </div>
              )}

              <div className="pt-4">
                <Button
                  onClick={handleExport}
                  disabled={exporting || !config.type || !config.format}
                  className="w-full flex items-center gap-2"
                  size="lg"
                >
                  {exporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Export en cours...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Lancer l'Export
                    </>
                  )}
                </Button>
              </div>

              <div className="text-xs text-muted-foreground pt-2">
                <p>L'export sera téléchargé automatiquement une fois terminé.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
