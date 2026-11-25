import { type FunctionComponent } from 'preact'
import { type Patient } from '../../algorithm'

interface CasualtyIllustrationProps {
  patient: Patient
}

const CasualtyIllustration: FunctionComponent<CasualtyIllustrationProps> = ({ patient }) => {
  const seed = patient.id
  const isMale = seed % 2 === 0
  const isInfant = patient.age <= 2
  const isChild = patient.age > 2 && patient.age < 12
  const isElderly = patient.age >= 65

  const skinTone = ['#f4c7a1', '#e0a980', '#c6865c', '#8d5538'][seed % 4]
  const hairColor = isElderly ? '#d1d5db' : ['#292524', '#4a3222', '#78350f', '#1e293b'][(seed >> 1) % 4]
  const topColor = ['#3b82f6', '#0d9488', '#6366f1', '#475569', '#d97706'][(seed >> 2) % 5]
  const trouserColor = ['#334155', '#1e293b', '#4b5563', '#3f6212'][seed % 4]

  const isSeated = !isInfant && patient.breathing && patient.respondsToVoice && seed % 3 === 1
  const isStanding = !isInfant && patient.canWalk && seed % 3 === 2
  const hasTorsoCue = !patient.catastrophicBleeding && patient.breathing && patient.respondsToVoice && (seed >> 1) % 10 >= 7

  const hairPath = isMale
    ? 'M18 9 Q26 1 34 9'
    : 'M17 12 Q18 1 26 2 Q34 1 35 12'

  const seatedHairPath = isMale
    ? 'M21 14 Q29 6 37 14'
    : 'M20 17 Q21 6 29 7 Q37 6 38 17'

  const lyingHairPath = isMale
    ? 'M13 30 Q21 22 29 30'
    : 'M12 33 Q13 22 21 23 Q29 22 30 33'

  let figureSvg = ''

  if (isInfant) {
    const bleedingSvg = patient.catastrophicBleeding
      ? '<ellipse cx="42" cy="26" rx="10" ry="6" fill="#dc2626" opacity="0.85"/><ellipse cx="44" cy="36" rx="14" ry="4" fill="#b91c1c" opacity="0.7"/>'
      : ''
    figureSvg = `
      <g transform="translate(36, 48)">
        <ellipse cx="34" cy="34" rx="30" ry="7" fill="#cbd5e1"/>
        <rect x="8" y="12" width="52" height="24" rx="12" fill="${topColor}"/>
        <path d="M18 14 L34 28 L50 14" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="2"/>
        <circle cx="18" cy="24" r="9" fill="${skinTone}"/>
        <path d="M13 18 Q18 14 23 18" stroke="${hairColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        ${bleedingSvg}
      </g>`
  } else if (isStanding) {
    const transform = isChild ? 'translate(46, 20) scale(0.84)' : 'translate(44, 10)'
    const torsoCueSvg = hasTorsoCue ? '<path d="M22 28 L29 33 L24 38" stroke="#1e293b" stroke-width="2" fill="none"/>' : ''
    figureSvg = `
      <g transform="${transform}">
        <ellipse cx="26" cy="76" rx="16" ry="4" fill="#cbd5e1"/>
        <rect x="17" y="44" width="7" height="31" rx="3.5" fill="${trouserColor}"/>
        <rect x="28" y="44" width="7" height="31" rx="3.5" fill="${trouserColor}"/>
        <rect x="14" y="21" width="24" height="26" rx="6" fill="${topColor}"/>
        ${torsoCueSvg}
        <rect x="8" y="23" width="5" height="22" rx="2.5" fill="${topColor}"/>
        <rect x="39" y="23" width="5" height="22" rx="2.5" fill="${topColor}"/>
        <circle cx="26" cy="11" r="8.5" fill="${skinTone}"/>
        <path d="${hairPath}" fill="${hairColor}"/>
      </g>`
  } else if (isSeated) {
    const transform = isChild ? 'translate(34, 28) scale(0.86)' : 'translate(30, 18)'
    const torsoCueSvg = hasTorsoCue ? '<path d="M29 36 L36 41 L31 46" stroke="#1e293b" stroke-width="2" fill="none"/>' : ''
    const bleedingSvg = patient.catastrophicBleeding
      ? '<ellipse cx="52" cy="58" rx="11" ry="6" fill="#dc2626" opacity="0.9"/><ellipse cx="54" cy="68" rx="16" ry="4" fill="#b91c1c" opacity="0.75"/>'
      : ''
    figureSvg = `
      <g transform="${transform}">
        <ellipse cx="40" cy="68" rx="26" ry="5" fill="#cbd5e1"/>
        <rect x="34" y="54" width="34" height="9" rx="4.5" fill="${trouserColor}"/>
        <rect x="22" y="27" width="22" height="32" rx="6" transform="rotate(-10 33 43)" fill="${topColor}"/>
        ${torsoCueSvg}
        <rect x="32" y="36" width="18" height="6" rx="3" transform="rotate(28 32 36)" fill="${skinTone}"/>
        <circle cx="29" cy="16" r="8.5" fill="${skinTone}"/>
        <path d="${seatedHairPath}" fill="${hairColor}"/>
        ${bleedingSvg}
      </g>`
  } else {
    const transform = isChild ? 'translate(22, 48) scale(0.86)' : 'translate(14, 42)'
    const torsoCueSvg = hasTorsoCue ? '<path d="M45 30 L52 35 L47 39" stroke="#1e293b" stroke-width="2" fill="none"/>' : ''
    const bleedingSvg = patient.catastrophicBleeding
      ? '<ellipse cx="78" cy="35" rx="11" ry="6" fill="#dc2626" opacity="0.9"/><ellipse cx="78" cy="44" rx="18" ry="4.5" fill="#b91c1c" opacity="0.75"/>'
      : ''
    figureSvg = `
      <g transform="${transform}">
        <ellipse cx="56" cy="44" rx="46" ry="5" fill="#cbd5e1"/>
        <rect x="64" y="30" width="36" height="10" rx="5" fill="${trouserColor}"/>
        <rect x="32" y="26" width="36" height="15" rx="6" fill="${topColor}"/>
        ${torsoCueSvg}
        <rect x="38" y="33" width="24" height="6" rx="3" fill="${skinTone}"/>
        <circle cx="21" cy="32" r="8.5" fill="${skinTone}"/>
        <path d="${lyingHairPath}" fill="${hairColor}"/>
        ${bleedingSvg}
      </g>`
  }

  const svg = `<svg xmlns="http://w3.org" viewBox="0 0 140 110"><rect x="0" y="84" width="140" height="26" fill="#e2e8f0"/><line x1="10" y1="84" x2="130" y2="84" stroke="#cbd5e1" stroke-width="1.5"/>${figureSvg}</svg>`
  const src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

  return (
    <div className="w-28 h-24 shrink-0 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
      <img src={src} alt="" className="w-full h-full object-cover" />
    </div>
  )
}

export default CasualtyIllustration
