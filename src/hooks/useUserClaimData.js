import { GlobalContext } from "context/GlobalContext"
import { useContext, useEffect } from "react"
import { useReadContracts, useAccount } from "wagmi"
import { formatEther } from 'viem'
import { CONFIG } from './../configs/config'
import claimAbi from './../configs/claim.json'

const claimingContract = {
    address: CONFIG.CLAIM_CONTRACT,
    abi: claimAbi,
}


const useUserClaimData = () => {
    const { address, isConnected } = useAccount()
    const { blockchainData, updateClaimData } = useContext(GlobalContext)

    const { data, isPending, isSuccess, refetch } = useReadContracts({
        contracts: [
            {
                ...claimingContract,
                functionName: 'userInitialized',
                args: [address]
            },
            {
                ...claimingContract,
                functionName: 'userBalance',
                args: [address]
            },
            {
                ...claimingContract,
                functionName: 'tokensClaimed',
                args: [address]
            },
        ]
    })

    useEffect(() => {
        if(isConnected && !isSuccess) {
            refetch()
        } 
        if(isSuccess) {
            const claimData = {
                userInitialized: data[0].result,
                userBalance: formatEther(data[1].result),
                tokensClaimed: formatEther(data[2].result)
            }

            updateClaimData(claimData)
        }
    }, [isConnected, address, isPending, isSuccess])

    return refetch
}

export default useUserClaimData