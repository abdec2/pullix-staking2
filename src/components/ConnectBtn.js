// import { ConnectButton } from '@rainbow-me/rainbowkit';
// import { Button } from '@mui/material'
// export const ConnectBtn = () => {
//   return (
//     <ConnectButton.Custom>
//       {({
//         account,
//         chain,
//         openAccountModal,
//         openChainModal,
//         openConnectModal,
//         authenticationStatus,
//         mounted,
//       }) => {
//         // Note: If your app doesn't use authentication, you
//         // can remove all 'authenticationStatus' checks
//         const ready = mounted && authenticationStatus !== 'loading';
//         const connected =
//           ready &&
//           account &&
//           chain &&
//           (!authenticationStatus ||
//             authenticationStatus === 'authenticated');
//         return (
//           <div
//             {...(!ready && {
//               'aria-hidden': true,
//               'style': {
//                 opacity: 0,
//                 pointerEvents: 'none',
//                 userSelect: 'none',
//               },
//             })}
//           >
//             {(() => {
//               if (!connected) {
//                 return (
//                     <Button sx={{
//                         padding: '10px 23px', 
//                         fontSize: '14px',
//                         boxSizing: 'border-box',
//                         background: 'linear-gradient(242.73deg, #3FC5EA -7.24%, #025E9F 90.52%)',
//                         color: '#fff',
//                         fontWeight: 600,
//                         borderRadius: '5px', 
//                     }} onClick={openConnectModal} >Connect Wallet</Button>
                  
//                 );
//               }
//               if (chain.unsupported) {
//                 return (
//                     <Button sx={{
//                       padding: '10px 23px', 
//                       fontSize: '14px',
//                       boxSizing: 'border-box',
//                       background: 'linear-gradient(242.73deg, #3FC5EA -7.24%, #025E9F 90.52%)',
//                       color: '#fff',
//                       fontWeight: 600,
//                       borderRadius: '5px', 
//                   }} onClick={openChainModal} >Wrong Network</Button> 
                  
//                 );
//               }
//               return (
//                 <div style={{ display: 'flex', gap: 12 }}>
//                     <Button sx={{
//                         padding: '10px 23px', 
//                         fontSize: '14px',
//                         boxSizing: 'border-box',
//                         background: 'linear-gradient(242.73deg, #3FC5EA -7.24%, #025E9F 90.52%)',
//                         color: '#fff',
//                         fontWeight: 600,
//                         borderRadius: '5px', 
//                     }} onClick={openAccountModal} >{account.displayName}</Button>
                  
//                 </div>
//               );
//             })()}
//           </div>
//         );
//       }}
//     </ConnectButton.Custom>
//   );
// };