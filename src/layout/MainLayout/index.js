import { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Toolbar, useMediaQuery } from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import navigation from 'menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// types
import { openDrawer } from 'store/reducers/menu';
import { GlobalContext } from 'context/GlobalContext';
import Loading from 'components/loadingModals/Loading';
import ResponsiveAppBar from './AppBar/index';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const theme = useTheme();
    const { blockchainData } = useContext(GlobalContext)
    const matchDownLG = useMediaQuery(theme.breakpoints.down('xl'));
    const dispatch = useDispatch();

    const { drawerOpen } = useSelector((state) => state.menu);

    // drawer toggler
    const [open, setOpen] = useState(drawerOpen);
    const handleDrawerToggle = () => {
        setOpen(!open);
        dispatch(openDrawer({ drawerOpen: !open }));
    };

    // set media wise responsive drawer
    useEffect(() => {
        setOpen(!matchDownLG);
        dispatch(openDrawer({ drawerOpen: !matchDownLG }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDownLG]);

    useEffect(() => {
        if (open !== drawerOpen) setOpen(drawerOpen);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drawerOpen]);

    return (
        <>
            <Loading loading={blockchainData.loading} />
            <Box sx={{ display: 'flex', width: '100%' }} style={{background: 'url(/assets/bg.png)', backgroundAttachment: 'fixed', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', minHeight: '100vh'}}>
                <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
                <Box component="main" style={{maxWidth: '1147px'}} sx={{ mx:'auto', width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                    <Header open={open} handleDrawerToggle={handleDrawerToggle} />
                    {/* <Toolbar /> */}
                    {/* <Breadcrumbs navigation={navigation} title titleBottom card={false} divider={false} /> */}
                    <Outlet />
                </Box>
            </Box>
        </>
    );
};

export default MainLayout;
