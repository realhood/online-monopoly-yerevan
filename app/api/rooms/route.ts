import {env} from 'cloudflare:workers';
import {handleRooms} from '../../../lib/network-game.mjs';
export function POST(request:Request){return handleRooms(request,env.DB);}
