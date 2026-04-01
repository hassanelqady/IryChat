'use client'

export default function BgMesh() {
  return (
    <>
      <div style={{position:'fixed',inset:0,zIndex:0,overflow:'hidden',pointerEvents:'none'}}>
        <div style={{position:'absolute',width:700,height:700,borderRadius:'50%',background:'rgba(0,212,255,0.13)',filter:'blur(110px)',top:-200,right:-180,animation:'blob 12s ease-in-out infinite alternate'}} />
        <div style={{position:'absolute',width:550,height:550,borderRadius:'50%',background:'rgba(0,80,255,0.10)',filter:'blur(110px)',bottom:-150,left:-150,animation:'blob 12s ease-in-out infinite alternate',animationDelay:'-5s'}} />
        <div style={{position:'absolute',width:400,height:400,borderRadius:'50%',background:'rgba(0,212,255,0.06)',filter:'blur(110px)',top:'45%',left:'38%',animation:'blob 12s ease-in-out infinite alternate',animationDelay:'-9s'}} />
      </div>
      <style>{`
        @keyframes blob {
          0% { transform: translate(0,0) scale(1); }
          100% { transform: translate(35px,25px) scale(1.08); }
        }
      `}</style>
    </>
  )
}
