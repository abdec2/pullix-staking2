import { createContext, useEffect, useReducer } from "react";
import { AppReducer } from './AppReducer'
import { useContractReads } from "wagmi";
import { CONFIG } from '../configs/config'
import tokenAbi from './../configs/token.json'
import stakingAbi from './../configs/staking.json'
// import { firestore } from "firebaseConfig";
// import { collection, where, query, getDocs } from "@firebase/firestore"

import pairAbi from './../configs/pairAbi.json'
import routerAbi from './../configs/routerAbi.json'

import { ethers } from "ethers";
import { useProvider } from "wagmi";

const orbnContract = {
    address: CONFIG.ORBN_ADDRESS,
    abi: tokenAbi,
}
const usdtContract = {
    address: CONFIG.USDT_ADDRESS,
    abi: tokenAbi,
}
const stakingContract = {
    address: CONFIG.STAKING_CONTRACT,
    abi: stakingAbi,
}


const initialState = {
    loading: false,
    stakers: 0,
    lockedTokens: {
        orbn: 0.00,
        usdt: 0.00
    },
    apy: {
        0: "100",
        1: "400",
        2: "800",
        3: "1200",
        4: "1800",
        5: "100",
        6: "400",
        7: "800",
        8: "1200",
        9: "1800",
    },
    userStakes: [],
    pools: [],
    rewards: [],
    orbn_usd_price: 0,
    usdt_usd_price: 0,
    graphData: {
        orbn: [],
        usdt: []
    }
}

export const GlobalContext = createContext(initialState)

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState)
    const provider = useProvider()
    const { data, isError, isLoading, refetch } = useContractReads({
        contracts: [
            {
                ...orbnContract,
                functionName: 'balanceOf',
                args: [CONFIG.STAKING_CONTRACT]
            },
            {
                ...usdtContract,
                functionName: 'balanceOf',
                args: [CONFIG.STAKING_CONTRACT]
            },

        ],
        onSuccess(data) {
            updateLockedTokens({
                orbn: ethers.utils.formatUnits(data[0].toString(), CONFIG.ORBN_DECIMALS),
                usdt: ethers.utils.formatUnits(data[1].toString(), CONFIG.ORBN_DECIMALS)
            })
            getTokenPrice()
        },
    })
    const { data: apy, isError: apy_err, isLoading: apy_loading } = useContractReads({
        contracts: [
            {
                ...stakingContract,
                functionName: 'poolInfo',
                args: [0]
            },
            {
                ...stakingContract,
                functionName: 'poolInfo',
                args: [1]
            },
            {
                ...stakingContract,
                functionName: 'poolInfo',
                args: [2]
            },
            {
                ...stakingContract,
                functionName: 'poolInfo',
                args: [3]
            },
            {
                ...stakingContract,
                functionName: 'poolInfo',
                args: [4]
            },
            {
                ...stakingContract,
                functionName: 'poolInfo',
                args: [5]
            },
            {
                ...stakingContract,
                functionName: 'poolInfo',
                args: [6]
            },
            {
                ...stakingContract,
                functionName: 'poolInfo',
                args: [7]
            },
            {
                ...stakingContract,
                functionName: 'poolInfo',
                args: [8]
            },
            {
                ...stakingContract,
                functionName: 'poolInfo',
                args: [9]
            },
        ],
        onSuccess(data) {
            console.log('Success', data)
            const apyObj = {}
            data.map((item, i) => {
                apyObj[i] = item.apy.toString()
            })
            UpdateApy(apyObj)
            updatePools(data)
        },

    })

    const stakeHoldersCR = useContractReads({
        contracts: [
            {
                ...stakingContract,
                functionName: 'stakeHoldersLength',
                args: [0]
            },
            {
                ...stakingContract,
                functionName: 'stakeHoldersLength',
                args: [1]
            },
            {
                ...stakingContract,
                functionName: 'stakeHoldersLength',
                args: [2]
            },
            {
                ...stakingContract,
                functionName: 'stakeHoldersLength',
                args: [3]
            },
            {
                ...stakingContract,
                functionName: 'stakeHoldersLength',
                args: [4]
            },
            {
                ...stakingContract,
                functionName: 'stakeHoldersLength',
                args: [5]
            },
            {
                ...stakingContract,
                functionName: 'stakeHoldersLength',
                args: [6]
            },
            {
                ...stakingContract,
                functionName: 'stakeHoldersLength',
                args: [7]
            },
            {
                ...stakingContract,
                functionName: 'stakeHoldersLength',
                args: [8]
            },
            {
                ...stakingContract,
                functionName: 'stakeHoldersLength',
                args: [9]
            },
        ],
        onSuccess(data) {
            let noOfStakers = 0
            data.map(item => {
                noOfStakers += parseInt(item.toString())
            })
            updateStakers(noOfStakers)
        },
    })

    const updateLockedTokens = (lockedTokens) => {
        dispatch({
            type: 'UPDATE_LOCKED_TOKENS',
            payload: lockedTokens
        })
    }

    const UpdateApy = (apy) => {
        dispatch({
            type: 'UPDATE_APY',
            payload: apy
        })
    }

    const UpdateOrbnPrice = (price) => {
        dispatch({
            type: 'UPDATE_ORBN_PRICE',
            payload: price
        })
    }

    const UpdateUSDTPrice = (price) => {
        dispatch({
            type: 'UPDATE_USDT_PRICE',
            payload: price
        })
    }

    const updateUserStakes = (stakes) => {
        dispatch({
            type: 'UPDATE_STAKES',
            payload: stakes
        })
    }

    const updateStakers = (stakers) => {
        dispatch({
            type: 'UPDATE_STAKERS',
            payload: stakers
        })
    }

    const updateLoading = (loading) => {
        dispatch({
            type: 'UPDATE_LOADING',
            payload: loading
        })
    }

    const updatePools = (pools) => {
        dispatch({
            type: 'UPDATE_POOLS',
            payload: pools
        })
    }

    const updateRewards = (rewards) => {
        dispatch({
            type: 'UPDATE_REWARDS',
            payload: rewards
        })
    }

    const updateGraphData = (data) => {
        dispatch({
            type: 'UPDATE_GRAPH_DATA',
            payload: data
        })
    }

    const getEthInUSD = async (pair) => {
        const req = await fetch(`https://api.coinbase.com/v2/prices/${pair}/spot`)
        const res = await req.json()
        return res.data
    }

    const getPreviousBlockNumber = async () => {
        let currenttimestamp = new Date().getTime()
        let timestamp = currenttimestamp - (86400 * 1000 * 7)
        timestamp = Math.floor(timestamp / 1000)

        let minBlockNumber = 8634113
        let maxBlockNumber = await provider.getBlockNumber();
        let closestBlockNumber = Math.floor((maxBlockNumber + minBlockNumber) / 2)
        let closestBlock = await provider.getBlock(closestBlockNumber);
        let foundExactBlock = false

        while (minBlockNumber <= maxBlockNumber) {
            if (closestBlock.timestamp === timestamp) {
                foundExactBlock = true
                break;
            } else if (closestBlock.timestamp > timestamp) {
                maxBlockNumber = closestBlockNumber - 1
            } else {
                minBlockNumber = closestBlockNumber + 1
            }

            closestBlockNumber = Math.floor((maxBlockNumber + minBlockNumber) / 2)
            closestBlock = await provider.getBlock(closestBlockNumber);
        }

        const previousBlockNumber = closestBlockNumber - 1
        const previousBlock = await provider.getBlock(previousBlockNumber);
        const nextBlockNumber = closestBlockNumber + 1
        const nextBlock = await provider.getBlock(nextBlockNumber);

        return closestBlockNumber
    }

    const getDepositEvents = async () => {
        // const contract = new ethers.Contract(CONFIG.STAKING_CONTRACT, stakingAbi, provider)
        // const fromBlock = 16982905
        // const events = await contract.queryFilter("Deposit", fromBlock)
        // const usdtChartData = []
        // const orbnChartData = []
        // console.log(events)
        // events.map(item => {
        //     const pid = parseInt(item.args.pid.toString())
        //     if(pid < 5) {
        //         const amount = Number(ethers.utils.formatUnits(item.args.amount, CONFIG.ORBN_DECIMALS))
        //         orbnChartData.push(amount)
        //     } else {
        //         const amount = Number(ethers.utils.formatUnits(item.args.amount, CONFIG.USDT_DECIMALS))
        //         usdtChartData.push(amount)
        //     }
        // })
        const curr = new Date()
        const year = curr.getFullYear()
        const month = ((curr.getMonth() + 1) < 10) ? "0" + (curr.getMonth() + 1) : (curr.getMonth() + 1)
        const day = (curr.getDate() < 10) ? "0" + (curr.getDate()) : (curr.getDate())
        const cur_date = year + "-" + month + "-" + day


        // const ref = collection(firestore, "staking")
        // const q = query(ref, where("timestamp", "<=", cur_date))
        // const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
        //     // doc.data() is never undefined for query doc snapshots
        //     console.log(doc);
        // });



        // updateGraphData({orbn: orbnChartData, usdt: usdtChartData})
    }

    const getTokenPrice = async () => {
        updateLoading(true)
        const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/D1wTLdl4HcV0JAW9PUtKxGPTf2Sy-wUZ')
        const pairContract = new ethers.Contract(CONFIG.UNISWAP_PAIR_ADDRESS, pairAbi, provider)
        const WETHAddress = await pairContract.token0()
        const ORBNAddress = await pairContract.token1()
        const getReserves = await pairContract.getReserves()
        const routerContract = new ethers.Contract(CONFIG.UNISWAP_ROUTER_ADDRESS, routerAbi, provider)
        const getAmountOut = await routerContract.quote(ethers.utils.parseUnits('1', 9), getReserves._reserve0, getReserves._reserve1)
        const finalAmount = (parseInt(getAmountOut.toString()) / 1e18)
        const ethPriceInUSD = await getEthInUSD('ETH-USD')
        const USDTPriceInUSD = await getEthInUSD('USDT-USD')
        const perTokenORBNPriceInUSD = finalAmount * parseFloat(ethPriceInUSD.amount)
        const perTokenUSDTPriceinUSD = USDTPriceInUSD.amount
        UpdateOrbnPrice(perTokenORBNPriceInUSD)
        UpdateUSDTPrice(perTokenUSDTPriceinUSD)

        await getDepositEvents()
        updateLoading(false)
    }

    const fetchData = async () => {
        refetch()
        stakeHoldersCR.refetch()
    }

    useEffect(() => {
        if (isLoading || apy_loading) {
            updateLoading(true)
        } else {
            updateLoading(false)
        }
    }, [isLoading, apy_loading])

    return (
        <GlobalContext.Provider value={
            {
                blockchainData: state,
                updateLockedTokens,
                UpdateApy,
                updateUserStakes,
                updateStakers,
                updateLoading,
                updatePools,
                updateRewards,
                fetchData,
                UpdateOrbnPrice,
                UpdateUSDTPrice
            }
        }
        >
            {children}
        </GlobalContext.Provider>
    )
}