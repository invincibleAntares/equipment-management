import { useEffect, useState } from "react"

import { getMaintenance } from "@/api/equipment"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function MaintenanceHistoryDialog({ open, onOpenChange, equipment }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open || !equipment?.id) return

    let ignore = false
    Promise.resolve().then(() => {
      if (ignore) return
      setLoading(true)
      setError("")
    })
    getMaintenance(equipment.id)
      .then((data) => {
        if (ignore) return
        setRows(Array.isArray(data) ? data : [])
      })
      .catch((e) => {
        if (ignore) return
        setError(e?.message || "Failed to load maintenance history.")
      })
      .finally(() => {
        if (ignore) return
        setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [open, equipment?.id])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Maintenance history</DialogTitle>
          <DialogDescription>
            {equipment ? `${equipment.name} — ${equipment.type?.name ?? ""}` : ""}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="rounded-md border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Performed by</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-slate-500">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-slate-500">
                    No maintenance records yet.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.maintenanceDate}</TableCell>
                    <TableCell>{r.performedBy}</TableCell>
                    <TableCell className="text-slate-600">
                      {r.notes ? r.notes : <span className="text-slate-400">—</span>}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

