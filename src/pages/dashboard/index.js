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
import claimAbi from './../../configs/claim.json'
import treeJson from './../../configs/tree.json'

import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

// assets
import { USDT, ORBN } from "components/icons"
import { GlobalContext } from 'context/GlobalContext';
import { CONFIG } from 'configs/config';
import { useAccount, useSigner, useConfig } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react'
import {formatEther, parseUnits} from 'viem'
import { writeContract, waitForTransactionReceipt  } from '@wagmi/core'




import useAccountData from 'hooks/useAccountData';
import useGetRewards from 'hooks/useGetRewards';
import { Card } from '../../../node_modules/@mui/material/index';
import { StakersIcon, TvlIcon } from 'components/icons/index';
import useUserClaimData from 'hooks/useUserClaimData';

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
        border: '1px solid',
        width: '100%',
        fontSize: '11px',
        padding: '19px 18px',
        background: 'none',
        color: '#9CA6B8',
        borderRadius: '5px',
        fontWeight: 700
    },
    btn: {
        width: '100%',
        bgcolor: '#F5331E',
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
        background: 'linear-gradient(253.57deg, #EF9933 -17.46%, #D7913F 36.74%, #C96D00 99.84%)',
        fontSize: '14px',
        borderRadius: '5px',
        color: "#fff",
        fontWeight: 700,
        py: '9px', 
    },
    btn2: {
        width: '100%',
        background: 'linear-gradient(90deg, #0052B4 0%, #2E8DFF 100%)',
        fontSize: '14px',
        borderRadius: '5px',
        color: "#fff",
        fontWeight: 700,
        py: '9px', 
        px: '35px'
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
    background: "rgba(156,166,184,0.18)",
    borderRadius: '0px',
    boxShadow: "none",
    width: "100%"
}))


// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
    const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0) 
    const [tokenPrice, setTokenPrice] = useState(0)
    const { address, isConnected } = useAccount()
    const config = useConfig()
    // const { data: signer } = useSigner()
    const { open } = useWeb3Modal()
    const { blockchainData, updateLoading, fetchData, getEthInUSD } = useContext(GlobalContext)
    console.log('blockchainData', blockchainData)
    const txtAmount = useRef()
    const selPid = useRef()

    const refetchAccountData = useAccountData()
    const refetchRewards = useGetRewards()
    const refetchClaimData = useUserClaimData()

    const totalLockedValue = (parseFloat(blockchainData.lockedTokens.orbn) * tokenPrice )

    const handleRewards = async () => {
        if (!isConnected) {
            open()
            return
        }
        const _pid = selPid.current.value
        if (_pid == "") {
            AlertMsg({ title: 'Oops!', msg: 'Select Lock Options', icon: 'error' })
            return
        }

        try {
            updateLoading(true)
            const tx = await writeContract(config, {
                address: CONFIG.STAKING_CONTRACT,
                abi: StakeAbi,
                functionName: 'getRewards',
                args: [_pid]
            })
            console.log(tx)
            const result = await waitForTransactionReceipt(config, {
                hash: tx
            })
            console.log(result)
            
            updateLoading(false)
            fetchData()
            refetchAccountData()
            refetchRewards()
            AlertMsg({ title: 'Congratulation!', msg: 'Your transaction has been completed successfully', icon: 'success' })
        } catch (e) {
            console.log(e)
            updateLoading(false)
            AlertMsg({ title: 'Oops!', msg: 'Something went wrong', icon: 'error' })
        }
    }

    const approve = async (amount, tokenAddress) => {
        const tx = await writeContract(config, {
            address: CONFIG.ORBN_ADDRESS,
            abi: TokenAbi,
            functionName: 'increaseAllowance',
            args: [CONFIG.STAKING_CONTRACT ,amount]
        })
        console.log(tx)
        const result = await waitForTransactionReceipt(config, {
            hash: tx
        })
        console.log(result)
    }

    const deposit = async (pid, amount) => {
        const tx = await writeContract(config, {
            address: CONFIG.STAKING_CONTRACT,
            abi: StakeAbi,
            functionName: 'deposit',
            args: [pid ,amount]
        })
        console.log(tx)
        const result = await waitForTransactionReceipt(config, {
            hash: tx
        })
        console.log(result)
    }

    const withdraw = async (pid, amount) => {
        const tx = await writeContract(config, {
            address: CONFIG.STAKING_CONTRACT,
            abi: StakeAbi,
            functionName: 'exit',
            args: [pid ,amount]
        })
        console.log(tx)
        const result = await waitForTransactionReceipt(config, {
            hash: tx
        })
        console.log(result)
    }

    const handleStake = async () => {
        if (!isConnected) {
            open()
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
        const decimal = CONFIG.ORBN_DECIMALS
        const tokenAddress = CONFIG.ORBN_ADDRESS
        try {
            amount = parseUnits(amount, decimal)
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
            console.log(e)
            updateLoading(false)
            AlertMsg({ title: 'Oops!', msg: 'Something went wrong', icon: 'error' })
        }

    }

    const handleWithdraw = async () => {
        if (!isConnected) {
            open()
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
        const decimal = CONFIG.ORBN_DECIMALS
        const tokenAddress = CONFIG.ORBN_ADDRESS
        try {
            amount = parseUnits(amount, decimal)
        } catch (e) {
            console.log(e)
            AlertMsg({ title: 'Oops!', msg: 'Enter Valid Amount', icon: 'error' })
            return
        }

        try {
            updateLoading(true)
            const timecheck = (parseInt(blockchainData.userStakes[_pid].timestamp.toString())+parseInt(blockchainData.pools[_pid].duration.toString())) - parseInt((new Date().getTime()) / 1000)
            if(timecheck > 0) {
                throw 'Period not Expired'
            }
            await withdraw(_pid, amount)
            fetchData()
            refetchAccountData()
            refetchRewards()
            updateLoading(false)
            AlertMsg({ title: 'Congratulation!', msg: 'Your transaction has been completed successfully', icon: 'success' })

        } catch (e) {
            console.log(e)
            updateLoading(false)
            AlertMsg({ title: 'Oops!', msg: 'Something went wrong', icon: 'error' })
        }
    }

    const handlePresaleClaim = async () => {
        try {
            updateLoading(true)
            const tree = StandardMerkleTree.load(treeJson);
            let proof;
            let amount;
            for (const [i, v] of tree.entries()) {
                if (v[0] === address) {
                proof = tree.getProof(i);
                amount = v[1]
                }
            }
            
            const tx = await writeContract(config, {
                address: CONFIG.CLAIM_CONTRACT,
                abi: claimAbi,
                functionName: 'Claim',
                args: [amount ,proof]
            })
            console.log(tx)
            const result = await waitForTransactionReceipt(config, {
                hash: tx
            })
            console.log(result)

            updateLoading(false)
            refetchClaimData();
            AlertMsg({ title: 'Congratulation!', msg: 'Your transaction has been completed successfully', icon: 'success' })
        } catch (e) {
            console.log(e)
            updateLoading(false)
            AlertMsg({ title: 'Oops!', msg: 'Something went wrong', icon: 'error' })
        }
    }

    const handlePresaleStake = async () => {
        try {
            updateLoading(true)
            const tree = StandardMerkleTree.load(treeJson);
            let proof;
            let amount;
            for (const [i, v] of tree.entries()) {
                if (v[0] === address) {
                proof = tree.getProof(i);
                amount = v[1]
                }
            }

            const tx = await writeContract(config, {
                address: CONFIG.CLAIM_CONTRACT,
                abi: claimAbi,
                functionName: 'Stake',
                args: [amount ,proof]
            })
            console.log(tx)
            const result = await waitForTransactionReceipt(config, {
                hash: tx
            })
            console.log(result)            
            fetchData()
            refetchAccountData()
            refetchRewards()
            refetchClaimData();
            updateLoading(false)
            AlertMsg({ title: 'Congratulation!', msg: 'Your transaction has been completed successfully', icon: 'success' })
        } catch (e) {
            console.log(e)
            updateLoading(false)
            AlertMsg({ title: 'Oops!', msg: 'Something went wrong', icon: 'error' })
        }
    } 

    const fetchRates = async () => {
        const data = await getEthInUSD()
        setTokenPrice(parseFloat(data.pullix.usd).toFixed(3))
    }

    useEffect(() => {
        if(isConnected){
            const tree = StandardMerkleTree.load(treeJson);
            let totalTokens = 0;
            for (const [i, v] of tree.entries()) {
                if (v[0] === address) {
                    totalTokens = v[1]
                }
            }

            setTotalPurchaseAmount(formatEther(totalTokens))
        }
    }, [address, isConnected])

    useEffect(()=>{
        fetchRates()
    }, [])


    return (
        <Grid container rowSpacing={2} columnSpacing={2} sx={{ paddingTop: '5px' }}>
            {/* row 1 */}
            <Grid item xs={12} sm={12} md={4} lg={4}>
                <StakingDetail title="Total Value Locked" count={ new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(totalLockedValue)} ><TvlIcon /></StakingDetail>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
                <ApyCard title="APY Rate" />
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
                <StakingDetail title="Stakers" count={new Intl.NumberFormat('en-US').format(blockchainData.stakers.toString())} ><StakersIcon /></StakingDetail>
            </Grid>

            {/* row 2 */}
            <Grid item xs={12} >
                <TimeComponent />
            </Grid>
           

            {/* row 3 */}
            <Grid item xs={12} md={6} lg={6} >
                <Card  sx={{
                    bgcolor: '#161A28',
                    borderRadius: '0px',
                    px: '26px',
                    py: '18px'
                }}>
                    <Grid container spacing={2.25} >
                        <Grid item xs={12} sm={8} > 
                            <Typography variant="h4" color="#EF9933" sx={{ fontWeight: 700, pb: 2, mb:1.75, fontSize: '11px', borderBottom: '1px solid #9CA6B8' }} >Amount to Stake</Typography>
                            <input ref={txtAmount} style={{ ...styles.txtInput, borderColor: '#9CA6B8' }} placeholder="Amount" />
                        </Grid>
                        <Grid item xs={12} sm={4} >
                            <Typography variant="h4" color="#EF9933" sx={{ fontWeight: 700, pb: 2, mb:1.75, fontSize: '11px', borderBottom: '1px solid #9CA6B8' }} >Timeframe</Typography>
                            <select style={{ ...styles.txtInput, borderColor: '#EF9933' }} ref={selPid}>
                                <option value="">Select Lock Period</option>
                                <option value="0">30 Days</option>
                                <option value="1">90 Days</option>
                                <option value="2">180 Days</option>
                            </select>
                        </Grid>
                        <Grid item xs={12} sm={4} >
                            <Button sx={{ ...styles.btn1 }} onClick={handleStake}>Stake</Button>
                        </Grid>
                        <Grid item xs={12} sm={4} >
                            <Button sx={{ ...styles.btn2 }} onClick={handleWithdraw}>Unstake</Button>
                        </Grid>
                        <Grid item xs={12} sm={4} >
                            <Button sx={{ ...styles.btn1 }} onClick={handleRewards}>get Rewards</Button>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
                <Card  sx={{
                    bgcolor: '#161A28',
                    borderRadius: '0px',
                    px: '26px',
                    py: '18px'
                }}> 
                    <Grid container  >
                        <Grid item xs={12} > 
                            <Typography variant="h4" color="#EF9933" sx={{ fontWeight: 700, pb: 2, mb:1.75, fontSize: '11px', borderBottom: '1px solid #9CA6B8' }} >Token Rate</Typography>
                            
                        </Grid>

                        <Grid item xs={12} sx={{mb:0.8}}>
                            <Token>
                                <Stack direction="row" alignItems="center" >
                                    <Box sx={{height: '55px', width: '55px', background: '#0B0C13', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                                        <USDT />
                                    </Box>
                                    <Stack sx={{ml: '27px'}}>
                                        <Stack direction="row" spacing={1.2} alignItems="center">
                                            <Typography variant="p" color="#fff" sx={{ fontWeight: 700, fontSize: '10px' }} >USDT</Typography>
                                            <div style={{ width: "1px", height: "10px", background: "#C7C8CC" }}></div>
                                            <Typography variant="p" color="#9D9D9D" sx={{ fontWeight: 700, fontSize: '10px'}} >Tether USD</Typography>
                                        </Stack>
                                        <Typography variant="p" color="#EF9933" sx={{ fontWeight: 700, fontSize: '14px' }} >$ 1.00 USD</Typography>
                                    </Stack>
                                </Stack>
                            </Token>
                        </Grid>
                        <Grid item xs={12}>
                            <Token>
                                <Stack direction="row" alignItems="center" >
                                    <Box sx={{height: '55px', width: '55px', background: '#0B0C13', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                                        <ORBN />
                                    </Box>
                                    <Stack sx={{ml: '27px'}}>
                                        <Stack direction="row" spacing={1.2} alignItems="center">
                                            <Typography variant="p" color="#fff" sx={{ fontWeight: 700, fontSize: '10px' }} >PLX</Typography>
                                            <div style={{ width: "1px", height: "10px", background: "#C7C8CC" }}></div>
                                            <Typography variant="p" color="#9D9D9D" sx={{ fontWeight: 700, fontSize: '10px'}} >Pullix</Typography>
                                        </Stack>
                                        <Typography variant="p" color="#EF9933" sx={{ fontWeight: 700, fontSize: '14px' }} >$ {tokenPrice} USD</Typography>
                                    </Stack>
                                </Stack>
                            </Token>
                        </Grid>
                    </Grid>

                    
                </Card>
            </Grid>

            <Grid item xs={12} >
                <Card  sx={{
                    bgcolor: '#161A28',
                    borderRadius: '0px',
                    px: '26px',
                    py: '18px'
                }}> 
                    <Grid container sx={{mb:2}}>
                        <Grid item xs={12} > 
                            <Typography variant="h4" color="#EF9933" sx={{ fontWeight: 700, pb: 2, mb:1.75, fontSize: '11px', borderBottom: '1px solid #9CA6B8' }} >Claim Your Presale Tokens</Typography>
                            
                        </Grid>

                        <Grid item xs={12} sx={{display:'flex', alignItems: 'center', justifyContent: 'space-between'}}> 
                            <Typography variant="h4" color="#EF9933" sx={{ fontWeight: 700, pb: 2, mb:0, fontSize: '14px' }} >Total PLX Purchase : {new Intl.NumberFormat('en-us').format(totalPurchaseAmount)} PLX</Typography>
                            <Typography variant="h4" color="#EF9933" sx={{ fontWeight: 700, pb: 2, mb:0, fontSize: '14px' }} >Remaining PLX Balance : {
                                blockchainData.claimData.userInitialized ? (
                                    new Intl.NumberFormat('en-us').format(blockchainData.claimData.userBalance)
                                ) : (
                                    new Intl.NumberFormat('en-us').format(totalPurchaseAmount)
                                )
                            } PLX</Typography>
                        </Grid>

                        <Grid item xs={12} >
                            <Typography variant="p" color="#fff" sx={{ fontWeight: 500, fontSize: '10px' }}>
                                <span style={{fontWeight: 700, fontSize:'11px'}}>Please Note: </span> There are two ways you can claim your presale tokens:
                            </Typography>
                            <Box>
                                <Typography variant="p" color="#fff" sx={{ fontWeight: 500, fontSize: '10px' }}>
                                    <span style={{fontWeight: 700, fontSize:'11px'}}> Stake: </span>  All of your token balance will be staked for 180 days
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="p" color="#fff" sx={{ fontWeight: 500, fontSize: '10px' }}>
                                    <span style={{fontWeight: 700, fontSize:'11px'}}> Claim: </span>  You will receive your balances in 4 installments. 
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} >
                            <Typography variant="p" color="#fff" sx={{ fontWeight: 500, fontSize: '10px' }}>
                                <span style={{fontWeight: 700, fontSize:'11px'}}>Claiming Schedule: </span> User can start claiming their presale token as per following schedule:
                            </Typography>
                            <Box color="#fff" sx={{ fontWeight: 500, fontSize: '10px' }}>
                                <ul style={{margin: '4px 0px'}}>
                                    <li>First Claim of 25% starts from March 28, 2024</li>
                                    <li>Second Claim of 25% starts from April 28, 2024</li>
                                    <li>Third Claim of 25% starts from May 28, 2024</li>
                                    <li>Fourth Claim of 25% starts from June 28, 2024</li>
                                </ul>
                                {/* <Typography variant="p" color="#fff" sx={{ fontWeight: 500, fontSize: '10px' }}>
                                    
                                </Typography> */}
                            </Box>

                        </Grid>
                    </Grid>

                    <Grid container spacing={2} >
                        <Grid item xs={12} sm={6} >
                            <Button sx={{ ...styles.btn1 }} onClick={handlePresaleStake}>Stake</Button>
                        </Grid>
                        <Grid item xs={12} sm={6} >
                            <Button sx={{ ...styles.btn2 }} onClick={handlePresaleClaim}>Claim</Button>
                        </Grid>
                    </Grid>

                    
                </Card>
            </Grid>


        </Grid>
    );
};

export default DashboardDefault;
