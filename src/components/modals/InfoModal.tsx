import { type FunctionComponent } from 'preact'
import Modal from '.'
import Icon from '../Icon'

export const INFO_MODAL_ID = 'info'

const InfoModal: FunctionComponent = () => (
  <Modal name={INFO_MODAL_ID} title='About'>
    <div className="text-lg/6">
      <p className="mb-2">
        Welcome to <strong>NHS MITT Simulator</strong>! This tool helps you
        practise and build familiarity with mass casualty triage using the NHS
        Major Incident Triage Tool (MITT).
      </p>
      <p className="mb-2">
        View the official NHS England{' '}
        <a
          className="underline underline-offset-2"
          href="https://england.nhs.uk"
          target="_blank"
          rel="noopener noreferrer"
        >
          Major Incident Triage Tool (MITT)
        </a>.
      </p>
      <h3 className="text-2xl font-black mt-4 mb-2">How it works</h3>
      <ol className="mb-2 pl-2 list-disc list-inside">
        <li>
          Click <strong><Icon n="add" className='text-xl/6 align-bottom' /> New
          disaster</strong> (or <strong><Icon n="restart_alt" className='text-xl/6 align-bottom' /> New
          disaster</strong> in the top toolbar) to generate a new set of casualties.
        </li>
        <li>
          Select any dot in the casualty list to open that casualty’s triage
          tag. Once you assign a priority, the dot’s colour updates to reflect
          your choice.
        </li>
        <li>
          Follow the MITT flowchart to assess each casualty’s characteristics,
          perform any required immediate interventions, and assign a priority.
        </li>
        <li>
          <strong>Catastrophic bleeding?</strong> If YES: apply Pressure Dressing, Tourniquet, Haemostatic Packing and assign <strong>P1 (Red)</strong>.
        </li>
        <li>
          <strong>Walking?</strong> If YES: assign <strong>P3 (Green)</strong>.
        </li>
        <li>
          <strong>Breathing?</strong> If NO: assign <strong>Dead (Black)</strong> (best practice is to place in the Recovery Position).
        </li>
        <li>
          <strong>Responds to voice?</strong> If NO: Place in Recovery Position and assign <strong>P1 (Red)</strong>.
        </li>
        <li>
          <strong>Aged over 2 years?</strong> If NO (2 years or under): assign <strong>P1 (Red)</strong>.
        </li>
        <li>
          <strong>Breathing rate 12–23 /min?</strong> If NO: assign <strong>P1 (Red)</strong>.
        </li>
        <li>
          <strong>Heart rate 100 bpm or more?</strong> If YES: assign <strong>P1 (Red)</strong>; if NO: assign <strong>P2 (Yellow)</strong>.
        </li>
        <li>
          <strong>Why penetrating injury is not on MITT:</strong> TST includes penetrating torso injury to help non-clinical responders rapidly identify casualties at risk of sudden deterioration without measuring vital signs. When clinical responders reassess casualties using MITT, triage is based on current physiological parameters rather than injury mechanism alone.
        </li>
        <li>
          <strong>Clinical judgement override:</strong> Triage is dynamic—if a casualty with a penetrating torso injury is physiologically compensating (normal breathing rate, heart rate, and responsiveness), strict MITT scoring assigns <strong>P2 (Yellow)</strong>, while allowing clinicians to override the tool and upgrade or maintain <strong>P1 (Red)</strong> based on clinical judgement.
        </li>
        <li>
          Use <Icon n="visibility" className='text-xl/6 align-bottom' /> in the
          casualty list to reveal your results and view individual clinical
          feedback beneath each triage tag.
        </li>
      </ol>
      <h3 className="text-2xl font-black mt-4 mb-2">About the project</h3>
      <p className="mb-2">
        NHS MITT Simulator is an open-source project. You can view the source
        code, report issues, or leave feedback in the{' '}
        <a
          className="underline underline-offset-2"
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub repository
        </a>.
        You are currently running version {COMMIT_HASH}.
      </p>
      <p className="mb-2">
        Copyright © 2023 Alberto Coscia. Released under the GNU Affero General
        Public License v3.0 or later. Made in 🇪🇺 Italy, Europe.
      </p>
    </div>
  </Modal>
)

export default InfoModal
