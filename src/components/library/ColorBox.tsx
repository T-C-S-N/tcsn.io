export default function ColorBox({ color, name, hex }: { color: string, name: string, hex: string }) {
   return (
      <div className="color-box">
         <div className="color-box__color" style={{ backgroundColor: color }}></div>
         <div className="color-box__name">{name}</div>
         <div className="color-box__hex">{hex}</div>
      </div>
   )
}