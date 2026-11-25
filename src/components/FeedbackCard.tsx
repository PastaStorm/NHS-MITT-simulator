import { type FunctionComponent } from 'preact'
import Card, { CardHeader } from './Card'
import { patientById, useAppDispatch, useAppSelector } from '../store'
import { Feedback, MITT } from '../algorithm'
import { toggleFeedback } from '../store/ui'
import Icon from './Icon'
import { useTranslation } from 'react-i18next'
import { codeToLabel } from '../utils'

const FeedbackCard: FunctionComponent = () => {
  const currentPatientId = useAppSelector((state) => state.ui.currentPatient)
  const patient = useAppSelector((state) => patientById(state, currentPatientId ?? 0))
  const revealFeedback = useAppSelector((state) => state.ui.revealFeedback)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const onToggleFeedback = (): void => {
    dispatch(toggleFeedback())
  }

  const feedbackToString = (fb: Feedback): string => {
    switch (fb) {
      case Feedback.CODE_NOT_ASSIGNED: return t('Incorrect: You did not assign a priority to this casualty.')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      case Feedback.CODE_CORRECT: return t('Correct MITT Priority: {{c}}', { c: t(codeToLabel(patient!.code)) })
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      case Feedback.CODE_INCORRECT: return t('Incorrect: MITT indicates {{c}}; you assigned {{a}}.', { c: t(codeToLabel(patient!.code)), a: t(codeToLabel(patient!.assignedCode!)) })
      case Feedback.CATASTROPHIC_BLEEDING_P1: return t('Catastrophic bleeding: classify as P1 (Red).')
      case Feedback.WALKING_P3: return t('Walking: classify as P3 (Green).')
      case Feedback.WALKING_P3_NOTE: return t('P3 casualties should be directed towards a place of safety.')
      case Feedback.DEAD_NOT_BREATHING: return t('Not breathing: classify as Dead (Black).')
      case Feedback.DEAD_RECOVERY_NOTE: return t('Best Practice is Place in Recovery Position.')
      case Feedback.NO_VOICE_P1: return t('Does not respond to voice: classify as P1 (Red).')
      case Feedback.AGE_UNDER_TWO_P1: return t('Not aged over 2 years: classify as P1 (Red).')
      case Feedback.BREATHING_RATE_P1: return t('Breathing rate outside 12–23 /min ({{rr}} /min): classify as P1 (Red).', { rr: patient?.breathingRate })
      case Feedback.HEART_RATE_P1: return t('Heart rate 100 bpm or more ({{hr}} bpm): classify as P1 (Red).', { hr: patient?.heartRate })
      case Feedback.OTHERWISE_P2: return t('No P1 or P3 criteria apply: classify as P2 (Yellow).')
      case Feedback.BLEEDING_ACTION_MISSING: return t('Incorrect: You failed to complete the required action for this casualty: Pressure Dressing, Tourniquet, Haemostatic Packing.')
      case Feedback.BLEEDING_ACTION_CORRECT: return t('Correct: You applied Pressure Dressing, Tourniquet, Haemostatic Packing.')
      case Feedback.BLEEDING_ACTION_INCORRECT: return t('Incorrect: You applied Pressure Dressing, Tourniquet, Haemostatic Packing when there was no catastrophic bleeding.')
      case Feedback.RECOVERY_ACTION_MISSING: return t('Incorrect: You failed to complete the required action for this casualty: Place in Recovery Position.')
      case Feedback.RECOVERY_ACTION_CORRECT: return t('Correct: You placed the casualty in the Recovery Position.')
      case Feedback.RECOVERY_ACTION_INCORRECT: return t('Incorrect: You attempted to place a casualty who responds to voice in the Recovery Position.')
      case Feedback.OVERTRIAGED_CATASTROPHIC_BLEEDING: return t('Incorrect: You overtriaged; catastrophic bleeding is triaged as P1 so the additional checks are irrelevant.')
      case Feedback.OVERTRIAGED_WALKING: return t('Incorrect: You overtriaged; a walking casualty is triaged as P3 so the additional checks are irrelevant.')
      case Feedback.OVERTRIAGED_DEAD: return t('Incorrect: You overtriaged; a non-breathing casualty is triaged as Dead (Black) so the additional checks are irrelevant.')
      case Feedback.OVERTRIAGED_NO_VOICE: return t('Incorrect: You overtriaged; a casualty who does not respond to voice is triaged as P1 so the additional checks are irrelevant.')
      case Feedback.OVERTRIAGED_AGE_UNDER_TWO: return t('Incorrect: You overtriaged; casualties not aged over 2 years are triaged as P1 so checking breathing rate or heart rate is irrelevant.')
      case Feedback.OVERTRIAGED_BREATHING_RATE: return t('Incorrect: You overtriaged by checking heart rate when the breathing rate was already outside 12–23 /min (P1).')
      case Feedback.MISSING_CHECK_BLEEDING: return t('Incorrect: You failed to check for catastrophic bleeding.')
      case Feedback.MISSING_CHECK_WALKING: return t('Incorrect: You failed to check if the casualty was walking.')
      case Feedback.MISSING_CHECK_BREATHING: return t('Incorrect: You failed to check if the casualty was breathing.')
      case Feedback.MISSING_CHECK_VOICE: return t('Incorrect: You failed to check if the casualty responds to voice.')
      case Feedback.MISSING_CHECK_BREATHING_RATE: return t('Incorrect: You failed to check the casualty’s breathing rate.')
      case Feedback.MISSING_CHECK_HEART_RATE: return t('Incorrect: You failed to check the casualty’s heart rate.')
    }
  }

  if (currentPatientId === undefined) return <></>
  if (patient === undefined) return <></>

  const feedback = MITT.getFeedback(patient)
  const [firstFeedback] = feedback
  const reasonIndex = feedback.findIndex(fb => [
    Feedback.CATASTROPHIC_BLEEDING_P1,
    Feedback.WALKING_P3,
    Feedback.DEAD_NOT_BREATHING,
    Feedback.NO_VOICE_P1,
    Feedback.AGE_UNDER_TWO_P1,
    Feedback.BREATHING_RATE_P1,
    Feedback.HEART_RATE_P1,
    Feedback.OTHERWISE_P2
  ].includes(fb))

  const lines: string[] = []
  if (feedback.length > 0) {
    if (reasonIndex > 0) {
      lines.push(`${feedbackToString(firstFeedback)}: ${feedbackToString(feedback[reasonIndex])}`)
      feedback.forEach((fb, idx) => {
        if (idx !== 0 && idx !== reasonIndex) {
          lines.push(feedbackToString(fb))
        }
      })
    } else {
      feedback.forEach(fb => lines.push(feedbackToString(fb)))
    }
  }

  return (
    <Card className="mt-3">
      <CardHeader title={t('Feedback')}>
        <button
          className="cursor-pointer"
          title={revealFeedback ? t('Hide feedback on casualty') : t('Show feedback on casualty')}
          aria-label={revealFeedback ? t('Hide feedback on casualty') : t('Show feedback on casualty')}
          onClick={onToggleFeedback}
        >
          <Icon
            n={revealFeedback ? 'visibility_off' : 'visibility'}
            className="text-4xl leading-4 align-middle"
          />
        </button>
      </CardHeader>
      {revealFeedback &&
        <div className="p-2">
          <ol className="list-name text-lg">
            {lines.map((line, i) => <li key={i}>{line}</li>)}
          </ol>
        </div>
      }
    </Card>
  )
}

export default FeedbackCard
