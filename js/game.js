const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup",   e => keys[e.key] = false);

const MODE = localStorage.getItem("mode") || "normal";
const HC   = MODE === "hardcore";
const SKINS = { skin_red:"#f44", skin_blue:"#48f", skin_gold:"#fd0", default:"#0f8" };

let score=0, level=+localStorage.getItem("startLevel")||1, frame=0, running=true, boss=null, particles=[];
const P = {
  x:100, y:200, w:30, h:30, spd:4,
  hp:HC?50:100, maxHp:HC?50:100, bullets:[], cooldown:0,
  color: SKINS[localStorage.getItem("skin")]||SKINS.default,
};
const enemies = [];

const rng  = (a,b) => Math.random()*(b-a)+a;
const hits = (a,b) => a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const burst = (x,y,col,n=8) => { for(let i=0;i<n;i++) particles.push({x,y,vx:rng(-3,3),vy:rng(-3,3),life:40,col}); };

const ETYPES=[
  {col:"#f33",spd:()=>2.5+level*.2,hp:1,w:25,h:25},
  {col:"#f80",spd:()=>4+level*.3,  hp:1,w:22,h:22},
  {col:"#a4f",spd:()=>1.5,         hp:3,w:40,h:40},
];
function spawnEnemy(){
  const t=ETYPES[Math.min(Math.floor(Math.random()*(level<3?1:level<6?2:3)),2)];
  enemies.push({x:canvas.width+20,y:rng(10,canvas.height-50),...t,spd:t.spd(),maxHp:t.hp,hp:t.hp});
}

function createBoss(){
  return{
    x:canvas.width-100,y:canvas.height/2-35,w:70,h:70,
    hp:20+level*5,maxHp:20+level*5,spd:2+level*.1,dir:-1,bullets:[],timer:0,
    get phase(){return this.hp<this.maxHp*.5?2:1;},
    update(){
      this.x+=this.spd*this.dir;
      if(this.x<canvas.width/2)this.dir=1;
      if(this.x+this.w>canvas.width-10)this.dir=-1;
      if(++this.timer>=(this.phase===2?50:80)){
        this.timer=0; const by=this.y+this.h/2;
        this.bullets.push({x:this.x,y:by,vx:-5,vy:0,w:10,h:10});
        if(this.phase===2){
          this.bullets.push({x:this.x,y:by,vx:-4,vy:2,w:10,h:10});
          this.bullets.push({x:this.x,y:by,vx:-4,vy:-2,w:10,h:10});
        }
      }
      this.bullets=this.bullets.filter(b=>{b.x+=b.vx;b.y+=b.vy;return b.x>-10&&b.y>-10&&b.y<canvas.height+10;});
    },
    draw(){
      const g=ctx.createRadialGradient(this.x+35,this.y+35,5,this.x+35,this.y+35,35);
      g.addColorStop(0,this.phase===2?"#f80":"#c00");g.addColorStop(1,"#300");
      ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(this.x,this.y,this.w,this.h,12);ctx.fill();
      [[18,22],[52,22]].forEach(([ex,ey])=>{
        ctx.fillStyle="#f00";ctx.beginPath();ctx.arc(this.x+ex,this.y+ey,8,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(this.x+ex+2,this.y+ey,4,0,Math.PI*2);ctx.fill();
      });
      const bx=canvas.width/2-60;
      ctx.fillStyle="#333";ctx.fillRect(bx,12,120,10);
      ctx.fillStyle=this.phase===2?"#f80":"#c00";ctx.fillRect(bx,12,120*(this.hp/this.maxHp),10);
      ctx.strokeStyle="#fff";ctx.lineWidth=1;ctx.strokeRect(bx,12,120,10);
      ctx.fillStyle="#fff";ctx.font="bold 9px monospace";ctx.textAlign="center";ctx.fillText("BOSS",canvas.width/2,11);
      ctx.fillStyle="#fa0";
      this.bullets.forEach(b=>{ctx.beginPath();ctx.arc(b.x,b.y,5,0,Math.PI*2);ctx.fill();});
    }
  };
}

function dmg(n){ P.hp-=n; burst(P.x+15,P.y+15,"#f00",6); if(P.hp<=0)endGame(); }
function endGame(){
  running=false;
  const c=+localStorage.getItem("coins")||0;
  localStorage.setItem("coins",c+Math.floor(score/10));
  document.getElementById("gameOver").classList.remove("hidden");
  document.getElementById("finalScore").textContent=`Score : ${score} | Coins : +${Math.floor(score/10)}`;
}

function loop(){
  if(!running)return;
  frame++;

  // Background
  const bg=ctx.createLinearGradient(0,0,canvas.width,canvas.height);
  bg.addColorStop(0,"#0a0a1a");bg.addColorStop(1,"#1a0a0a");
  ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle="rgba(255,68,68,0.05)";ctx.lineWidth=1;
  for(let x=0;x<canvas.width;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
  for(let y=0;y<canvas.height;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}

  // Input
  if(keys["ArrowUp"]||keys["w"]||keys["z"])P.y=Math.max(0,P.y-P.spd);
  if(keys["ArrowDown"]||keys["s"])P.y=Math.min(canvas.height-P.h,P.y+P.spd);
  if(keys["ArrowLeft"]||keys["a"]||keys["q"])P.x=Math.max(0,P.x-P.spd);
  if(keys["ArrowRight"]||keys["d"])P.x=Math.min(canvas.width-P.w,P.x+P.spd);
  if((keys[" "]||keys["ArrowRight"])&&--P.cooldown<=0){
    P.bullets.push({x:P.x+P.w+12,y:P.y+P.h/2-3,w:12,h:6});P.cooldown=15;
  }
  P.bullets=P.bullets.filter(b=>{b.x+=10;return b.x<canvas.width+20;});

  // Enemies
  if(!boss&&frame%Math.max(60-level*5,20)===0)spawnEnemy();
  for(let i=enemies.length-1;i>=0;i--){
    const e=enemies[i];e.x-=e.spd;
    ctx.fillStyle=e.col;ctx.beginPath();ctx.roundRect(e.x,e.y,e.w,e.h,4);ctx.fill();
    ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(e.x+8,e.y+8,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#000";ctx.beginPath();ctx.arc(e.x+9,e.y+9,2,0,Math.PI*2);ctx.fill();
    for(let j=P.bullets.length-1;j>=0;j--){
      if(hits(P.bullets[j],e)){
        P.bullets.splice(j,1);
        if(--e.hp<=0){burst(e.x+e.w/2,e.y+e.h/2,e.col);enemies.splice(i,1);score+=e.maxHp===3?30:e.spd>4?20:10;break;}
      }
    }
    if(i<enemies.length&&hits(e,P)){burst(e.x,e.y,"#f44");enemies.splice(i,1);dmg(HC?20:10);}
    if(i<enemies.length&&e.x+e.w<0){enemies.splice(i,1);dmg(HC?10:5);}
  }

  // Boss
  if(score>=level*200&&!boss){boss=createBoss();enemies.length=0;}
  if(boss){
    boss.update();
    for(let j=P.bullets.length-1;j>=0;j--){
      if(hits(P.bullets[j],boss)){
        P.bullets.splice(j,1);burst(boss.x+35,boss.y+35,"#fa0",4);
        if(--boss.hp<=0){burst(boss.x+35,boss.y+35,"#f80",30);score+=500;boss=null;level++;break;}
      }
    }
    if(boss){
      boss.bullets.forEach((b,i)=>{if(hits(b,P)){boss.bullets.splice(i,1);dmg(HC?15:8);}});
      if(hits(boss,P))dmg(1);
      boss.draw();
      if(frame%60<30){ctx.fillStyle="rgba(255,68,68,.8)";ctx.font="bold 18px monospace";ctx.textAlign="center";ctx.fillText("⚠ BOSS ⚠",canvas.width/2,canvas.height-15);}
    }
  }

  // Player bullets
  ctx.fillStyle="#ff0";P.bullets.forEach(b=>ctx.fillRect(b.x,b.y,b.w,b.h));

  // Particles
  particles=particles.filter(p=>p.life>0);
  particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.life--;ctx.globalAlpha=p.life/40;ctx.fillStyle=p.col;ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fill();});
  ctx.globalAlpha=1;

  // Player
  ctx.fillStyle=P.color;ctx.beginPath();ctx.roundRect(P.x,P.y,P.w,P.h,6);ctx.fill();
  ctx.fillStyle="#fff";ctx.fillRect(P.x+P.w,P.y+P.h/2-3,12,6);
  ctx.fillStyle="#333";ctx.fillRect(P.x-5,P.y-10,P.w+10,5);
  ctx.fillStyle=P.hp>50?"#0f8":P.hp>25?"#fa0":"#f33";
  ctx.fillRect(P.x-5,P.y-10,(P.w+10)*(P.hp/P.maxHp),5);

  // HUD
  document.getElementById("score").textContent=`Score: ${score}`;
  document.getElementById("health").textContent=`Health: ${P.hp}`;
  document.getElementById("level").textContent=`Level: ${level}`;

  requestAnimationFrame(loop);
}
loop();