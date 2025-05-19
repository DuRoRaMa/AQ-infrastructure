export interface OperatorLocation {
  id: number
  name: string
  settings?: number
  disabled?: boolean
}
export interface OperatorSettings {
  location: number
  purposes: number[]
  automatic_assignment: boolean
}
export interface TalonPurpose {
  id: number
  name: string
  description: string
}
