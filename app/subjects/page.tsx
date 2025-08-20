"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, BookOpen, ArrowLeft, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

interface Subject {
  id: string
  name: string
  code: string
  coefficient: number
  description: string | null
  color: string
  professor_id: string | null
  semester: string
  academic_year: string
  created_at: string
  professors?: Professor
}

interface Professor {
  id: string
  first_name: string
  last_name: string
  email: string
  department: string | null
  title: string | null
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [professors, setProfessors] = useState<Professor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    coefficient: 1.0,
    description: "",
    color: "#15803d",
    professor_id: "default",
    semester: "S1",
    academic_year: "2024-2025",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchSubjects()
    fetchProfessors()
  }, [])

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from("subjects")
        .select(`
          *,
          professors (
            id,
            first_name,
            last_name,
            email,
            department,
            title
          )
        `)
        .order("name")

      if (error) throw error
      setSubjects(data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des matières:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les matières",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProfessors = async () => {
    try {
      const { data, error } = await supabase.from("professors").select("*").order("last_name")

      if (error) throw error
      setProfessors(data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des professeurs:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const subjectData = {
        name: formData.name,
        code: formData.code,
        coefficient: formData.coefficient,
        description: formData.description || null,
        color: formData.color,
        professor_id: formData.professor_id || null,
        semester: formData.semester,
        academic_year: formData.academic_year,
      }

      if (editingSubject) {
        const { error } = await supabase
          .from("subjects")
          .update({
            ...subjectData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingSubject.id)

        if (error) throw error
        toast({
          title: "Succès",
          description: "Matière modifiée avec succès",
        })
      } else {
        const { error } = await supabase.from("subjects").insert(subjectData)

        if (error) throw error
        toast({
          title: "Succès",
          description: "Matière créée avec succès",
        })
      }

      setIsDialogOpen(false)
      setEditingSubject(null)
      setFormData({
        name: "",
        code: "",
        coefficient: 1.0,
        description: "",
        color: "#15803d",
        professor_id: "default",
        semester: "S1",
        academic_year: "2024-2025",
      })
      fetchSubjects()
    } catch (error: any) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject)
    setFormData({
      name: subject.name,
      code: subject.code,
      coefficient: subject.coefficient,
      description: subject.description || "",
      color: subject.color,
      professor_id: subject.professor_id || "default",
      semester: subject.semester,
      academic_year: subject.academic_year,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette matière ?")) return

    try {
      const { error } = await supabase.from("subjects").delete().eq("id", id)

      if (error) throw error
      toast({
        title: "Succès",
        description: "Matière supprimée avec succès",
      })
      fetchSubjects()
    } catch (error: any) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la matière",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      coefficient: 1.0,
      description: "",
      color: "#15803d",
      professor_id: "default",
      semester: "S1",
      academic_year: "2024-2025",
    })
    setEditingSubject(null)
  }

  if (isLoading && subjects.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des matières...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-green-600" />
            Gestion des Matières
          </h1>
          <p className="text-gray-600 mt-1">Gérez les matières enseignées dans votre établissement</p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Matière
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingSubject ? "Modifier la matière" : "Nouvelle matière"}</DialogTitle>
              <DialogDescription>
                {editingSubject
                  ? "Modifiez les informations de la matière"
                  : "Ajoutez une nouvelle matière à votre système"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nom de la matière</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ex: Mathématiques"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="code">Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="ex: MATH"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="coefficient">Coefficient</Label>
                    <Input
                      id="coefficient"
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="10"
                      value={formData.coefficient}
                      onChange={(e) => setFormData({ ...formData, coefficient: Number.parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="color">Couleur</Label>
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="professor">Professeur responsable</Label>
                  <Select
                    value={formData.professor_id}
                    onValueChange={(value) => setFormData({ ...formData, professor_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un professeur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Aucun professeur assigné</SelectItem>
                      {professors.map((professor) => (
                        <SelectItem key={professor.id} value={professor.id}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {professor.title} {professor.first_name} {professor.last_name}
                            {professor.department && (
                              <Badge variant="outline" className="text-xs">
                                {professor.department}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="semester">Semestre</Label>
                    <Select
                      value={formData.semester}
                      onValueChange={(value) => setFormData({ ...formData, semester: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="S1">Semestre 1</SelectItem>
                        <SelectItem value="S2">Semestre 2</SelectItem>
                        <SelectItem value="S3">Semestre 3</SelectItem>
                        <SelectItem value="S4">Semestre 4</SelectItem>
                        <SelectItem value="S5">Semestre 5</SelectItem>
                        <SelectItem value="S6">Semestre 6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="academic_year">Année académique</Label>
                    <Input
                      id="academic_year"
                      value={formData.academic_year}
                      onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                      placeholder="2024-2025"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description (optionnel)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description de la matière..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                  {isLoading ? "Enregistrement..." : editingSubject ? "Modifier" : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Matières</CardTitle>
          <CardDescription>
            {subjects.length} matière{subjects.length > 1 ? "s" : ""} enregistrée{subjects.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune matière</h3>
              <p className="text-gray-600 mb-4">Commencez par ajouter votre première matière</p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une matière
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matière</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Coefficient</TableHead>
                  <TableHead>Professeur</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: subject.color }} />
                        {subject.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{subject.code}</Badge>
                    </TableCell>
                    <TableCell>{subject.coefficient}</TableCell>
                    <TableCell>
                      {subject.professors ? (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {subject.professors.title} {subject.professors.first_name} {subject.professors.last_name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Non assigné</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{subject.semester}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{subject.description || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(subject)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(subject.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
