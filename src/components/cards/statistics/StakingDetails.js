import PropTypes from 'prop-types';

// material-ui
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/StakingCard';
import { CornorRight } from 'components/icons'

// assets
import { RiseOutlined, FallOutlined } from '@ant-design/icons';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const StakingDetails = ({ children, color, title, count, percentage, isLoss, extra }) => (
    <MainCard sx={{mt:{xs: 1, sm:0}}}>
        <Stack>
            <Box sx={{display: 'flex', alignItems:'center',  pb: '17px', justifyContent: 'space-between', borderBottom: '1px solid #9CA6B8', marginBottom: '22px' }}>
                <Typography variant="h6" color="#EF9933" sx={{fontSize: '11px', fontWeight: 700}}>
                    {title}
                </Typography>

                {children}
            </Box>
            <Grid container alignItems="center">
                <Grid item sx={{width: '100%'}} >
                    <Box sx={{p:2, background:'#292E3E'}}>
                        <Typography variant="h4" color="inherit" sx={{color: "#fff", fontWeight: 400, fontSize: '16px'}}>
                            {count}
                        </Typography>
                    </Box>
                </Grid> 
                
            </Grid>
        </Stack>
        
    </MainCard>
);

StakingDetails.propTypes = {
    color: PropTypes.string,
    title: PropTypes.string,
    count: PropTypes.string,
    percentage: PropTypes.number,
    isLoss: PropTypes.bool,
    extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

StakingDetails.defaultProps = {
    color: 'primary'
};

export default StakingDetails;
