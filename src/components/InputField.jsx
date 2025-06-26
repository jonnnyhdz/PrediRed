export default function InputField({ name, value, onChange }) {
  return (
    <input
      type="text"
      name={name}
      placeholder={name.replaceAll('_', ' ')}
      value={value}
      onChange={onChange}
    />
  )
}
