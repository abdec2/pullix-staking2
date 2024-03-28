import { createContext, useEffect, useReducer } from "react";
import { AppReducer } from './AppReducer'
import { useReadContracts } from "wagmi";
import { CONFIG } from '../configs/config'
import tokenAbi from './../configs/token.json'
import stakingAbi from './../configs/staking.json'

import { formatUnits } from 'viem'

import pairAbi from './../configs/pairAbi.json'
import routerAbi from './../configs/routerAbi.json'


const orbnContract = {
    address: CONFIG.ORBN_ADDRESS,
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
        0: "1000",
        1: "2200",
        2: "4500"
    },
    userStakes: [],
    pools: [],
    rewards: [],
    orbn_usd_price: 0,
    usdt_usd_price: 0,
    claimData: {
        userInitialized: 0,
        userBalance: 0,
        tokensClaimed: 0
    }
}

export const GlobalContext = createContext(initialState)

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState)
    const { data, isPending, isSuccess, refetch } = useReadContracts({
        contracts: [
            {
                ...orbnContract,
                functionName: 'balanceOf',
                args: [CONFIG.STAKING_CONTRACT]
            }

        ]
        
    })
    const { data: apy, error: apy_err, isPending: pending_apy, isSuccess: isSuccess_apy  } = useReadContracts({
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
            }
        ]

    })

    const {data: st_data, isPending: st_pending, isSuccess: st_success, refetch: st_refetch} = useReadContracts({
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
            }
        ]

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

    const updateClaimData = (data) => {
        dispatch({
            type: 'UPDATE_CLAIM_DATA',
            payload: data
        })
    }

    const updateGraphData = (data) => {
        dispatch({
            type: 'UPDATE_GRAPH_DATA',
            payload: data
        })
    }

    const getEthInUSD = async (pair) => {
        const req = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=pullix&vs_currencies=usd`)
        const res = await req.json()
        return res
    }

    const fetchData = async () => {
        refetch()
        st_refetch()
    }

    useEffect(() => {
        if(isSuccess) {
            updateLockedTokens({
                orbn: formatUnits(data[0]?.result.toString(), CONFIG.ORBN_DECIMALS),
            })
        }
        if(isSuccess_apy) {
            const apyObj = {}
            const poolArray = []
            apy.map((item, i) => {
                apyObj[i] = item.result.apy.toString()
                poolArray.push(item.result)
            })
            UpdateApy(apyObj)
            updatePools(poolArray)
        }

        if(st_success) {
            let noOfStakers = 0
            st_data.map(item => {
                noOfStakers += parseInt(item.result.toString())
            })
            updateStakers(noOfStakers)
        }

    }, [isPending, isSuccess, pending_apy, isSuccess_apy, st_pending, st_success])

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
                updateClaimData,
                fetchData,
                UpdateOrbnPrice,
                UpdateUSDTPrice,
                getEthInUSD
            }
        }
        >
            {children}
        </GlobalContext.Provider>
    )
}