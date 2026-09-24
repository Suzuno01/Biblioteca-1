const valid = (v) => (/^#[0-9a-f]{6}$/i.test(v || '') ? v : '#000000')

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="color-pick">
      <input type="color" value={valid(value)} onChange={(e) => onChange(e.target.value)} aria-label="Escolher cor" />
      <input
        type="text"
        className="input"
        value={value || ''}
        maxLength={7}
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
