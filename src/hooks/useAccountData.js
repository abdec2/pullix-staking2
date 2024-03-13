import { GlobalContext } from "context/GlobalContext"
import { useContext, useEffect } from "react"
import { useContractReads, useAccount } from "wagmi"
import { CONFIG } from './../configs/config'
import stakingAbi from './../configs/staking.json'

const stakingContract = {
    address: CONFIG.STAKING_CONTRACT,
    abi: stakingAbi,
}

const useAccountData = () => {
    const { address, isConnected } = useAccount()
    const { blockchainData, updateUserStakes, updateRewards } = useContext(GlobalContext)

    const { data, isLoading, isError, refetch } = useContractReads({
        contracts: [
            {
                ...stakingContract,
                functionName: 'userInfo',
                args: [0, address]
            },
            {
                ...stakingContract,
                functionName: 'userInfo',
                args: [1, address]
            },
            {
                ...stakingContract,
                functionName: 'userInfo',
                args: [2, address]
            }
            
        ], 
        enabled: false,
        onSuccess(data) {
            updateUserStakes(data)
        }
    })

    useEffect(() => {
        if(isConnected) {
            refetch()
        } 
    }, [isConnected, address])

    return refetch
}

export default useAccountData