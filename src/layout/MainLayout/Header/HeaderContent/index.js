// material-ui
import { Box, IconButton, Link, useMediaQuery, Typography, Button } from '@mui/material';
import { GithubOutlined } from '@ant-design/icons';

// project import
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
import { ChevronDown, EnFlag } from 'components/icons/index';
import { Stack } from '../../../../../node_modules/@mui/material/index';


// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
    const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const styles = {
        menu: {
            listStyle: 'none',
            color:'#fff',
            display: 'flex', 
            '& li' : {
                marginLeft: '10px',
                marginRight: '10px'
            }
        }
    }

    return (
        <>
            <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                    
                }}
            >
                <Box>
            
                </Box>
               
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    {/* <div style={{width: '1px', height:'28px', background:'#C7C8CC', marginRight: '9px'}}></div> */}
                    {/* <ConnectBtn /> */}
                    <w3m-button />
                    <div style={{width: '1px', height:'28px', background:'#C7C8CC', marginLeft: '24px', marginRight: '2px'}}></div>
                    <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={1.5} sx={{ml:3}}>
                        <EnFlag />
                        <ChevronDown />
                    </Stack>
                </Box>
            </Box>

        </>
    );
};

export default HeaderContent;
