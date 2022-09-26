 function Popup ({openMenu, askPromotePiece}: {openMenu: boolean; askPromotePiece: (data:string)=>void}){
  let choice = ""
  const promotionChoice = () => {
      askPromotePiece(choice)
      choice = ""
  }
  return(
    <div id={openMenu ? "choose" : "choose-hidden"}> 
      <div className="choose-text">Select a piece to promote to:</div>
      <button className="promotion--button" onClick={() => {choice= "Q"; promotionChoice()}} >♕</button>
      <button className="promotion--button" onClick={() => {choice= "R"; promotionChoice()}}>♖</button>
      <button className="promotion--button" onClick={() => {choice= "B"; promotionChoice()}}>♗</button>
      <button className="promotion--button" onClick={() => {choice= "K"; promotionChoice()}}>♘</button>   
  </div>
  )
};

export { Popup }