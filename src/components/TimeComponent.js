import React, { useContext, useState } from 'react'
import MainCard from './MainCard'
import { Box, Stack, Typography, Divider, Paper } from "@mui/material"

import { GlobalContext } from 'context/GlobalContext';
import { useAccount } from 'wagmi';
import Countdown from './Countdown';
import { ethers } from '../../node_modules/ethers/lib/index';
import { CONFIG } from 'configs/config';

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
    

    let stakeAmount = blockchainData.userStakes.length > 0 ? (parseInt(blockchainData?.userStakes[opt]?.amount.toString())) : 0
    stakeAmount = isNaN(stakeAmount) ? 0 : stakeAmount


    let rewardsEarned = blockchainData.rewards.length > 0 ? (parseInt(blockchainData?.rewards[opt]?.toString())) : 0
    rewardsEarned = isNaN(rewardsEarned) ? 0 : rewardsEarned
 
    const styles = {
        lockPeriod: {
            textAlign: 'center',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '20px',
            color: '#fff'
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
            width: '128px',
            padding: '12px 22px',
            fontSize: '11px',
            background: 'none',
            border: '1px solid #EF9933',
            color: '#fff',
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
        <MainCard >
            <Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h4" color="#fff" >Lock Period</Typography>
                    <select style={styles.selectBox} onChange={handleChange}>
                        <option value="0">30 Days</option>
                        <option value="1">90 Days</option>
                        <option value="2">180 Days</option>
                    </select>
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 4.5, pb: 3.5, pl: 1, pr: 1, flexDirection: 'column' }}>
                    <Stack spacing={1}>
                        <Typography variant="p" sx={styles.lockPeriod}>{new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date(deadline))}</Typography>
                    </Stack>
                    {/* Countdown */}
                    <Countdown deadline={deadline} />
                    <div style={{width: '316px', marginTop: '22px'}}>
                        <Box 
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mt: 2.75,
                                width: '100%',
                            }}
                        >
                            <Typography variant="p"  sx={{...styles.lockAmount, color: '#9CA6B8'}}>Token Staked: &nbsp;  
                                <Typography variant="p" color="#fff" sx={{fontWeight: 'bold'}}> 
                                    {new Intl.NumberFormat("en-US").format(ethers.utils.formatUnits(stakeAmount.toString(),decimals)) + " "+symbol}
                                </Typography>
                            </Typography>
                            <Typography variant="p" sx={{...styles.lockAmount, color: '#9CA6B8', display: 'flex'}}>Rewards Earned: &nbsp; 
                                <Typography color="#fff" sx={{fontWeight: 'bold', fontSize: '11px'}}>
                                    {parseFloat(ethers.utils.formatUnits(rewardsEarned.toString(), decimals)).toFixed(5)} PLX
                                </Typography>
                            </Typography>
                        </Box>
                    </div>
                </Box>
            </Box>
        </MainCard>
    )
}

export default TimeComponent