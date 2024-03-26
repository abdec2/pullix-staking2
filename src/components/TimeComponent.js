import React, { useContext, useState } from 'react'
import MainCard from './MainCard'
import { Box, Stack, Typography, Divider, Paper } from "@mui/material"

import { GlobalContext } from 'context/GlobalContext';
import { useAccount } from 'wagmi';
import Countdown from './Countdown';
import { formatUnits } from 'viem';
import { LockIcon, LogoSmall } from './icons/index';
import { Grid } from '../../node_modules/@mui/material/index';

const TimeComponent = () => {
    const { address, isConnected } = useAccount()
    const daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const { blockchainData } = useContext(GlobalContext)
    const [opt, setOpt] = useState(0)
    
    console.log(blockchainData)

    let symbol = "PLX"
    let decimals = 18

    let deadline = new Date().getTime()
    if(parseInt(blockchainData?.userStakes[opt]?.timestamp.toString()) > 0) {
        deadline = blockchainData.userStakes.length > 0 ? (parseInt(blockchainData?.userStakes[opt]?.timestamp.toString()) + parseInt(blockchainData?.pools[opt]?.duration.toString())) * 1000 : 0
        deadline = isNaN(deadline) ? 0 : deadline
        console.log(deadline)
    }
    

    let stakeAmount = blockchainData.userStakes.length > 0 ? (blockchainData?.userStakes[opt]?.amount) : 0
    stakeAmount = isNaN(stakeAmount) ? 0 : stakeAmount

    let rewardsEarned = blockchainData.rewards.length > 0 ? (blockchainData?.rewards[opt]) : 0
    rewardsEarned = isNaN(rewardsEarned) ? 0 : rewardsEarned
 
    const styles = {
        lockPeriod: {
            textAlign: 'left',
            fontWeight: 800,
            fontSize: '11px',
            lineHeight: '12px',
            color: '#9CA6B8'
        },
        timer: {
            color: '#F5331E',
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
            fontWeight: 500,
            fontSize: '11px',
            color: '#fff',
        },
        selectBox: {
            width: '90px',
            padding: '8px 12px',
            fontSize: '11px',
            background: '#161A28',
            border: "0.2px solid #EBEBEB",
            color: '#9D9D9D',
            borderRadius: '5px'
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

    const handleChange = (e) => {
        setOpt(e.target.value)
    }


    return (
        <MainCard sx={{px: 3, py: 2}} contentSX={{p:0}}>
            <Box>
                <Stack direction="row" alignItems="center" >
                    <LockIcon />
                    <Typography variant="h4" color="#9CA6B8" sx={{fontSize: '11px', fontWeight:'700', ml:1, mr:2, pr:2, borderRight: '1px solid #535A66'}} >Lock Period</Typography>
                    <select style={styles.selectBox} onChange={handleChange}>
                        <option value="0">30 Days</option>
                        <option value="1">90 Days</option>
                        <option value="2">180 Days</option>
                    </select>
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pb: 3, pl: 1, pr: 1, flexDirection: 'column', width: '100%', borderBottom: '1px solid #9CA6B8', mt: { xs:2, sm:1, md:0 } }}>
                    <Countdown deadline={deadline} />
                    
                </Box>
                <Grid container >
                    <Grid item xs={0} sm={4}></Grid>
                    <Grid item xs={12} sm={4}>
                        <Box 
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mt: 2,
                                width: '100%',
                            }}
                        >
                            <Typography variant="p"  sx={{...styles.lockAmount, color: '#9CA6B8'}}>Token Staked: &nbsp;  
                                <Typography variant="p" color="#fff" sx={{fontWeight: 'bold'}}> 
                                    {new Intl.NumberFormat("en-US").format(formatUnits(stakeAmount.toString(),decimals)) + " "+symbol}
                                </Typography>
                            </Typography>
                            <Typography variant="p" sx={{...styles.lockAmount, color: '#9CA6B8', display: 'flex'}}>Rewards Earned: &nbsp; 
                                <Typography color="#fff" sx={{fontWeight: 'bold', fontSize: '11px'}}>
                                    {parseFloat(formatUnits(rewardsEarned.toString(), decimals)).toFixed(5)} PLX
                                </Typography>
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4} >
                        <Box sx={{mt:1.65, float:'right' }}>
                            <LogoSmall />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    )
}

export default TimeComponent