import { Box, Stack, Typography, Divider, Paper } from "@mui/material"
import { styled } from '@mui/material/styles';
import { useEffect, useState } from "react";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#e5e5e5',
    borderRadius: 0,
    paddingTop: '1.25rem',
    paddingBottom: '1.25rem',
    textAlign: 'center',
    boxShadow: 'none',
    width: '68px'
}));

const styles = {
    lockPeriod: {
        textAlign: 'center',
        fontFamily: 'Space Grotesk',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '20px'
    },
    timer: {
        color: '#F5331E',
        fontFamily: 'Space Grotesk',
        fontWeight: 600,
        fontSize: '32px',
        lineHeight: '23px'

    },
    timeCat: {
        color: '#000515',
        lineHeight: '10px',
        fontSize: '12px',
        mt: 2
    },
    lockAmount: {
        textAlign: 'center',
        fontFamily: 'Space Grotesk',
        fontWeight: 500,
        fontSize: '18px',
        lineHeight: '16px',
        color: '#000515',
        opacity: 0.7,
        mt: 3
    },
    selectBox: {
        width: '120px',
        padding: '6px 10px',
        fontFamily: 'Space Grotesk',
        fontSize: '16px',
        background: '#e6e6e6',
        border: '1px solid #ccc'
    },
    stakeChartvalue: {
        fontFamily: 'Space Grotesk',
        fontSize: '24px',
        fontWeight: 700,
        lineHeight: '30px'
    },
    txtInput: {
        border: '1px solid #C7C4C3',
        width: '100%',
        fontSize: '16px',
        fontFamily: 'Space Grotesk',
        padding: '18px 16px',
        background: '#e5e5e5',
        color: '#000515',
        borderRadius: 0
    },
    btn: {
        width: '100%',
        bgcolor: '#F5331E',
        fontFamily: 'Space Grotesk',
        fontSize: '16px',
        borderRadius: 0,
        color: "#fff",
        py: 2,
        px: 2,
        '&:hover': {
            bgcolor: "#ff7262"
        }
    }
}

const Countdown = ({deadline}) => {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    
    const getTime = () => {
        const time = (deadline) - (new Date().getTime());
        setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
        setMinutes(Math.floor((time / 1000 / 60) % 60));
        setSeconds(Math.floor((time / 1000) % 60));
    };

    useEffect(() => {
        const time = (deadline) - (new Date().getTime());
        if(time > 0) {
            const interval = setInterval(() => getTime(deadline), 1000);
            return () => clearInterval(interval);
        } else {
            setDays(0);
            setHours(0);
            setMinutes(0);
            setSeconds(0);
        }
    }, [deadline]);


    return (
        <Stack
            direction="row"
            divider={<Divider />}
            spacing={1.5}
            sx={{ mt: '16px' }}
            alignItems='center'
        >
            <Item>
                <Typography variant="h3" sx={styles.timer} >{days < 10 ? "0" + days : isNaN(days) ? '00' : days}</Typography>
                <Typography variant="h3" sx={styles.timeCat} >Days</Typography>
            </Item>
            <Item>
                <Typography variant="h3" sx={styles.timer} >{hours < 10 ? "0" + hours : isNaN(hours) ? '00' : hours}</Typography>
                <Typography variant="h3" sx={styles.timeCat} >Hours</Typography>
            </Item>
            <Item>
                <Typography variant="h3" sx={styles.timer} >{minutes < 10 ? "0" + minutes : isNaN(minutes) ? '00' : minutes}</Typography>
                <Typography variant="h3" sx={styles.timeCat} >Minutes</Typography>
            </Item>
            <Item>
                <Typography variant="h3" sx={styles.timer} >{seconds < 10 ? "0" + seconds : isNaN(seconds) ? '00' : seconds}</Typography>
                <Typography variant="h3" sx={styles.timeCat} >Seconds</Typography>
            </Item>
        </Stack>
    )
}

export default Countdown