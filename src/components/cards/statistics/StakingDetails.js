import PropTypes from 'prop-types';

// material-ui
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/StakingCard';
import { CornorRight } from 'components/icons'

// assets
import { RiseOutlined, FallOutlined } from '@ant-design/icons';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const StakingDetails = ({ color, title, count, percentage, isLoss, extra }) => (
    <MainCard sx={{mt:{xs: 1, sm:0}}}>
        <Stack spacing={0.5}>
            <Box sx={{display: 'flex', alignItems:'center', background: '#000', minWidth: 'fit-content', maxWidth:'122px', p: 1.5, borderRadius: '9px', marginBottom: '30px' }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.73819 3.51611H0.717102C0.505513 3.51611 0.333984 3.68764 0.333984 3.89923V9.11003C0.333984 9.32162 0.505513 9.49315 0.717102 9.49315H2.73819C2.94978 9.49315 3.12131 9.32162 3.12131 9.11003V3.89923C3.12131 3.68764 2.94978 3.51611 2.73819 3.51611Z" fill="#EF9933"/>
                <path d="M9.40811 2.49463H7.38702C7.17543 2.49463 7.00391 2.66616 7.00391 2.87775V9.11021C7.00391 9.32179 7.17543 9.49332 7.38702 9.49332H9.40811C9.6197 9.49332 9.79123 9.32179 9.79123 9.11021V2.87775C9.79123 2.66616 9.6197 2.49463 9.40811 2.49463Z" fill="#EF9933"/>
                <path d="M6.07218 0.451172H4.05109C3.8395 0.451172 3.66797 0.6227 3.66797 0.834289V9.11007C3.66797 9.32166 3.8395 9.49319 4.05109 9.49319H6.07218C6.28379 9.49319 6.45529 9.32166 6.45529 9.11007V0.83431C6.45529 0.622722 6.28376 0.451172 6.07218 0.451172Z" fill="#EF9933"/>
                </svg>

                <Typography variant="h6" color="white" sx={{fontSize: '11px', marginLeft: '9px', fontWeight: 'bold'}}>
                    {title}
                </Typography>
            </Box>
            <Grid container alignItems="center">
                <Grid item>
                    <Typography variant="h4" color="inherit" sx={{color: "#fff", fontWeight: 900, fontSize: '27px', marginLeft: 4}}>
                        {count}
                    </Typography>
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
