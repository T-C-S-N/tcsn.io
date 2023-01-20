import Logo from "./Logo"

export default function MobileMessage({ text }: { text: string }) {
   return (
      <div className="mobile-only" style={{
         display: 'flex',
         flexDirection: 'column',
         alignItems: 'center',
         justifyContent: 'flex-start',
         marginTop: '10vh',
         width: '90%',
      }}>
         <div style={{
            width: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px'
         }}>
            <Logo active={true} />
         </div>
         <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
         }}>
            <div className="font-size-subtitle">{text}</div>
         </div>
      </div >
   )
}