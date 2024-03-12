import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, IconButton, Toolbar, useMediaQuery } from '@mui/material';

// project import
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';

// assets
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const Header = ({ open, handleDrawerToggle }) => {
    const theme = useTheme();
    const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

    const iconBackColor = 'none';
    const iconBackColorOpen = 'none';

    // common header
    const mainHeader = (
        <Toolbar sx={{paddingTop:'22px', paddingBottom:'22px', background: '#0B0C13'}}>
            {/* <IconButton
                disableRipple
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                edge="start"
                color="secondary"
                sx={{ color: 'white', bgcolor: open ? iconBackColorOpen : iconBackColor, ml: { xs: 0, lg: -2 } }}
            >
                {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </IconButton> */}
            <HeaderContent />
        </Toolbar>
    );

    // app-bar params
    const appBar = {
        position: 'relative',
        color: 'inherit',
        elevation: 0,
        sx: {
            //borderBottom: `1px solid ${theme.palette.divider}`
            // boxShadow: theme.customShadows.z1
        }
    };

    return (
        <>
            {!matchDownMD ? (
                <AppBarStyled open={open} {...appBar}>
                    {mainHeader}
                </AppBarStyled>
            ) : (
                <AppBar {...appBar}>{mainHeader}</AppBar>
            )}
        </>
    );
};

Header.propTypes = {
    open: PropTypes.bool,
    handleDrawerToggle: PropTypes.func
};

export default Header;
