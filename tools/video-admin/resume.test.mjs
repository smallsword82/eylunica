import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

test('sunucu kota beklemesini yeniden başlatmada korur, zamanı gelince bir kez devam eder', async () => {
 const directory = await mkdtemp(path.join(tmpdir(), 'eylunica-resume-'));
 const stateFile = path.join(directory, 'state.json');
 const callsFile = path.join(directory, 'calls.jsonl');
 const preload = path.join(directory, 'mock-fetch.mjs');
 const origin = 'http://127.0.0.1:4182';
 await writeFile(preload, `import { appendFile } from 'node:fs/promises';
 globalThis.fetch = async url => {
  if (!url.startsWith('https://www.googleapis.com/youtube/v3/')) throw Error('Beklenmeyen hedef');
  await appendFile(${JSON.stringify(callsFile)}, JSON.stringify({url})+'\\n');
  return {ok:false,status:403,json:async()=>({error:{errors:[{reason:'quotaExceeded'}]}})};
 };`);
 const future = new Date(Date.now() + 3600000).toISOString();
 const initial = {version:1,videos:[],batchQueries:{},topicScans:{},research:{status:'quota-blocked',completedTopics:418,startedAt:'2026-10-01T00:00:00Z',updatedAt:new Date().toISOString(),retryAfter:future}};
 await writeFile(stateFile, JSON.stringify(initial));
 let child, exited;
 const stop = async () => { if(child){child.kill('SIGTERM');await exited;child=null;} };
 const start = async () => {
  child = spawn(process.execPath, ['--import',pathToFileURL(preload).href,new URL('server.mjs',import.meta.url).pathname], {
   env:{...process.env,YOUTUBE_API_KEY:'fixture',EYLUNICA_VIDEO_ADMIN_PORT:'4182',EYLUNICA_VIDEO_ADMIN_DATA_DIR:directory,EYLUNICA_VIDEO_CATALOG_PATH:path.join(directory,'catalog.json')},stdio:['ignore','pipe','pipe'],
  });
  exited = new Promise(resolve=>child.once('exit',resolve));
  await new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>reject(Error('Sunucu başlamadı')),5000);
   child.once('error',e=>{clearTimeout(timer);reject(e);});
   child.once('exit',()=>{clearTimeout(timer);reject(Error('Sunucu kapandı'));});
   child.stdout.once('data',()=>{clearTimeout(timer);resolve();});
  });
 };
 try {
  for(let restart=0;restart<2;restart++) {
   await start();
   const status=await (await fetch(origin+'/api/research-status')).json();
   assert.equal(status.retryAfter,future);assert.equal(status.completedTopics,418);
   assert.equal(status.startedAt,initial.research.startedAt);
   for(const route of ['/api/search','/api/search-all']) {
    const response=await fetch(origin+route,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'});
    assert.equal(response.status,429);assert.ok(Number(response.headers.get('retry-after'))>0);
    assert.equal((await response.json()).retryAfter,future);
   }
   const exportResponse=await fetch(origin+'/api/export',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'});
   assert.equal(exportResponse.status,200);
   await assert.rejects(readFile(callsFile),{code:'ENOENT'});
   await stop();
  }
  const saved=JSON.parse(await readFile(stateFile,'utf8'));
  saved.research.retryAfter=new Date(Date.now()-1000).toISOString();
  await writeFile(stateFile,JSON.stringify(saved));
  await start();
  let resumed;
  for(let attempt=0;attempt<100;attempt++) {
   resumed=await (await fetch(origin+'/api/research-status')).json();
   if(resumed.startedAt!==initial.research.startedAt&&resumed.status==='quota-blocked')break;
   await new Promise(resolve=>setTimeout(resolve,30));
  }
  assert.equal(resumed.status,'quota-blocked');assert.notEqual(resumed.startedAt,initial.research.startedAt);
  assert.ok(Date.parse(resumed.retryAfter)>Date.now());
  assert.equal((await readFile(callsFile,'utf8')).trim().split('\n').length,1);
  await stop();await start();
  assert.equal((await (await fetch(origin+'/api/research-status')).json()).retryAfter,resumed.retryAfter);
  assert.equal((await readFile(callsFile,'utf8')).trim().split('\n').length,1);
  await stop();
  const paused=JSON.parse(await readFile(stateFile,'utf8'));
  paused.research.pausedByUser=true;paused.research.retryAfter=new Date(Date.now()-1000).toISOString();
  await writeFile(stateFile,JSON.stringify(paused));await start();
  assert.equal((await(await fetch(origin+'/api/research-status')).json()).pausedByUser,true);
  const blocked=await fetch(origin+'/api/search-all',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'});
  assert.equal(blocked.status,409);
  assert.equal((await readFile(callsFile,'utf8')).trim().split('\n').length,1);
 } finally {await stop();await rm(directory,{recursive:true,force:true});}
});
