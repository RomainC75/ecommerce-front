import './style/footer.css'

interface FooterInterface {
  backgroundColor:'green'|'red';
}

const colorsObj = {
  green:'#287960',
  red:'#792828'
}

export const Footer = (props:FooterInterface) => {
  const {backgroundColor} = props
  return (
    <div className="Footer" style={{backgroundColor:colorsObj[backgroundColor]}}>
      <h3>BioCoop'</h3>
      <p>Made with ❤️ by Romain Chenard</p>
    </div>
  )
}
