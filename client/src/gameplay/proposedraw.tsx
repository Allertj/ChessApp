export const ProposeDraw = ({openMenu, drawAnswer}: {openMenu: Boolean, drawAnswer: (choice: boolean) => void}) => {
    let choice = false
    const proposeDrawAnswer = () => {
      drawAnswer(choice)
    }
    return(
        <div id={openMenu ? "choose" : "choose-hidden"}> 
          <div className="choose-text">The other player has proposed a draw:</div>
          <button className="promotion--button" onClick={() => {choice= true; proposeDrawAnswer()}}>Accept</button>
          <button className="promotion--button" onClick={() => {choice= false; proposeDrawAnswer()}}>Decline</button>  
        </div>
    )
  };

