import PropTypes from 'prop-types';

// material-ui
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/StakingCard';
import { CornorRight } from 'components/icons'

// assets
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from 'context/GlobalContext';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

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
        width: '128px',
        padding: '4px 4px',
        fontSize: '11px',
        background: '#161A28',
        border: '0.2px solid #EBEBEB',
        color: '#9D9D9D',
        borderRadius: '5px'
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
const ApyCard = ({ color, title, count = 0, percentage, isLoss, extra }) => {
    const [apyValue, setApyValue] = useState('');
    const { blockchainData } = useContext(GlobalContext)

    const handleChange = (e) => {
        setApyValue(blockchainData.apy[e.target.value])
    }

    useEffect(()=>{
        setApyValue(blockchainData.apy[0])
    }, [])

    return (
        <MainCard sx={{ mt: { xs: 1, sm: 0 } }}>
            <Stack>
                <Box sx={{display: 'flex', alignItems:'center', pb: '17px', justifyContent: 'space-between', borderBottom: '1px solid #9CA6B8', marginBottom: '22px'}}>
                    <Typography variant="h6" color="#EF9933" sx={{fontSize: '11px', marginLeft: '8px', fontWeight: 'bold'}}>
                        {title}
                    </Typography>
                    
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_1_139)">
                        <path d="M5.49998 6.41665L4.58331 5.49998L5.49998 4.58331L6.41665 5.49998L5.49998 6.41665ZM4.52602 3.72394L3.38019 2.5781L5.49998 0.458313L7.61977 2.5781L6.47394 3.72394L5.49998 2.74998L4.52602 3.72394ZM2.5781 7.61977L0.458313 5.49998L2.5781 3.38019L3.72394 4.52602L2.74998 5.49998L3.72394 6.47394L2.5781 7.61977ZM8.42186 7.61977L7.27602 6.47394L8.24998 5.49998L7.27602 4.52602L8.42186 3.38019L10.5416 5.49998L8.42186 7.61977ZM5.49998 10.5416L3.38019 8.42186L4.52602 7.27602L5.49998 8.24998L6.47394 7.27602L7.61977 8.42186L5.49998 10.5416Z" fill="#EF9933"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_1_139">
                        <rect width="11" height="11" fill="white"/>
                        </clipPath>
                        </defs>
                    </svg>
                </Box>
                <Grid container alignItems="center">
                    <Grid item sx={{ width: '100%' }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{px:2, py:1.85, background:'#292E3E'}} >
                            <Typography variant="h4" color="inherit" sx={{color: "#fff", fontWeight: 400, fontSize: '16px'}}>
                            {parseFloat(apyValue/100)+'%'}
                            </Typography>
                            <select style={styles.selectBox} onChange={handleChange}>
                                <option value="0">30 Days</option>
                                <option value="1">90 Days</option>
                                <option value="2">180 Days</option>
                            </select>
                        </Stack>
                    </Grid>

                </Grid>
            </Stack>

        </MainCard>
    )
};

ApyCard.propTypes = {
    color: PropTypes.string,
    title: PropTypes.string,
    count: PropTypes.string,
    percentage: PropTypes.number,
    isLoss: PropTypes.bool,
    extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

ApyCard.defaultProps = {
    color: 'primary'
};

export default ApyCard;
