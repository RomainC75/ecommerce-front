import './style/errorMessage.css'

interface errorInterface{
    message:string;
}

export const ErrorMessage = (props:errorInterface):JSX.Element => {
    const {message}=props
  return (
    <div className="ErrorMessage">{message}</div>
  )
}
