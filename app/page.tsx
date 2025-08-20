"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Users, FileText, Download, GraduationCap, TrendingUp, Calendar, BookOpen, Clock } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts"
import Link from "next/link"

interface DashboardStats {
  totalStudents: number
  totalGrades: number
  averageGrade: number
  totalExports: number
  recentActivity: Array<{
    id: number
    type: string
    description: string
    timestamp: string
  }>
  subjectStats: Array<{
    name: string
    students: number
    average: number
    color: string
  }>
  gradeDistribution: Array<{
    range: string
    count: number
  }>
  monthlyProgress: Array<{
    month: string
    grades: number
  }>
}

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchStats = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockStats: DashboardStats = {
        totalStudents: 125,
        totalGrades: 847,
        averageGrade: 14.2,
        totalExports: 12,
        recentActivity: [
          {
            id: 1,
            type: "grade",
            description: "Notes de Mathématiques saisies pour 3ème A",
            timestamp: "Il y a 2 heures",
          },
          { id: 2, type: "import", description: "Import de 25 nouveaux étudiants", timestamp: "Il y a 5 heures" },
          { id: 3, type: "export", description: "Export des bulletins trimestriels", timestamp: "Hier" },
          { id: 4, type: "grade", description: "Notes de Français saisies pour 3ème B", timestamp: "Hier" },
        ],
        subjectStats: [
          { name: "Mathématiques", students: 125, average: 13.8, color: "#15803d" },
          { name: "Français", students: 125, average: 14.5, color: "#84cc16" },
          { name: "Histoire-Géo", students: 125, average: 14.1, color: "#22c55e" },
          { name: "Sciences", students: 125, average: 13.2, color: "#16a34a" },
          { name: "Anglais", students: 125, average: 15.1, color: "#65a30d" },
        ],
        gradeDistribution: [
          { range: "0-5", count: 12 },
          { range: "6-10", count: 45 },
          { range: "11-15", count: 234 },
          { range: "16-20", count: 156 },
        ],
        monthlyProgress: [
          { month: "Sep", grades: 45 },
          { month: "Oct", grades: 78 },
          { month: "Nov", grades: 123 },
          { month: "Déc", grades: 156 },
          { month: "Jan", grades: 189 },
          { month: "Fév", grades: 256 },
        ],
      }

      setStats(mockStats)
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Gestion des Notes</h1>
                <p className="text-sm text-muted-foreground">Système de gestion académique</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                Dernière mise à jour: {new Date().toLocaleTimeString("fr-FR")}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Étudiants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats?.totalStudents}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notes Saisies</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats?.totalGrades}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +23% ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats?.averageGrade}/20</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +0.3 points
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exports</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats?.totalExports}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Ce trimestre
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Moyennes par Matière
              </CardTitle>
              <CardDescription>Performance des étudiants par discipline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.subjectStats || []}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 20]} />
                    <Bar dataKey="average" fill="#15803d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Évolution Mensuelle
              </CardTitle>
              <CardDescription>Nombre de notes saisies par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.monthlyProgress || []}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Line
                      type="monotone"
                      dataKey="grades"
                      stroke="#15803d"
                      strokeWidth={3}
                      dot={{ fill: "#15803d", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activité Récente
              </CardTitle>
              <CardDescription>Dernières actions effectuées dans le système</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === "grade"
                          ? "bg-primary"
                          : activity.type === "import"
                            ? "bg-secondary"
                            : "bg-accent"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type === "grade" ? "Note" : activity.type === "import" ? "Import" : "Export"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribution des Notes</CardTitle>
              <CardDescription>Répartition des notes par tranche</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.gradeDistribution?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.range}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${Math.min((item.count / 447) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                    </div>
                  </div>
                )) || <p className="text-sm text-muted-foreground">Aucune donnée disponible</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Importer Étudiants
              </CardTitle>
              <CardDescription>Importez la liste des étudiants depuis un fichier CSV ou Excel</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/import">
                <Button className="w-full" size="lg">
                  Choisir un fichier
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Saisir Notes
              </CardTitle>
              <CardDescription>Enregistrez les notes des étudiants par matière et évaluation</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/grades">
                <Button className="w-full bg-transparent" size="lg" variant="outline">
                  Commencer la saisie
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Exporter Données
              </CardTitle>
              <CardDescription>Exportez les notes et statistiques au format Excel ou PDF</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/export">
                <Button className="w-full" size="lg" variant="secondary">
                  Télécharger
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Gestion Administrative
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Matières
                </CardTitle>
                <CardDescription>Gérez les matières enseignées dans votre établissement</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/subjects">
                  <Button className="w-full bg-transparent" size="lg" variant="outline">
                    Gérer les matières
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
