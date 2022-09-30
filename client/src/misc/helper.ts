import { Game } from '../chess/game'

function replacer(key: string, value: Object) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), 
      };
    } else {
      return value;
    }
  }

function reviver(key: string, value: any) {
    if(typeof value === 'object' && value !== null) {
        if (value.typeletter) {
            const {x, y, typeletter, moved, player} = value
            return Game.getInstanceOfPiece(x, y, typeletter, player, moved)
        }
        // if (value.dataType === 'Map') {
            // return new Map(value.value);
        // }
    }
    return value;
    }

export {replacer, reviver}