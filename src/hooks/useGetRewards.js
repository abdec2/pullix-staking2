import { GlobalContext } from "context/GlobalContext"
import { useContext, useEffect } from "react"
import { useContractReads, useAccount } from "wagmi"
import { CONFIG } from './../configs/config'
import stakingAbi from './../configs/staking.json'

const stakingContract = {
    address: CONFIG.STAKING_CONTRACT,
    abi: stakingAbi,
}

const useGetRewards = () => {
    const { address, isConnected } = useAccount()
    const { blockchainData, updateRewards } = useContext(GlobalContext)

    const { data, isLoading, isError, refetch } = useContractReads({
        contracts: [
            {
                ...stakingContract,
                functionName: 'pendingToken',
                args: [0, address]
            },
            {
                ...stakingContract,
                functionName: 'pendingToken',
                args: [1, address]
            },
            {
                ...stakingContract,
                functionName: 'pendingToken',
                args: [2, address]
            },
            {
                ...stakingContract,
                functionName: 'pendingToken',
                args: [3, address]
            },
            {
                ...stakingContract,
                functionName: 'pendingToken',
                args: [4, address]
            },
            {
                ...stakingContract,
                functionName: 'pendingToken',
                args: [5, address]
            },
            {
                ...stakingContract,
                functionName: 'pendingToken',
                args: [6, address]
            },
            {
                ...stakingContract,
                functionName: 'pendingToken',
                args: [7, address]
            },
            {
                ...stakingContract,
                functionName: 'pendingToken',
                args: [8, address]
            },
            {
                ...stakingContract,
                functionName: 'pendingToken',
                args: [9, address]
            }
        ], 
        enabled: false,
        onSuccess(data) {
            updateRewards(data)
        }
    })

    useEffect(() => {
        if(isConnected) {
            refetch()
        } 
    }, [isConnected, address])

    return refetch
}

export default useGetRewards