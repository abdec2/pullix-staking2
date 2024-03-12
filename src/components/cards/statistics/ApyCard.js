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
            <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" color="textSecondary">
                        {title}
                    </Typography>
                    <CornorRight />
                </Box>
                <Grid container alignItems="center">
                    <Grid item sx={{ width: '100%' }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" >
                            <Typography variant="h4" color="inherit" sx={{ color: "#fff", fontWeight: 700, fontSize: '24px', lineHeight: '31px' }}>
                                {parseFloat(apyValue/100).toFixed(2)+'%'}
                            </Typography>
                            
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
