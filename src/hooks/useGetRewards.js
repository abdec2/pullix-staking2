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