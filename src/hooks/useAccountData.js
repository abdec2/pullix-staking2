import { GlobalContext } from "context/GlobalContext"
import { useContext, useEffect } from "react"
import { useReadContracts, useAccount } from "wagmi"
import { CONFIG } from './../configs/config'
import stakingAbi from './../configs/staking.json'

const stakingContract = {
    address: CONFIG.STAKING_CONTRACT,
    abi: stakingAbi,
}

const useAccountData = () => {
    const { address, isConnected } = useAccount()
    const { blockchainData, updateUserStakes, updateRewards } = useContext(GlobalContext)

    const { data, isPending, isSuccess, refetch } = useReadContracts({
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
            
        ]
    })

    useEffect(() => {
        if(isConnected) {
            refetch()
        } 
        
    }, [isConnected, address])

    useEffect(() => {
        if(isSuccess) {
            const userInfoArray = []
            data.map((item,i) => {
                if(item.status === 'success') {
                    userInfoArray.push(item.result)
                }
            })
            updateUserStakes(userInfoArray)
        }
    }, [isPending, isSuccess])

    return refetch
}

export default useAccountData