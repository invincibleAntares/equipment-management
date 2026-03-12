import { useEffect, useMemo, useState } from "react"

import {
  deleteEquipment,
  getEquipment,
  getEquipmentTypes,
} from "@/api/equipment"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EquipmentFormDialog } from "@/features/equipment/EquipmentFormDialog"
import { statusToBadgeVariant } from "@/features/equipment/equipmentTypes"
import { MaintenanceHistoryDialog } from "@/features/maintenance/MaintenanceHistoryDialog"
import { MaintenanceLogDialog } from "@/features/maintenance/MaintenanceLogDialog"

function ConfirmDeleteDialog({ open, onOpenChange, equipment, onConfirm, error }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete equipment?</DialogTitle>
          <DialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-slate-900">{equipment?.name}</span>.
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" type="button" onClick={onConfirm} disabled={!equipment}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function EquipmentPage() {
  const [equipment, setEquipment] = useState([])
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [logOpen, setLogOpen] = useState(false)

  const [selected, setSelected] = useState(null)
  const [deleteError, setDeleteError] = useState("")

  const typesById = useMemo(() => {
    const m = new Map()
    for (const t of types) m.set(t.id, t)
    return m
  }, [types])

  async function refreshAll() {
    setLoading(true)
    setError("")
    try {
      const [eq, t] = await Promise.all([getEquipment(), getEquipmentTypes()])
      setEquipment(Array.isArray(eq) ? eq : [])
      setTypes(Array.isArray(t) ? t : [])
    } catch (e) {
      setError(e?.message || "Failed to load data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshAll()
  }, [])

  async function onDeleteConfirm() {
    if (!selected?.id) return
    setDeleteError("")
    try {
      await deleteEquipment(selected.id)
      setDeleteOpen(false)
      setSelected(null)
      await refreshAll()
    } catch (e) {
      setDeleteError(e?.body?.message || e?.message || "Failed to delete.")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Equipment
            </h1>
            <p className="text-sm text-slate-500">
              Manage equipment and maintenance lifecycle.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={() => setAddOpen(true)} disabled={types.length === 0}>
              Add equipment
            </Button>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 rounded-md border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last cleaned</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-slate-500">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : equipment.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-slate-500">
                    No equipment yet. Add your first item.
                  </TableCell>
                </TableRow>
              ) : (
                equipment.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell>{e.type?.name ?? typesById.get(e.typeId)?.name ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={statusToBadgeVariant(e.status)}>{e.status}</Badge>
                    </TableCell>
                    <TableCell>{e.lastCleanedDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => {
                            setSelected(e)
                            setHistoryOpen(true)
                          }}
                        >
                          History
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          type="button"
                          onClick={() => {
                            setSelected(e)
                            setLogOpen(true)
                          }}
                        >
                          Log maintenance
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => {
                            setSelected(e)
                            setEditOpen(true)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          type="button"
                          onClick={() => {
                            setSelected(e)
                            setDeleteError("")
                            setDeleteOpen(true)
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <EquipmentFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        mode="create"
        equipment={null}
        types={types}
        onSaved={refreshAll}
      />

      <EquipmentFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        equipment={selected}
        types={types}
        onSaved={refreshAll}
      />

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        equipment={selected}
        onConfirm={onDeleteConfirm}
        error={deleteError}
      />

      <MaintenanceHistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        equipment={selected}
      />

      <MaintenanceLogDialog
        open={logOpen}
        onOpenChange={setLogOpen}
        equipment={selected}
        onLogged={refreshAll}
      />
    </div>
  )
}

