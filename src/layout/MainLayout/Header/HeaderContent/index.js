// material-ui
import { Box, IconButton, Link, useMediaQuery, Typography, Button } from '@mui/material';
import { GithubOutlined } from '@ant-design/icons';

// project import
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import { ConnectBtn } from 'components/ConnectBtn';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';


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
                <Box

                >
                    {/* <ul style={styles.menu}>
                        <li>
                            Market
                        </li>
                        <li>
                            Platform
                        </li>
                        <li>
                            Promotions
                        </li>
                        <li>
                            PLX Token
                        </li>
                        <li>
                            Company
                        </li>
                    </ul> */}
                </Box>
                {/* <Typography variant="h4" sx={{
                    ml: 2
                }}>
                </Typography> */}
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    {/* <div style={{width: '1px', height:'28px', background:'#C7C8CC', marginRight: '9px'}}></div> */}
                    <ConnectBtn />
                    <div style={{width: '1px', height:'28px', background:'#C7C8CC', marginLeft: '24px', marginRight: '2px'}}></div>
                </Box>
            </Box>

        </>
    );
};

export default HeaderContent;
