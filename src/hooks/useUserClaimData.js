import { GlobalContext } from "context/GlobalContext"
import { useContext, useEffect } from "react"
import { useContractReads, useAccount } from "wagmi"
import { CONFIG } from './../configs/config'
import claimAbi from './../configs/claim.json'
import { ethers } from "ethers"

const claimingContract = {
    address: CONFIG.CLAIM_CONTRACT,
    abi: claimAbi,
}


const useUserClaimData = () => {
    const { address, isConnected } = useAccount()
    const { blockchainData, updateClaimData } = useContext(GlobalContext)

    const { data, isLoading, isError, refetch } = useContractReads({
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
        ], 
        enabled: false,
        onSuccess(data) {
            // updateRewards(data)
            const claimData = {
                userInitialized: data[0],
                userBalance: ethers.utils.formatEther(data[1]),
                tokensClaimed: ethers.utils.formatEther(data[2])
            }

            updateClaimData(claimData)
        }
    })

    useEffect(() => {
        if(isConnected) {
            refetch()
        } 
    }, [isConnected, address])

    return refetch
}

export default useUserClaimData