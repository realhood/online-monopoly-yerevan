import {env} from 'cloudflare:workers';
import {handleSocial} from '../../../../../lib/room-social.mjs';
export function GET(request:Request){return handleSocial(request,env.DB,env);}
export function POST(request:Request){return handleSocial(request,env.DB,env);}
