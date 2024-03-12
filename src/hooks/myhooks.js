import { usePrepareContractWrite } from 'wagmi'
import { CONFIG } from 'configs/config'
import StakeAbi from './../configs/staking.json'
import TokenAbi from './../configs/token.json'
import { useAccount } from 'wagmi'
import { ethers } from '../../node_modules/ethers/lib/index'



export const usePrepareWriteForTokens = (tokenAddress, amount) => {
    const { address } = useAccount()
    const { config } = usePrepareContractWrite({
        address: tokenAddress,
        abi: TokenAbi,
        functionName: 'approve',
        args: [CONFIG.STAKING_CONTRACT, amount],
        enabled: Boolean(amount),
        override: {
            from: address
        }
    })

    return config
}

export const usePrepareWriteForStaking = (pid, amount) => {
    const { address } = useAccount()
    const { config } = usePrepareContractWrite({
        address: CONFIG.STAKING_CONTRACT,
        abi: StakeAbi,
        functionName: 'deposit',
        args: [pid, amount],
        enabled: Boolean(amount),
        override: {
            from: address
        }
    })

    return config
}



