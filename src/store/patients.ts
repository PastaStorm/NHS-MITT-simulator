import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type Code, MITT, type Patient } from '../algorithm'

export interface PatientsState {
  entities: Record<number, Patient>
  ids: number[]
}

const initialState: PatientsState = {
  entities: {},
  ids: []
}

export const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    generatePatients: (state, action: PayloadAction<number>) => {
      state.entities = {}
      state.ids = []
      for (let i = 1; i <= action.payload; i++) {
        const patient = MITT.newPatient(i)
        state.entities[patient.id] = patient
        state.ids.push(patient.id)
      }
    },
    setCode: (state, action: PayloadAction<[number, Code]>) => {
      const [id, code] = action.payload
      const patient = state.entities[id]
      if (patient !== undefined) {
        patient.assignedCode = code
      }
    },
    toggleReveal: (state, action: PayloadAction<[number, string]>) => {
      const [id, characteristic] = action.payload
      const patient = state.entities[id]
      if (patient === undefined) return
      switch (characteristic) {
        case 'Bleeding': patient.revealedBleeding = !(patient.revealedBleeding ?? false); break
        case 'Walking': patient.revealedWalking = !(patient.revealedWalking ?? false); break
        case 'Breathing': patient.revealedBreathing = !(patient.revealedBreathing ?? false); break
        case 'Voice': patient.revealedVoice = !(patient.revealedVoice ?? false); break
        case 'BreathingRate': patient.revealedBreathingRate = !(patient.revealedBreathingRate ?? false); break
        case 'HeartRate': patient.revealedHeartRate = !(patient.revealedHeartRate ?? false); break
      }
    },
    toggleAction: (state, action: PayloadAction<[number, string]>) => {
      const [id, act] = action.payload
      const patient = state.entities[id]
      if (patient === undefined) return
      switch (act) {
        case 'Bleeding': patient.actionBleeding = !(patient.actionBleeding ?? false); break
        case 'Recovery': patient.actionRecovery = !(patient.actionRecovery ?? false); break
      }
    }
  }
})

export const { generatePatients, setCode, toggleReveal, toggleAction } = patientsSlice.actions
export default patientsSlice.reducer
