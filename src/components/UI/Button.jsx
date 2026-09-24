export default function Button({ variant = '', icon: Icon, children, ...props }) {
  return (
    <button type="button" className={`btn ${variant}`} {...props}>
      {Icon && <Icon size={15} aria-hidden="true" />}
      {children}
    </button>
  )
}
