import { useContext, useEffect, useRef, useState } from 'react';
// import { addDoc, collection, serverTimestamp } from "@firebase/firestore"
// import { firestore } from '../../firebaseConfig'

// material-ui
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    Input,
    Typography,
    Paper,
    Select,
    InputLabel,
    FormControl,
    Radio,
    RadioGroup,
    FormControlLabel
} from '@mui/material';

// project import
import IncomeAreaChart from './IncomeAreaChart';
import MainCard from 'components/MainCard';
import StakingDetail from 'components/cards/statistics/StakingDetails';
import ApyCard from 'components/cards/statistics/ApyCard';
import { styled } from '@mui/material/styles';
import TimeComponent from 'components/TimeComponent';
import { AlertMsg } from 'components/AlertMsg'
import StakeAbi from './../../configs/staking.json'
import TokenAbi from './../../configs/token.json'


// assets
import { USDT, ORBN } from "components/icons"
import { GlobalContext } from 'context/GlobalContext';
import { CONFIG } from 'configs/config';
import { ethers } from 'ethers';
import { useAccount, useSigner } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import useAccountData from 'hooks/useAccountData';
import useGetRewards from 'hooks/useGetRewards';

// avatar style
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

// styles
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
        py: 1.8,
        px: 2,
        '&:hover': {
            bgcolor: "#ff7262"
        }
    },
    btn1: {
        width: '100%',
        bgcolor: '#e5e5e5',
        fontFamily: 'Space Grotesk',
        fontSize: '16px',
        borderRadius: 0,
        border: '1px solid #000515',
        color: "#000515",
        py: 1.8,
        px: 2,
        '&:hover': {
            bgcolor: "#C7C8CC"
        }
    }
}

// action style
const actionSX = {
    mt: 0.75,
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
};

// sales report status
const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

const Token = styled(Paper)(({ theme }) => ({
    background: "#ffffff",
    borderRadius: 0,
    padding: "12px",
    boxShadow: "none",
    width: "100%"
}))


// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
    const { address, isConnected } = useAccount()
    const { data: signer } = useSigner()
    const { openConnectModal } = useConnectModal()
    const { blockchainData, updateLoading, fetchData } = useContext(GlobalContext)
    const txtAmount = useRef()
    const selPid = useRef()

    const refetchAccountData = useAccountData()
    const refetchRewards = useGetRewards()

    const totalLockedValue = (parseFloat(blockchainData.lockedTokens.orbn) * 0.1125 + (parseFloat(blockchainData.lockedTokens.usdt) * parseFloat(1)))

    const handleRewards = async () => {
        if (!isConnected) {
            openConnectModal()
            return
        }
        const _pid = selPid.current.value
        if (_pid == "") {
            AlertMsg({ title: 'Oops!', msg: 'Select Lock Options', icon: 'error' })
            return
        }

        try {
            updateLoading(true)
            const contract = new ethers.Contract(CONFIG.STAKING_CONTRACT, StakeAbi, signer)
            const estimate = await contract.estimateGas.getRewards(_pid)
            const rewardsTx = await contract.getRewards(_pid, { gasLimit: estimate.toString() })
            await rewardsTx.wait()
            console.log(rewardsTx)
            updateLoading(false)
            fetchData()
            refetchAccountData()
            refetchRewards()
            AlertMsg({ title: 'Congratulation!', msg: 'Your transaction has been completed successfully', icon: 'success' })
        } catch (e) {
            updateLoading(false)
            AlertMsg({ title: 'Oops!', msg: 'Something went wrong', icon: 'error' })
        }
    }

    const approve = async (amount, tokenAddress) => {
        const contract = new ethers.Contract(tokenAddress, TokenAbi, signer)
        const estimate = await contract.estimateGas.increaseAllowance(CONFIG.STAKING_CONTRACT, amount)
        const approveTx = await contract.increaseAllowance(CONFIG.STAKING_CONTRACT, amount, { gasLimit: estimate.toString() })
        await approveTx.wait()
        console.log(approveTx)
    }

    const deposit = async (pid, amount) => {
        const contract = new ethers.Contract(CONFIG.STAKING_CONTRACT, StakeAbi, signer)
        const estimate = await contract.estimateGas.deposit(pid, amount)
        const stakeTx = await contract.deposit(pid, amount, { gasLimit: estimate.toString() })
        await stakeTx.wait()
        console.log(stakeTx)
    }

    const withdraw = async (pid, amount) => {
        const contract = new ethers.Contract(CONFIG.STAKING_CONTRACT, StakeAbi, signer)
        const estimate = await contract.estimateGas.exit(pid, amount)
        const stakeTx = await contract.exit(pid, amount, { gasLimit: estimate.toString() })
        await stakeTx.wait()
        console.log(stakeTx)
    }

    const handleStake = async () => {
        if (!isConnected) {
            openConnectModal()
            return
        }
        const _pid = selPid.current.value
        let amount = txtAmount.current.value
        if (_pid == "") {
            AlertMsg({ title: 'Oops!', msg: 'Select Lock Options', icon: 'error' })
            return
        }
        if (amount == "") {
            AlertMsg({ title: 'Oops!', msg: 'Enter Valid Amount', icon: 'error' })
            return
        }
        const decimal = parseInt(_pid) < 5 ? CONFIG.ORBN_DECIMALS : CONFIG.USDT_DECIMALS
        const tokenAddress = parseInt(_pid) < 5 ? CONFIG.ORBN_ADDRESS : CONFIG.USDT_ADDRESS
        try {
            amount = ethers.utils.parseUnits(amount, decimal)
        } catch (e) {
            AlertMsg({ title: 'Oops!', msg: 'Enter Valid Amount', icon: 'error' })
            return
        }

        try {
            updateLoading(true)
            await approve(amount, tokenAddress)
            await deposit(_pid, amount)
            fetchData()
            refetchAccountData()
            refetchRewards()
            updateLoading(false)
            AlertMsg({ title: 'Congratulation!', msg: 'Your transaction has been completed successfully', icon: 'success' })

        } catch (e) {
            updateLoading(false)
            AlertMsg({ title: 'Oops!', msg: 'Something went wrong', icon: 'error' })
        }

    }

    const handleWithdraw = async () => {
        if (!isConnected) {
            openConnectModal()
            return
        }
        const _pid = selPid.current.value
        let amount = txtAmount.current.value
        if (_pid == "") {
            AlertMsg({ title: 'Oops!', msg: 'Select Lock Options', icon: 'error' })
            return
        }
        if (amount == "") {
            AlertMsg({ title: 'Oops!', msg: 'Enter Valid Amount', icon: 'error' })
            return
        }
        const decimal = parseInt(_pid) < 5 ? CONFIG.ORBN_DECIMALS : CONFIG.USDT_DECIMALS
        const tokenAddress = parseInt(_pid) < 5 ? CONFIG.ORBN_ADDRESS : CONFIG.USDT_ADDRESS
        try {
            amount = ethers.utils.parseUnits(amount, decimal)
        } catch (e) {
            AlertMsg({ title: 'Oops!', msg: 'Enter Valid Amount', icon: 'error' })
            return
        }

        try {
            updateLoading(true)
            await withdraw(_pid, amount)
            fetchData()
            refetchAccountData()
            refetchRewards()
            updateLoading(false)
            AlertMsg({ title: 'Congratulation!', msg: 'Your transaction has been completed successfully', icon: 'success' })

        } catch (e) {
            updateLoading(false)
            AlertMsg({ title: 'Oops!', msg: 'Something went wrong', icon: 'error' })
        }
    }


    return (
        <Grid container rowSpacing={4.5} columnSpacing={3.75} sx={{ paddingTop: '5px' }}>
            {/* row 1 */}
            <Grid item xs={12} sm={12} md={4} lg={4}>
                <StakingDetail title="Total Value Locked" count={'$ ' + new Intl.NumberFormat('en-US').format(totalLockedValue)} />
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
                <ApyCard title="APY Rate" />
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
                <StakingDetail title="Stakers" count={new Intl.NumberFormat('en-US').format(blockchainData.stakers.toString())} />
            </Grid>

            {/* row 2 */}
            <Grid item xs={12} >
                <TimeComponent />
            </Grid>
           

            {/* row 3 */}
            <Grid item xs={12} md={7} lg={7} >
                <MainCard >
                    <Grid container>
                        <Grid item xs={12} sm={6} sx={{ px: 1, mb: 2, sm: { mb: 0 } }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }} >Amount to Stake</Typography>
                            <input ref={txtAmount} style={{ ...styles.txtInput }} placeholder="Amount" />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ px: 1, mb: 2, sm: { mb: 0 } }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }} >Lock Options</Typography>
                            <select style={{ ...styles.txtInput }} ref={selPid}>
                                <option value="">Select Lock Period</option>
                                <option value="0">30 Days</option>
                                <option value="1">90 Days</option>
                                <option value="2">180 Days</option>
                            </select>
                        </Grid>
                    </Grid>

                    <Grid container sx={{mt:1.2}}>
                        <Grid item xs={12} sm={6} sx={{ px: 1, mb: 0.5 }}>
                            <Button sx={{ ...styles.btn1 }} onClick={handleRewards}>Claim Rewards</Button>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ px: 1, mb: 0.5 }}>
                            <Button sx={{ ...styles.btn1 }} onClick={handleWithdraw}>Withdraw Stake</Button>
                        </Grid>
                        <Grid item xs={12} sm={12} sx={{ px: 1, mb: 0.4, mt:2.1 }}>
                            <Button sx={{ ...styles.btn }} onClick={handleStake}>Stake</Button>
                        </Grid>

                    </Grid>

                </MainCard>
            </Grid>

            <Grid item xs={12} md={5} lg={5}>
                <MainCard>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3.5 }} >Token Rate</Typography>
                        <Stack direction="column" spacing={2} alignItems="center" justifyContent="space-between">
                            <Token>
                                <Stack direction="row" alignItems="center" spacing={1.8}>
                                    <USDT />
                                    <Stack spacing={1.5}>
                                        <Stack direction="row" spacing={1.2} alignItems="center">
                                            <Typography variant="p" sx={{ fontWeight: 700, fontSize: '16px' }} >USDT</Typography>
                                            <div style={{ width: "1px", height: "10px", background: "#C7C8CC" }}></div>
                                            <Typography variant="p" sx={{ fontWeight: 400, fontSize: '16px', color: "#000515", opacity: 0.7 }} >Tether USD</Typography>
                                        </Stack>
                                        <Typography variant="p" sx={{ fontWeight: 700, fontSize: '16px' }} >$ 1.00 USD</Typography>
                                    </Stack>
                                </Stack>
                            </Token>
                            <Token>
                                <Stack direction="row" alignItems="center" spacing={1.8}>
                                    <ORBN />
                                    <Stack spacing={1.5}>
                                        <Stack direction="row" spacing={1.2} alignItems="center">
                                            <Typography variant="p" sx={{ fontWeight: 700, fontSize: '16px' }} >ORBN</Typography>
                                            <div style={{ width: "1px", height: "10px", background: "#C7C8CC" }}></div>
                                            <Typography variant="p" sx={{ fontWeight: 400, fontSize: '16px', color: "#000515", opacity: 0.7 }} >Orbeon Protocol</Typography>
                                        </Stack>
                                        <Typography variant="p" sx={{ fontWeight: 700, fontSize: '16px' }} >$ {blockchainData.orbn_usd_price.toFixed(3)} USD</Typography>
                                    </Stack>
                                </Stack>
                            </Token>
                        </Stack>
                    </Box>
                </MainCard>
            </Grid>


        </Grid>
    );
};

export default DashboardDefault;
