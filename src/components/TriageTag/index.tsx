import { type FunctionComponent } from 'preact'
import { patientById, useAppDispatch, useAppSelector } from '../../store'
import { setCode, toggleReveal, toggleAction } from '../../store/patients'
import { type Code, MITT } from '../../algorithm'
import TagRow from './TagRow'
import TagCell from './TagCell'
import TagTool from './TagTool'
import TagCodeButton from './TagCodeButton'
import Card from '../Card'
import { useTranslation } from 'react-i18next'
import { useCallback } from 'preact/hooks'
import { useHotkey } from '../../hooks'

const TagCodeSelector: FunctionComponent<{ value?: number, onChange: (code: Code) => void }> = ({ value, onChange }) => {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-4 h-20 text-white cursor-pointer">
      <TagCodeButton onClick={onChange} value={3} checked={value === 3} title={t('P1 (Red)')} className="bg-red-600" />
      <TagCodeButton onClick={onChange} value={2} checked={value === 2} title={t('P2 (Yellow)')} className="bg-amber-400" />
      <TagCodeButton onClick={onChange} value={1} checked={value === 1} title={t('P3 (Green)')} className="bg-green-600" />
      <TagCodeButton onClick={onChange} value={4} checked={value === 4} title={t('Dead (Black)')} className="bg-gray-900" />
    </div>
  )
}

const TriageTag: FunctionComponent = () => {
  const { t } = useTranslation()
  const currentPatientId = useAppSelector((state) => state.ui.currentPatient)
  const patient = useAppSelector((state) => patientById(state, currentPatientId ?? 0))
  const dispatch = useAppDispatch()

  const changeCode = useCallback((code: Code) => {
    if (currentPatientId === undefined) return
    dispatch(setCode([currentPatientId, code]))
  }, [currentPatientId, dispatch])

  const toggleRevealCharacteristic = useCallback((characteristic: string) => {
    if (currentPatientId === undefined) return
    dispatch(toggleReveal([currentPatientId, characteristic]))
  }, [currentPatientId, dispatch])

  const toggleActionButton = useCallback((action: string) => {
    if (currentPatientId === undefined) return
    dispatch(toggleAction([currentPatientId, action]))
  }, [currentPatientId, dispatch])

  useHotkey('1', () => { changeCode(3) }) // P1 = Red
  useHotkey('2', () => { changeCode(2) }) // P2 = Yellow
  useHotkey('3', () => { changeCode(1) }) // P3 = Green
  useHotkey('4', () => { changeCode(4) }) // Dead = Black

  if (currentPatientId === undefined) return <></>
  if (patient === undefined) return <></>

  return (
    <Card className='h-min'>
      <TagRow border>
        <TagCell title={t('Triage tag')} span={9} wrap>
          <p className='text-sm md:text-base font-normal text-gray-800 leading-snug'>
            {MITT.getVisualDescription(patient)}
          </p>
        </TagCell>
        <TagCell title={t('Age')} span={3}>{t('{{age}} yrs', { age: patient.age })}</TagCell>
      </TagRow>
      <TagRow>
        <TagCell title={t('Catastrophic bleeding?')} span={4}>
          {patient.revealedBleeding ? (patient.catastrophicBleeding ? t('Yes') : t('No')) : '--'}
        </TagCell>
        <TagCell title={t('Walking?')} span={4}>
          {patient.revealedWalking ? (patient.canWalk ? t('Yes') : t('No')) : '--'}
        </TagCell>
        <TagCell title={t('Breathing?')} span={4}>
          {patient.revealedBreathing ? (patient.breathing ? t('Yes') : t('No')) : '--'}
        </TagCell>
      </TagRow>
      <TagRow>
        <TagCell title={t('Responds to voice?')} span={4}>
          {patient.revealedVoice ? (patient.respondsToVoice ? t('Yes') : t('No')) : '--'}
        </TagCell>
        <TagCell title={t('Breathing rate')} span={4}>
          {patient.revealedBreathingRate ? (patient.breathing ? `${patient.breathingRate} /min` : '0 /min') : '--'}
        </TagCell>
        <TagCell title={t('Heart rate')} span={4}>
          {patient.revealedHeartRate ? (patient.breathing ? `${patient.heartRate} bpm` : '0 bpm') : '--'}
        </TagCell>
      </TagRow>

      <h4 className='text-xs font-bold uppercase tracking-wider text-gray-500 mt-4 mb-1 px-1'>
        {t('Characteristics')}
      </h4>
      <div className='grid grid-cols-3 md:grid-cols-6 h-auto md:h-20 text-white gap-1 mb-2'>
        <TagTool title={t('Check catastrophic bleeding')} label={t('Catastrophic bleeding?')} id='reveal-bleeding' onClick={() => toggleRevealCharacteristic('Bleeding')} active={patient.revealedBleeding} bgColor='bg-blue-600' />
        <TagTool title={t('Check walking')} label={t('Walking?')} id='reveal-walking' onClick={() => toggleRevealCharacteristic('Walking')} active={patient.revealedWalking} bgColor='bg-blue-600' />
        <TagTool title={t('Check breathing')} label={t('Breathing?')} id='reveal-breathing' onClick={() => toggleRevealCharacteristic('Breathing')} active={patient.revealedBreathing} bgColor='bg-blue-600' />
        <TagTool title={t('Check responds to voice')} label={t('Responds to voice?')} id='reveal-voice' onClick={() => toggleRevealCharacteristic('Voice')} active={patient.revealedVoice} bgColor='bg-blue-600' />
        <TagTool title={t('Check breathing rate')} label={t('Breathing rate')} id='reveal-rr' onClick={() => toggleRevealCharacteristic('BreathingRate')} active={patient.revealedBreathingRate} bgColor='bg-blue-600' />
        <TagTool title={t('Check heart rate')} label={t('Heart rate')} id='reveal-hr' onClick={() => toggleRevealCharacteristic('HeartRate')} active={patient.revealedHeartRate} bgColor='bg-blue-600' />
      </div>

      <h4 className='text-xs font-bold uppercase tracking-wider text-gray-500 mt-2 mb-1 px-1'>
        {t('Actions')}
      </h4>
      <div className='grid grid-cols-2 h-20 text-white gap-1 mb-2'>
        <TagTool title={t('Pressure Dressing, Tourniquet, Haemostatic Packing')} label={t('Pressure Dressing, Tourniquet, Haemostatic Packing')} id='action-bleeding' onClick={() => toggleActionButton('Bleeding')} active={patient.actionBleeding} bgColor={patient.actionBleeding ? 'bg-red-600' : 'bg-blue-600'} />
        <TagTool title={t('Place in Recovery Position')} label={t('Place in Recovery Position')} id='action-recovery' onClick={() => toggleActionButton('Recovery')} active={patient.actionRecovery} bgColor={patient.actionRecovery ? 'bg-red-600' : 'bg-blue-600'} />
      </div>

      <h4 className='text-xs font-bold uppercase tracking-wider text-gray-500 mt-2 mb-1 px-1'>
        {t('Priority')}
      </h4>
      <TagCodeSelector value={patient.assignedCode} onChange={(code: Code) => dispatch(setCode([patient.id, code]))} />
    </Card>
  )
}

export default TriageTag
