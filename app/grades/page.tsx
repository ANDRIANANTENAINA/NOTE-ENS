"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Save,
  Users,
  BookOpen,
  FileText,
  CheckCircle,
  AlertCircle,
  Search,
  Zap,
  Clock,
  Keyboard,
} from "lucide-react"
import Link from "next/link"

interface Student {
  id: number
  student_number: string
  first_name: string
  last_name: string
  class_name: string
}

interface Subject {
  id: number
  name: string
  code: string
  coefficient: number
}

interface Evaluation {
  id: number
  subject_id: number
  name: string
  evaluation_type: string
  session_type: "normal" | "rattrapage" | "repechage"
  max_score: number
  evaluation_date: string
  coefficient: number
  is_makeup: boolean
}

interface Grade {
  student_id: number
  score: string
  comment: string
}

export default function GradesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedEvaluation, setSelectedEvaluation] = useState<string>("")
  const [grades, setGrades] = useState<Record<number, Grade>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [autoSave, setAutoSave] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [quickGrades] = useState([0, 5, 10, 12, 15, 18, 20])
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1)
  const inputRefs = useRef<Record<number, HTMLInputElement>>({})

  useEffect(() => {
    const mockSubjects: Subject[] = [
      { id: 1, name: "Mathématiques", code: "MATH", coefficient: 3.0 },
      { id: 2, name: "Français", code: "FR", coefficient: 3.0 },
      { id: 3, name: "Histoire-Géographie", code: "HG", coefficient: 2.0 },
      { id: 4, name: "Sciences Physiques", code: "PHY", coefficient: 2.5 },
      { id: 5, name: "Anglais", code: "ANG", coefficient: 2.0 },
    ]

    const mockStudents: Student[] = [
      { id: 1, student_number: "2024001", first_name: "Marie", last_name: "Dupont", class_name: "3ème A" },
      { id: 2, student_number: "2024002", first_name: "Pierre", last_name: "Martin", class_name: "3ème A" },
      { id: 3, student_number: "2024003", first_name: "Sophie", last_name: "Bernard", class_name: "3ème A" },
      { id: 4, student_number: "2024004", first_name: "Lucas", last_name: "Petit", class_name: "3ème B" },
      { id: 5, student_number: "2024005", first_name: "Emma", last_name: "Moreau", class_name: "3ème B" },
    ]

    setSubjects(mockSubjects)
    setStudents(mockStudents)
  }, [])

  useEffect(() => {
    if (selectedSubject) {
      const mockEvaluations: Evaluation[] = [
        {
          id: 1,
          subject_id: Number.parseInt(selectedSubject),
          name: "Examen Final",
          evaluation_type: "exam",
          session_type: "normal",
          max_score: 20,
          evaluation_date: "2024-01-15",
          coefficient: 3.0,
          is_makeup: false,
        },
        {
          id: 2,
          subject_id: Number.parseInt(selectedSubject),
          name: "Contrôle Continu",
          evaluation_type: "homework",
          session_type: "normal",
          max_score: 20,
          evaluation_date: "2024-01-22",
          coefficient: 2.0,
          is_makeup: false,
        },
        {
          id: 3,
          subject_id: Number.parseInt(selectedSubject),
          name: "Rattrapage - Examen Final",
          evaluation_type: "exam",
          session_type: "rattrapage",
          max_score: 20,
          evaluation_date: "2024-06-15",
          coefficient: 3.0,
          is_makeup: true,
        },
        {
          id: 4,
          subject_id: Number.parseInt(selectedSubject),
          name: "Repêchage - Session Septembre",
          evaluation_type: "exam",
          session_type: "repechage",
          max_score: 20,
          evaluation_date: "2024-09-10",
          coefficient: 3.0,
          is_makeup: true,
        },
      ]
      setEvaluations(mockEvaluations)
    } else {
      setEvaluations([])
    }
  }, [selectedSubject])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students)
    } else {
      const filtered = students.filter(
        (student) =>
          student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.student_number.includes(searchTerm) ||
          student.class_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredStudents(filtered)
    }
  }, [students, searchTerm])

  useEffect(() => {
    if (!autoSave || Object.keys(grades).length === 0) return

    const interval = setInterval(() => {
      if (selectedSubject && selectedEvaluation && Object.keys(grades).length > 0) {
        handleAutoSave()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [grades, selectedSubject, selectedEvaluation, autoSave])

  const handleGradeChange = (studentId: number, field: "score" | "comment", value: string) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        student_id: studentId,
        [field]: value,
      },
    }))
    setSaved(false)
  }

  const validateGrades = () => {
    const newErrors: string[] = []
    const selectedEval = evaluations.find((e) => e.id.toString() === selectedEvaluation)

    if (!selectedEval) return newErrors

    Object.entries(grades).forEach(([studentId, grade]) => {
      if (grade.score && grade.score.trim()) {
        const score = Number.parseFloat(grade.score)
        if (isNaN(score)) {
          const student = students.find((s) => s.id.toString() === studentId)
          newErrors.push(`Note invalide pour ${student?.first_name} ${student?.last_name}`)
        } else if (score < 0 || score > selectedEval.max_score) {
          const student = students.find((s) => s.id.toString() === studentId)
          newErrors.push(
            `Note hors limites pour ${student?.first_name} ${student?.last_name} (0-${selectedEval.max_score})`,
          )
        }
      }
    })

    return newErrors
  }

  const handleSave = async () => {
    const validationErrors = validateGrades()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setSaving(true)
    setErrors([])

    try {
      // Simulate API call - replace with actual database integration
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      setErrors(["Erreur lors de la sauvegarde des notes"])
    } finally {
      setSaving(false)
    }
  }

  const handleAutoSave = useCallback(async () => {
    const validationErrors = validateGrades()
    if (validationErrors.length > 0) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setLastSaved(new Date())
    } catch (error) {
      console.error("Auto-save failed:", error)
    }
  }, [grades])

  const handleKeyDown = (e: React.KeyboardEvent, studentId: number, field: "score" | "comment") => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault()
      const currentIndex = filteredStudents.findIndex((s) => s.id === studentId)
      let nextIndex = currentIndex

      if (field === "score" && e.key === "Tab") {
        // Passer au commentaire du même étudiant
        const commentInput = document.querySelector(`textarea[data-student="${studentId}"]`) as HTMLTextAreaElement
        commentInput?.focus()
        return
      }

      if (e.key === "Enter" || (field === "comment" && e.key === "Tab")) {
        // Passer à la note de l'étudiant suivant
        nextIndex = currentIndex + 1
        if (nextIndex < filteredStudents.length) {
          const nextStudentId = filteredStudents[nextIndex].id
          inputRefs.current[nextStudentId]?.focus()
        }
      }
    }

    // Raccourcis pour notes rapides (Ctrl + chiffre)
    if (e.ctrlKey && field === "score") {
      const num = Number.parseInt(e.key)
      if (!isNaN(num) && quickGrades.includes(num)) {
        e.preventDefault()
        handleGradeChange(studentId, "score", num.toString())
      }
    }
  }

  const applyQuickGrade = (studentId: number, grade: number) => {
    handleGradeChange(studentId, "score", grade.toString())
    // Focus sur le champ suivant
    const currentIndex = filteredStudents.findIndex((s) => s.id === studentId)
    if (currentIndex < filteredStudents.length - 1) {
      const nextStudentId = filteredStudents[currentIndex + 1].id
      setTimeout(() => inputRefs.current[nextStudentId]?.focus(), 100)
    }
  }

  const getProgressPercentage = () => {
    const totalStudents = filteredStudents.length
    const gradedStudents = filteredStudents.filter((s) => grades[s.id]?.score?.trim()).length
    return totalStudents > 0 ? Math.round((gradedStudents / totalStudents) * 100) : 0
  }

  const getEvaluationTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      exam: "Contrôle",
      homework: "Devoir",
      quiz: "Interrogation",
      project: "Projet",
    }
    return types[type] || type
  }

  const getEvaluationTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      exam: "destructive",
      homework: "default",
      quiz: "secondary",
      project: "outline",
    }
    return variants[type] || "default"
  }

  const getSessionTypeLabel = (sessionType: string) => {
    const types: Record<string, string> = {
      normal: "Session normale",
      rattrapage: "Rattrapage",
      repechage: "Repêchage",
    }
    return types[sessionType] || sessionType
  }

  const getSessionTypeBadge = (sessionType: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      normal: "default",
      rattrapage: "secondary",
      repechage: "destructive",
    }
    return variants[sessionType] || "default"
  }

  const selectedSubjectData = subjects.find((s) => s.id.toString() === selectedSubject)
  const selectedEvaluationData = evaluations.find((e) => e.id.toString() === selectedEvaluation)

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
              <h1 className="text-2xl font-bold text-foreground">Saisie des Notes</h1>
              <p className="text-sm text-muted-foreground">Enregistrez les notes des étudiants par évaluation</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Selection Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Sélection
              </CardTitle>
              <CardDescription>Choisissez la matière et l'évaluation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Matière</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSubject && (
                <div className="space-y-2">
                  <Label htmlFor="evaluation">Évaluation</Label>
                  <Select value={selectedEvaluation} onValueChange={setSelectedEvaluation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une évaluation" />
                    </SelectTrigger>
                    <SelectContent>
                      {evaluations.map((evaluation) => (
                        <SelectItem key={evaluation.id} value={evaluation.id.toString()}>
                          <div className="flex items-center gap-2">
                            <span>{evaluation.name}</span>
                            <Badge variant={getEvaluationTypeBadge(evaluation.evaluation_type)} className="text-xs">
                              {getEvaluationTypeLabel(evaluation.evaluation_type)}
                            </Badge>
                            <Badge variant={getSessionTypeBadge(evaluation.session_type)} className="text-xs">
                              {getSessionTypeLabel(evaluation.session_type)}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedEvaluationData && (
                <>
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <h4 className="font-medium">Détails de l'évaluation</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Note sur:</strong> {selectedEvaluationData.max_score}
                      </p>
                      <p>
                        <strong>Coefficient:</strong> {selectedEvaluationData.coefficient}
                      </p>
                      <p>
                        <strong>Date:</strong> {new Date(selectedEvaluationData.evaluation_date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Session:</strong> {getSessionTypeLabel(selectedEvaluationData.session_type)}
                      </p>
                      {selectedEvaluationData.is_makeup && (
                        <p className="text-orange-600 font-medium">⚠️ Évaluation de rattrapage/repêchage</p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Saisie Rapide
                    </h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autosave"
                        checked={autoSave}
                        onChange={(e) => setAutoSave(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="autosave" className="text-sm">
                        Auto-sauvegarde
                      </Label>
                    </div>
                    {lastSaved && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Dernière sauvegarde: {lastSaved.toLocaleTimeString()}
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="flex items-center gap-1">
                        <Keyboard className="h-3 w-3" />
                        Raccourcis:
                      </p>
                      <p>• Tab/Entrée: Champ suivant</p>
                      <p>• Ctrl+[0-9]: Note rapide</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Grades Entry Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Saisie des Notes
                {selectedSubjectData && selectedEvaluationData && (
                  <Badge variant="outline" className="ml-2">
                    {selectedSubjectData.name} - {selectedEvaluationData.name}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Entrez les notes pour chaque étudiant
                {selectedSubject && selectedEvaluation && (
                  <span className="ml-2">
                    • Progression: {getProgressPercentage()}% (
                    {filteredStudents.filter((s) => grades[s.id]?.score?.trim()).length}/{filteredStudents.length})
                  </span>
                )}
              </CardDescription>
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

              {saved && (
                <Alert className="mb-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Notes sauvegardées avec succès!</AlertDescription>
                </Alert>
              )}

              {selectedSubject && selectedEvaluation ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher un étudiant (nom, prénom, numéro, classe)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {searchTerm && (
                      <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
                        Effacer
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Notes rapides:</span>
                    {quickGrades.map((grade) => (
                      <Button
                        key={grade}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-transparent"
                        onClick={() => {
                          // Appliquer à tous les étudiants visibles sans note
                          filteredStudents.forEach((student) => {
                            if (!grades[student.id]?.score?.trim()) {
                              handleGradeChange(student.id, "score", grade.toString())
                            }
                          })
                        }}
                      >
                        {grade}
                      </Button>
                    ))}
                  </div>

                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Étudiant</TableHead>
                          <TableHead>Classe</TableHead>
                          <TableHead className="w-32">Note (/{selectedEvaluationData?.max_score})</TableHead>
                          <TableHead>Actions rapides</TableHead>
                          <TableHead>Commentaire</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {student.first_name} {student.last_name}
                                </div>
                                <div className="text-sm text-muted-foreground">{student.student_number}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{student.class_name}</Badge>
                            </TableCell>
                            <TableCell>
                              <Input
                                ref={(el) => {
                                  if (el) inputRefs.current[student.id] = el
                                }}
                                type="number"
                                min="0"
                                max={selectedEvaluationData?.max_score}
                                step="0.5"
                                placeholder="--"
                                value={grades[student.id]?.score || ""}
                                onChange={(e) => handleGradeChange(student.id, "score", e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, student.id, "score")}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {quickGrades.slice(0, 4).map((grade) => (
                                  <Button
                                    key={grade}
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-xs"
                                    onClick={() => applyQuickGrade(student.id, grade)}
                                  >
                                    {grade}
                                  </Button>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Textarea
                                data-student={student.id}
                                placeholder="Commentaire optionnel..."
                                value={grades[student.id]?.comment || ""}
                                onChange={(e) => handleGradeChange(student.id, "comment", e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, student.id, "comment")}
                                className="min-h-[60px] resize-none"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {searchTerm && (
                    <p className="text-sm text-muted-foreground">
                      {filteredStudents.length} étudiant(s) trouvé(s) sur {students.length}
                    </p>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={saving || Object.keys(grades).length === 0}
                      className="flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Sauvegarde...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Sauvegarder les notes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Sélectionnez une matière et une évaluation</p>
                  <p>Choisissez d'abord une matière et une évaluation pour commencer la saisie des notes.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
