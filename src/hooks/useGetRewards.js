import { GlobalContext } from "context/GlobalContext"
import { useContext, useEffect } from "react"
import { useReadContracts, useAccount } from "wagmi"
import { CONFIG } from './../configs/config'
import stakingAbi from './../configs/staking.json'

const stakingContract = {
    address: CONFIG.STAKING_CONTRACT,
    abi: stakingAbi,
}


const useGetRewards = () => {
    const { address, isConnected } = useAccount()
    const { blockchainData, updateRewards } = useContext(GlobalContext)

    const { data, isPending, isSuccess, refetch } = useReadContracts({
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
    })

    useEffect(() => {
        if(isConnected) {
            refetch()
        } 
        
    }, [isConnected, address])

    useEffect(() => {
        if(isSuccess) {
            const array = []
            data.map(item => {
                if(item.status === "success") {
                    array.push(item.result)
                }
            })
            updateRewards(array)
        }
    }, [isPending, isSuccess])

    return refetch
}

export default useGetRewards