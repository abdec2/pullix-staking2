import { Box, Stack, Typography, Divider, Paper } from "@mui/material"
import { styled } from '@mui/material/styles';
import { useEffect, useState } from "react";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#1F2237',
    borderRadius: 0,
    padding: '10px',
    textAlign: 'center',
    boxShadow: 'none',
    
}));

const ItemWrapper = styled(Paper)(({ theme }) => ({
    borderRadius: 8,
    padding: '1px',
    background: 'linear-gradient(146deg, #C77515 0%, rgba(217, 133, 34, 0) 18%, rgba(221, 136, 37, 0.8) 29%, rgba(227, 141, 41, 0) 55%, rgba(234, 148, 47, 1) 80%, rgba(237, 151, 49, 0) 92%, #EF9933 100%)',
    backgroundSize: '160% 350px'
}));

const styles = {
    lockPeriod: {
        textAlign: 'left',
        fontWeight: 800,
        fontSize: '11px',
        lineHeight: '12px',
        color: '#9CA6B8'
    },
    timer: {
        color: '#EF9933',
        fontWeight: 800,
        fontSize: '28px',
        lineHeight: '28px',

    },
    timeCat: {
        color: '#9CA6B8',
        lineHeight: '10px',
        fontSize: '10px',
        position: 'absolute',
        mt: 1,
        width: '68px',
        textAlign: 'center'
    },
    lockAmount: {
        textAlign: 'center',
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
        fontSize: '16px',
        background: '#e6e6e6',
        border: '1px solid #ccc'
    },
    stakeChartvalue: {
        fontSize: '24px',
        fontWeight: 700,
        lineHeight: '30px'
    },
    txtInput: {
        border: '1px solid #C7C4C3',
        width: '100%',
        fontSize: '16px',
        padding: '18px 16px',
        background: '#e5e5e5',
        color: '#000515',
        borderRadius: 0
    },
    btn: {
        width: '100%',
        bgcolor: '#F5331E',
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

const Countdown = ({ deadline }) => {
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
        if (time > 0) {
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
        <Box> 
            <Stack >
                <Typography variant="p" sx={styles.lockPeriod}>{new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date(deadline))}</Typography>
            </Stack>

            <Stack
                direction="row"
                divider={<Divider />}
                spacing={0.9}
                sx={{ mt: '22px' }}
                alignItems='center'
            >
                    <Item>
                        <Typography variant="h3" sx={styles.timer} >{days < 10 ? "0" + days : isNaN(days) ? '00' : days}</Typography>
                    </Item>
                <Box sx={styles.timer}> : </Box>
                    <Item>
                        <Typography variant="h3" sx={styles.timer} >{hours < 10 ? "0" + hours : isNaN(hours) ? '00' : hours}</Typography>
                        {/* <Typography variant="h3" sx={styles.timeCat} >Hours</Typography> */}
                    </Item>
                <Box sx={styles.timer}> : </Box>
                    <Item>
                        <Typography variant="h3" sx={styles.timer} >{minutes < 10 ? "0" + minutes : isNaN(minutes) ? '00' : minutes}</Typography>
                        {/* <Typography variant="h3" sx={styles.timeCat} >Minutes</Typography> */}
                    </Item>
                <Box sx={styles.timer}> : </Box>
                    <Item>
                        <Typography variant="h3" sx={styles.timer} >{seconds < 10 ? "0" + seconds : isNaN(seconds) ? '00' : seconds}</Typography>
                        {/* <Typography variant="h3" sx={styles.timeCat} >Seconds</Typography> */}
                    </Item>
            </Stack>
        </Box>
            

           
    )
}

export default Countdown