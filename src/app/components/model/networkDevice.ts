export interface NetworkDevice {
  createdById: number
  createdByName: string
  createdate: string
  devicetype: string
  id: number
  isDeleted: boolean
  lastModifiedById: number
  lastModifiedByName: string
  latitude: string
  longitude: string
  name: string
  servicearea: {
    createdById: number
    createdByName: string
    createdate: string
    id: number
    isDeleted: boolean
    lastModifiedById: number
    lastModifiedByName: string
    name: string
    status: string
    updatedate: string
  }
  status: string
  updatedate: string
}
