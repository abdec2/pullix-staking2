import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const Loading = ({loading}) => {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: '9999' }}
            open={loading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}

export default Loading