"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Users, 
  Search, 
  Eye, 
  FileText, 
  Calendar,
  Mail,
  Phone,
  MapPin
} from "lucide-react"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ApprovedUser {
  id: string
  email: string
  full_name: string
  phone: string | null
  country: string | null
  created_at: string
  approved_at: string | null
  total_orders: number
  last_order_date: string | null
}

export function ApprovedUsersList() {
  const [users, setUsers] = useState<ApprovedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<ApprovedUser[]>([])

  useEffect(() => {
    fetchApprovedUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(user =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm))
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  const fetchApprovedUsers = async () => {
    setLoading(true)
    try {
      console.log("=== FETCHING APPROVED USERS ===")
      const response = await fetch("/api/admin/approved-users")
      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)
      
      const data = await response.json()
      console.log("Response data:", data)
      
      if (response.ok) {
        console.log("Setting users:", data)
        setUsers(Array.isArray(data) ? data : [])
      } else {
        console.error("API Error:", data)
        const errorMsg = `Error: ${data.error || 'Unknown error'}
Details: ${data.details || 'No details'}
Code: ${data.code || 'No code'}
Hint: ${data.hint || 'No hint'}`
        console.error("Full error message:", errorMsg)
        alert(errorMsg)
      }
    } catch (error) {
      console.error("Fetch Error:", error)
      alert(`Error de conexión: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const viewUserOrders = (userId: string) => {
    // Navigate to user orders view
    window.location.href = `/admin/users/${userId}/orders`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Usuarios Aprobados
          </h2>
          <p className="text-muted-foreground">
            Lista de clientes verificados y sus estadísticas de envíos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchApprovedUsers}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Actualizar"}
          </Button>
          <Badge variant="secondary" className="text-sm">
            {filteredUsers.length} usuarios
          </Badge>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm ? "No se encontraron usuarios" : "No hay usuarios aprobados"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Intenta con otros términos de búsqueda"
                  : "Los usuarios aparecerán aquí una vez que sean aprobados"
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>País</TableHead>
                    <TableHead>Fecha Aprobación</TableHead>
                    <TableHead>Órdenes</TableHead>
                    <TableHead>Última Orden</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">
                            {user.full_name}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.phone ? (
                          <div className="text-sm flex items-center gap-1">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            {user.phone}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Sin teléfono</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.country ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{user.country}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No especificado</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {user.approved_at ? (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              {format(new Date(user.approved_at), "dd MMM yyyy", { locale: es })}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Pendiente</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.total_orders > 0 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {user.total_orders} órdenes
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.last_order_date ? (
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(user.last_order_date), "dd MMM yyyy", { locale: es })}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Sin órdenes</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewUserOrders(user.id)}
                            className="h-8 px-2"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                          {user.total_orders > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewUserOrders(user.id)}
                              className="h-8 px-2"
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              Historial
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}