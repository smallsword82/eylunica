import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { chromium } from '@playwright/test';

test('API yöneticisi: anahtar bekleme, inceleme kapısı, JSON aktarımı ve red', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'eylunica-video-test-'));
  const target = path.join(directory, 'approved.json');
  const origin = 'http://127.0.0.1:4181';
  await writeFile(target,JSON.stringify({version:1,videos:[{id:'old01234567',publishedAt:'2024-12-31',status:'approved'}]}));
  await writeFile(path.join(directory,'state.json'), JSON.stringify({version:1,videos:[{identity:'place-value:abcdefghijk',id:'abcdefghijk',url:'https://www.youtube.com/watch?v=abcdefghijk',topicId:'place-value',title:'Basamak değeri',channel:null,publishedAt:'2026-10-01',channelId:'UCb-0JQ4tI03T5rHdFe2GVoA',metadataStatus:'api-provided',metadataSource:'YouTube Data API v3',fetchedAt:'2026-10-20T00:00:00Z',duration:null,status:'pending'}]}));
  const child = spawn(process.execPath, [new URL('server.mjs', import.meta.url).pathname], { env: { ...process.env, YOUTUBE_API_KEY: '', EYLUNICA_VIDEO_ADMIN_PORT: '4181', EYLUNICA_VIDEO_ADMIN_DATA_DIR: directory, EYLUNICA_VIDEO_CATALOG_PATH: target }, stdio: ['ignore','pipe','pipe'] });
  let browser;
  const exited = new Promise(resolve => child.once('exit', resolve));
  try {
    await new Promise((resolve,reject) => { const timer=setTimeout(()=>reject(Error('Sunucu başlamadı')),5000);child.once('error',reject);child.once('exit',()=>reject(Error('Sunucu kapandı')));child.stdout.once('data',()=>{clearTimeout(timer);resolve();}); });
    browser = await chromium.launch({executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
    assert.deepEqual(JSON.parse(await readFile(target,'utf8')).videos,[]);
    const page = await browser.newPage();
    const external=[];page.on('request',r=>{if(!r.url().startsWith(origin))external.push(r.url());});
    await page.goto(origin);
    assert.equal(await page.getByLabel('YouTube bağlantısı').count(),0);
    await page.getByRole('button',{name:'Katalogdaki tüm konuları API ile araştır'}).click();
    await page.getByRole('status').filter({hasText:'YOUTUBE_API_KEY'}).waitFor();
    await page.getByRole('heading',{name:'Basamak değeri'}).waitFor();
    assert.equal(await page.locator('iframe').count(),0);
    const post=async(route,data,from=origin)=>fetch(origin+route,{method:'POST',headers:{Origin:from,'Content-Type':'application/json'},body:JSON.stringify(data)});
    assert.equal((await post('/api/export',{},'https://example.com')).status,403);
    assert.equal((await post('/api/add',{})).status,404);
    await page.getByRole('button',{name:'Onaylı JSON kataloğunu dışa aktar'}).click();
    await page.getByRole('status').filter({hasText:'İşlem tamamlandı.'}).waitFor();
    assert.deepEqual(JSON.parse(await readFile(target,'utf8')).videos,[]);
    const state=JSON.parse(await readFile(path.join(directory,'state.json'),'utf8'));
    assert.equal(state.videos[0].title,'Basamak değeri');assert.equal(state.videos[0].publishedAt,'2026-10-01');
    const identity=state.videos[0].identity;
    assert.equal((await post('/api/review',{identity,status:'approved'})).status,400);
    await page.getByLabel('2026–2027 müfredat eşleşmesini resmî kaynaktan doğruladım').check();
    await page.getByLabel('Çocuk uygunluğunu videonun tamamında inceledim').check();
    await page.getByLabel('İnceleyen',{exact:true}).fill('Test editörü');
    await page.getByLabel('Resmî kaynak ve inceleme notu').fill('İzole test örneği, gerçek video önerisi değildir.');
    for(const [label,value] of [['curriculum (0–40)','40'],['freshness (0–25)','25'],['quality (0–20)','20'],['safety (0–15)','15']]) await page.getByLabel(label,{exact:true}).fill(value);
    await page.getByRole('button',{name:'Onayla',exact:true}).click();
    await page.getByText(/· approved$/).waitFor();
    await post('/api/export',{});
    const catalog=JSON.parse(await readFile(target,'utf8'));
    assert.equal(catalog.videos.length,1);assert.equal(catalog.videos[0].role,'primary');assert.equal(catalog.videos[0].title,'Basamak değeri');
    await page.getByRole('button',{name:'Reddet',exact:true}).click();
    await page.getByText(/· rejected$/).waitFor();
    await post('/api/export',{});
    assert.deepEqual(JSON.parse(await readFile(target,'utf8')).videos,[]);
    assert.deepEqual(external,[]);
  } finally {
    if(browser)await browser.close();child.kill('SIGTERM');await exited;await rm(directory,{recursive:true,force:true});
  }
});
