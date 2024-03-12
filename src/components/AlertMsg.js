import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './styles/alert.css'

const MySwal = withReactContent(Swal)



export const AlertMsg = ({title, msg, icon}) => {
    MySwal.fire({
        icon,
        title,
        text: msg, 
        confirm
    })
}