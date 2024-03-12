export const AppReducer = (state, action) => {
    switch(action.type) {
        case 'UPDATE_LOCKED_TOKENS':
            return {
                ...state,
                lockedTokens: action.payload
            }
        case 'UPDATE_APY':
            return {
                ...state,
                apy: action.payload
            }
        
        case 'UPDATE_STAKES':
            return {
                ...state,
                userStakes: action.payload
            }

        case 'UPDATE_STAKERS':
            return {
                ...state,
                stakers: action.payload
            }
        case 'UPDATE_LOADING':
            return {
                ...state,
                loading: action.payload
            }
        
        case 'UPDATE_POOLS':
            return {
                ...state,
                pools: action.payload
            }

        case 'UPDATE_REWARDS':
            return {
                ...state,
                rewards: action.payload
            }

        case 'UPDATE_ORBN_PRICE':
            return {
                ...state,
                orbn_usd_price: action.payload
            }

        case 'UPDATE_USDT_PRICE':
            return {
                ...state,
                usdt_usd_price: action.payload
            }

        case 'UPDATE_GRAPH_DATA':
            return {
                ...state,
                graphData: action.payload
            }
        default:
            return state;
    };
}