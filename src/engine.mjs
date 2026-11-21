export class EscrowError extends Error { constructor(message){super(message);this.name='EscrowError';} }
const ensure=(condition,message)=>{if(!condition)throw new EscrowError(message)};
export function createEscrow({buyer,seller,amount,deadlineHours=48,now=Date.now()}){
 ensure(buyer&&seller&&buyer!==seller,'買賣雙方必須不同');
 ensure(Number.isSafeInteger(amount)&&amount>0,'金額必須為正整數');
 ensure(Number.isSafeInteger(deadlineHours)&&deadlineHours>=1&&deadlineHours<=720,'期限必須介於 1 至 720 小時');
 return {buyer,seller,amount,deadline:now+deadlineHours*3600000,status:'CREATED',balance:0,recipient:null,events:[{type:'CREATED',at:now}]};
}
export function transition(state,action,actor,now=Date.now()){
 const s=structuredClone(state);
 const log=type=>s.events.push({type,actor,at:now});
 switch(action){
 case 'FUND':ensure(actor===s.buyer,'只有買方能付款');ensure(s.status==='CREATED','交易不可重複付款');ensure(now<s.deadline,'交易已逾期');s.balance=s.amount;s.status='FUNDED';log('FUNDED');break;
 case 'CONFIRM':ensure(actor===s.buyer,'只有買方能確認交付');ensure(s.status==='FUNDED','目前無法確認');ensure(now<s.deadline,'交易已逾期');s.status='RELEASED';s.recipient=s.seller;s.balance=0;log('RELEASED');break;
 case 'DISPUTE':ensure(actor===s.buyer||actor===s.seller,'只有交易當事人能申訴');ensure(s.status==='FUNDED','目前無法申訴');ensure(now<s.deadline,'交易已逾期');s.status='DISPUTED';log('DISPUTED');break;
 case 'REFUND_TIMEOUT':ensure(actor===s.buyer,'只有買方能執行逾期退款');ensure(s.status==='FUNDED','目前無法逾期退款');ensure(now>=s.deadline,'尚未到期');s.status='REFUNDED';s.recipient=s.buyer;s.balance=0;log('REFUNDED');break;
 case 'RESOLVE_REFUND':case 'RESOLVE_RELEASE':ensure(actor==='arbiter','只有獨立仲裁者能裁決');ensure(s.status==='DISPUTED','沒有待裁決的爭議');s.status=action==='RESOLVE_REFUND'?'REFUNDED':'RELEASED';s.recipient=action==='RESOLVE_REFUND'?s.buyer:s.seller;s.balance=0;log(s.status);break;
 default:throw new EscrowError('未知操作');
 }
 return s;
}
export function riskSignals(s){return [
 {name:'資金未託管',risk:s.status==='CREATED',description:'尚未付款；請勿私下轉帳'},
 {name:'交易爭議',risk:s.status==='DISPUTED',description:'雙方爭議待仲裁'},
 {name:'付款後未確認',risk:s.status==='FUNDED',description:'款項鎖定中，勿在未確認交付前放款'},
 {name:'交易已結束',risk:['RELEASED','REFUNDED'].includes(s.status),description:'交易結束，資金不可再次提領'}
 ];}
