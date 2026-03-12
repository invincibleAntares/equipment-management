import { apiFetch } from "@/api/client"

export function getEquipment() {
  return apiFetch("/api/equipment")
}

export function createEquipment(payload) {
  return apiFetch("/api/equipment", { method: "POST", body: JSON.stringify(payload) })
}

export function updateEquipment(id, payload) {
  return apiFetch(`/api/equipment/${id}`, { method: "PUT", body: JSON.stringify(payload) })
}

export function deleteEquipment(id) {
  return apiFetch(`/api/equipment/${id}`, { method: "DELETE" })
}

export function getEquipmentTypes() {
  return apiFetch("/api/equipment-types")
}

export function getMaintenance(equipmentId) {
  return apiFetch(`/api/equipment/${equipmentId}/maintenance`)
}

export function createMaintenance(payload) {
  return apiFetch("/api/maintenance", { method: "POST", body: JSON.stringify(payload) })
}

