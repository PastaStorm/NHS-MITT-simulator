import { randomInt, randomBool } from './utils'

export enum Code {
  DEAD = 4,
  P1 = 3,
  P2 = 2,
  P3 = 1
}

export interface Patient {
  id: number
  age: number
  code: Code
  assignedCode?: Code
  catastrophicBleeding: boolean
  canWalk: boolean
  breathing: boolean
  respondsToVoice: boolean
  breathingRate: number
  heartRate: number
  revealedBleeding?: boolean
  revealedWalking?: boolean
  revealedBreathing?: boolean
  revealedVoice?: boolean
  revealedBreathingRate?: boolean
  revealedHeartRate?: boolean
  actionBleeding?: boolean
  actionRecovery?: boolean
}

export enum Feedback {
  CODE_NOT_ASSIGNED,
  CODE_CORRECT,
  CODE_INCORRECT,
  CATASTROPHIC_BLEEDING_P1,
  WALKING_P3,
  WALKING_P3_NOTE,
  DEAD_NOT_BREATHING,
  DEAD_RECOVERY_NOTE,
  NO_VOICE_P1,
  AGE_UNDER_TWO_P1,
  BREATHING_RATE_P1,
  HEART_RATE_P1,
  OTHERWISE_P2,
  BLEEDING_ACTION_MISSING,
  BLEEDING_ACTION_CORRECT,
  BLEEDING_ACTION_INCORRECT,
  RECOVERY_ACTION_MISSING,
  RECOVERY_ACTION_CORRECT,
  RECOVERY_ACTION_INCORRECT,
  OVERTRIAGED_CATASTROPHIC_BLEEDING,
  OVERTRIAGED_WALKING,
  OVERTRIAGED_DEAD,
  OVERTRIAGED_NO_VOICE,
  OVERTRIAGED_AGE_UNDER_TWO,
  OVERTRIAGED_BREATHING_RATE,
  MISSING_CHECK_WALKING,
  MISSING_CHECK_BREATHING,
  MISSING_CHECK_VOICE,
  MISSING_CHECK_BREATHING_RATE,
  MISSING_CHECK_HEART_RATE,
}

class MajorIncidentTriageTool {
  newPatient (id?: number): Patient {
    const age = randomInt(0, 80)
    const breathing = randomBool(0.95)
    const catastrophicBleeding = breathing ? randomBool(0.18) : false
    const canWalk = breathing && !catastrophicBleeding && age >= 2 ? randomBool(0.32) : false
    const respondsToVoice = canWalk ? true : (breathing ? randomBool(0.82) : false)

    let breathingRate = 0
    let heartRate = 0
    if (breathing) {
      const abnormalRR = randomBool(0.25)
      if (abnormalRR) {
        breathingRate = randomBool(0.3) ? randomInt(6, 11) : randomInt(24, 38)
      } else {
        breathingRate = randomInt(12, 23)
      }

      const abnormalHR = randomBool(0.3)
      heartRate = abnormalHR ? randomInt(100, 145) : randomInt(62, 99)
    }

    const patient: Patient = {
      id: id ?? randomInt(0, 500),
      age,
      catastrophicBleeding,
      canWalk,
      breathing,
      respondsToVoice,
      breathingRate,
      heartRate,
      code: Code.P2,
      revealedBleeding: false,
      revealedWalking: false,
      revealedBreathing: false,
      revealedVoice: false,
      revealedBreathingRate: false,
      revealedHeartRate: false,
      actionBleeding: false,
      actionRecovery: false
    }

    return { ...patient, code: this.getCode(patient) }
  }

  getVisualDescription (patient: Patient): string {
    const seed = patient.id
    const sex = seed % 2 === 0 ? 'male' : 'female'
    const pronoun = sex === 'male' ? 'his' : 'her'

    let subject: string
    if (patient.age < 2) {
      subject = `An infant (${sex})`
    } else if (patient.age < 12) {
      subject = `A ${sex} child`
    } else if (patient.age < 18) {
      subject = `A teenage ${sex}`
    } else if (patient.age >= 65) {
      subject = `An elderly ${sex}`
    } else {
      subject = `An adult ${sex}`
    }

    let posture: string
    if (patient.age < 2) {
      posture = [
        'being held near the scene',
        'lying on a blanket on the ground',
        'wrapped in a jacket beside the walkway'
      ][seed % 3]
    } else {
      const lyingPostures = [
        'lying on the floor',
        'lying curled on their side',
        'lying flat on their back',
        'lying near the edge of the walkway',
        'slumped against the wall'
      ]
      const seatedPostures = [
        'seated on the ground',
        'sitting on the kerb with head bowed'
      ]
      const uprightPostures = [
        'crouching near the edge of the area',
        'leaning heavily against a barrier',
        'standing nearby looking disoriented'
      ]

      let availablePostures = lyingPostures
      if (patient.breathing && patient.respondsToVoice) {
        availablePostures = patient.canWalk
          ? [...lyingPostures, ...seatedPostures, ...uprightPostures]
          : [...lyingPostures, ...seatedPostures]
      }
      posture = availablePostures[seed % availablePostures.length]
    }
    const generalCues = [
      `with superficial grazes to ${pronoun} palms`,
      `covered in dust and holding ${pronoun} shoulder`,
      `with minor cuts on ${pronoun} forearm`,
      'appearing shaken with no obvious major wounds',
      `nursing a bruised ankle and smeared with soot`,
      `with a small graze across ${pronoun} forehead`,
      `holding ${pronoun} wrist and looking dazed`,
      `clutching ${pronoun} chest with torn clothing`,
      `holding a hand over ${pronoun} abdomen`,
      `guarding ${pronoun} ribs and wincing`
    ]

    let injuryCue: string
    if (patient.catastrophicBleeding) {
      const bleedingCues = [
        `with heavy blood soaking through ${pronoun} clothing`,
        `holding ${pronoun} right thigh with dark arterial staining on ${pronoun} trousers`,
        `with a blood-soaked sleeve pressed against ${pronoun} arm`,
        `with pooling blood visible near ${pronoun} lower leg`,
        `clutching a blood-saturated cloth to ${pronoun} upper leg`,
        `with dark wet patches rapidly spreading across ${pronoun} jacket`
      ]
      injuryCue = bleedingCues[(seed >> 1) % bleedingCues.length]
    } else if (!patient.breathing || !patient.respondsToVoice) {
      const unresponsiveCues = [
        'with eyes closed and appearing very still',
        'not responding to the noise around them',
        'lying quietly with dust and debris on their clothes',
        'looking pale and unresponsive to nearby shouting',
        `motionless with ${pronoun} head tilted to one side`,
        'making no sound and showing no obvious movement'
      ]
      injuryCue = unresponsiveCues[(seed >> 1) % unresponsiveCues.length]
    } else {
      injuryCue = generalCues[(seed >> 1) % generalCues.length]
    }

    return `${subject} ${posture} ${injuryCue}.`
  }

  getCode (p: Patient): Code {
    if (p.catastrophicBleeding) return Code.P1
    if (p.canWalk) return Code.P3
    if (!p.breathing) return Code.DEAD
    if (!p.respondsToVoice) return Code.P1
    if (p.age < 2) return Code.P1
    if (p.breathingRate < 12 || p.breathingRate > 23) return Code.P1
    if (p.heartRate >= 100) return Code.P1
    return Code.P2
  }

  getFeedback (p: Patient): Feedback[] {
    const feedback: Feedback[] = []

    if (p.assignedCode === undefined) {
      feedback.push(Feedback.CODE_NOT_ASSIGNED)
    } else if (p.assignedCode !== p.code) {
      feedback.push(Feedback.CODE_INCORRECT)
    } else {
      feedback.push(Feedback.CODE_CORRECT)
    }

    // Priority reason
    if (p.catastrophicBleeding) {
      feedback.push(Feedback.CATASTROPHIC_BLEEDING_P1)
    } else if (p.canWalk) {
      feedback.push(Feedback.WALKING_P3)
      feedback.push(Feedback.WALKING_P3_NOTE)
    } else if (!p.breathing) {
      feedback.push(Feedback.DEAD_NOT_BREATHING)
      feedback.push(Feedback.DEAD_RECOVERY_NOTE)
    } else if (!p.respondsToVoice) {
      feedback.push(Feedback.NO_VOICE_P1)
    } else if (p.age < 2) {
      feedback.push(Feedback.AGE_UNDER_TWO_P1)
    } else if (p.breathingRate < 12 || p.breathingRate > 23) {
      feedback.push(Feedback.BREATHING_RATE_P1)
    } else if (p.heartRate >= 100) {
      feedback.push(Feedback.HEART_RATE_P1)
    } else {
      feedback.push(Feedback.OTHERWISE_P2)
    }

    // Required & improper actions
    if (p.catastrophicBleeding) {
      if (p.actionBleeding) {
        feedback.push(Feedback.BLEEDING_ACTION_CORRECT)
      } else {
        feedback.push(Feedback.BLEEDING_ACTION_MISSING)
      }
    } else if (p.actionBleeding) {
      feedback.push(Feedback.BLEEDING_ACTION_INCORRECT)
    }

    if (p.breathing && !p.respondsToVoice && !p.catastrophicBleeding && !p.canWalk) {
      if (p.actionRecovery) {
        feedback.push(Feedback.RECOVERY_ACTION_CORRECT)
      } else {
        feedback.push(Feedback.RECOVERY_ACTION_MISSING)
      }
    } else if (p.actionRecovery && p.respondsToVoice) {
      feedback.push(Feedback.RECOVERY_ACTION_INCORRECT)
    }

    // Missed checks along the MITT pathway
    if (!p.catastrophicBleeding && !p.revealedWalking) {
      feedback.push(Feedback.MISSING_CHECK_WALKING)
    } else if (!p.catastrophicBleeding && !p.canWalk && !p.revealedBreathing) {
      feedback.push(Feedback.MISSING_CHECK_BREATHING)
    } else if (!p.catastrophicBleeding && !p.canWalk && p.breathing && !p.revealedVoice) {
      feedback.push(Feedback.MISSING_CHECK_VOICE)
    } else if (!p.catastrophicBleeding && !p.canWalk && p.breathing && p.respondsToVoice && p.age >= 2 && !p.revealedBreathingRate) {
      feedback.push(Feedback.MISSING_CHECK_BREATHING_RATE)
    } else if (!p.catastrophicBleeding && !p.canWalk && p.breathing && p.respondsToVoice && p.age >= 2 && p.breathingRate >= 12 && p.breathingRate <= 23 && !p.revealedHeartRate) {
      feedback.push(Feedback.MISSING_CHECK_HEART_RATE)
    }

    // Overtriage checks
    if (p.catastrophicBleeding && (p.revealedWalking || p.revealedBreathing || p.revealedVoice || p.revealedBreathingRate || p.revealedHeartRate)) {
      feedback.push(Feedback.OVERTRIAGED_CATASTROPHIC_BLEEDING)
    } else if (p.canWalk && (p.revealedBreathing || p.revealedVoice || p.revealedBreathingRate || p.revealedHeartRate)) {
      feedback.push(Feedback.OVERTRIAGED_WALKING)
    } else if (!p.breathing && (p.revealedVoice || p.revealedBreathingRate || p.revealedHeartRate)) {
      feedback.push(Feedback.OVERTRIAGED_DEAD)
    } else if (!p.respondsToVoice && (p.revealedBreathingRate || p.revealedHeartRate)) {
      feedback.push(Feedback.OVERTRIAGED_NO_VOICE)
    } else if (p.age < 2 && (p.revealedBreathingRate || p.revealedHeartRate)) {
      feedback.push(Feedback.OVERTRIAGED_AGE_UNDER_TWO)
    } else if ((p.breathingRate < 12 || p.breathingRate > 23) && p.revealedHeartRate) {
      feedback.push(Feedback.OVERTRIAGED_BREATHING_RATE)
    }

    return feedback
  }
}

export const MITT = new MajorIncidentTriageTool()
