#!/usr/bin/env python3
"""Import public MEB grade-5 data, retaining URLs and source checksums.
No YouTube scraping; this tool only reads official MEB pages/endpoints.
"""
import concurrent.futures, datetime, hashlib, html, json, pathlib, re, urllib.request
from html.parser import HTMLParser
ROOT = pathlib.Path(__file__).resolve().parents[2]
CACHE = ROOT / '.tools/curriculum-sources'
CACHE.mkdir(parents=True, exist_ok=True)
BASE = 'https://tymm.meb.gov.tr'
CHECKED = '2026-10-21'
class Node:
 def __init__(self,tag='',attrs=(),parent=None):self.tag=tag;self.attrs=dict(attrs);self.parent=parent;self.children=[]
 def nodes(self,pred):
  return ([self] if pred(self) else []) + [v for c in self.children if isinstance(c,Node) for v in c.nodes(pred)]
 def text(self):
  value=''.join(c.text() if isinstance(c,Node) else c for c in self.children)
  return ('\n'+value+'\n') if self.tag in ['p','li','br','div','h1','h2','h3','tr'] else value
 def has(self,name):return name in self.attrs.get('class','').split()
class DOM(HTMLParser):
 def __init__(self):super().__init__();self.root=Node();self.stack=[self.root]
 def handle_starttag(self,t,a):
  n=Node(t,a,self.stack[-1]);self.stack[-1].children.append(n)
  if t not in ['br','hr','img','input','meta','link','source','wbr','area','base','embed']:self.stack.append(n)
 def handle_endtag(self,t):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==t:self.stack=self.stack[:i];break
 def handle_data(self,d):self.stack[-1].children.append(d)
def clean(text):return '\n'.join(' '.join(line.split()) for line in text.splitlines() if line.strip())
def fetch(url,name):
 p=CACHE/name
 if not p.exists():
  with urllib.request.urlopen(url,timeout=35) as r: body=r.read()
  p.write_bytes(body)
 return p.read_bytes()
def parse(body):
 p=DOM();p.feed(body.decode('utf-8-sig'));return p.root
def get_json(path,name):return json.loads(fetch(BASE+path,name))
def fields(dom):
 output={}
 for row in dom.nodes(lambda n:n.tag=='div' and n.has('row')):
  titles=row.nodes(lambda n:n.tag=='div' and n.has('title'))
  contents=row.nodes(lambda n:n.tag=='div' and n.has('content'))
  if titles and contents:output[clean(titles[0].text())]=contents[0]
 return output
courses=get_json('/Ders/GetDerslerBySinif?sinifId=6&kademe=2&programListedOnly=false','courses-all-grade5.json')
# The elective list is separate from the grade-5 list; include it only when the
# grade-5 unit endpoint actually returns units for that program.
electives=get_json('/Ders/GetDerslerBySinif?sinifId=18&kademe=2&programListedOnly=false','electives.json')
by_id={c['id']:c for c in courses}
for c in electives:
 if c['id'] not in by_id:by_id[c['id']]={**c,'electiveList':True}
core_map={6:'course-0',7:'course-1',3:'course-2',8:'course-3',34:'course-4',37:'course-5',10:'course-6',38:'course-7',40:'course-8',32:'course-9',36:'course-10'}
all_units=[];selected=[];errors=[]
def import_course(c):
 source=BASE+'/Unite/GetUnitelerByDersId?dersId='+str(c['id'])+'&sinifId=6'
 units=json.loads(fetch(source,f"units-{c['id']}.json"))
 # TTKB decision 115 (23/09/2026), grade-5 elective column.
 eligible={95,66,67,72,73,75,77,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,154,96,97,99}
 if not units and c.get('electiveList') and c['id'] in eligible:
  source=BASE+'/Unite/GetUnitelerByDersId?dersId='+str(c['id'])+'&sinifId=18'
  units=json.loads(fetch(source,f"elective-units-{c['id']}.json"))
  c={**c,'modular':True}
 return c,units,source
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 for result in pool.map(import_course,by_id.values()):
  c,units,url=result
  if not units and not c.get('modular'):continue
  model='multiple-language' if 'Çoklu' in c['dersAdi'] else 'elective' if c.get('electiveList') or c['id'] in [12,11,149,114,115,116,117,118,119] else 'standard'
  cid=core_map.get(c['id'],'meb-course-'+str(c['id']))
  name=c['dersAdi'].replace('Ortaokul ','').replace(' Dersi (Temel Eğitim)','').replace(' Dersi','')
  selected.append(dict(id=cid,name=name,model=model,verification='verified',mebId=c['id'],sourceUrl=url,programUrl=BASE+'/ogretim-programlari/ders/'+c['url'],checkedAt=CHECKED))
  all_units.extend((cid,model,{**u,'modular':c.get('modular',False)}) for u in units)
def import_unit(row):
 cid,model,u=row
 url=BASE+'/'+u['url']+'/unite/'+str(u['id'])
 body=fetch(url,'unit-'+str(u['id'])+'.html');dom=parse(body);f=fields(dom)
 intro=dom.nodes(lambda n:n.has('unite-detail__intro'))
 framework=next((v for k,v in f.items() if k=='İçerik Çerçevesi'),None)
 outcomes_node=next((v for k,v in f.items() if 'Öğrenme Çıktıları' in k or 'Kazanımlar' in k),None)
 outcomes=[]
 if outcomes_node:
  for n in outcomes_node.nodes(lambda n:n.tag in ['strong','b']):
   text=clean(n.text())
   m=re.match(r'^([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ.\d/-]*\.\d[\w.\-/]*)[.\s]+(.+)',text)
   if m and len(m.group(2))>5:outcomes.append(dict(code=m.group(1).rstrip('.'),text=m.group(2)))
  if not outcomes:
   for line in clean(outcomes_node.text()).splitlines():
    m=re.match(r'^([A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ.\d/-]*\.\d[\w.\-/]*)[.\s]+(.+)',line)
    if m and len(m.group(2))>5:outcomes.append(dict(code=m.group(1).rstrip('.'),text=m.group(2)))
 seen=set();outcomes=[o for o in outcomes if not(o['code'] in seen or seen.add(o['code']))]
 content=clean(framework.text()) if framework else ''
 # Preserve source lines; no invented topic labels or learning outcomes.
 subtopics=[line.strip(' •–-\t') for line in content.splitlines() if len(line.strip())>2]
 return dict(id='meb-unit-'+str(u['id']),courseId=cid,unit=((u.get('duzeyAd')+' · ') if u.get('modular') and u.get('duzeyAd') else '')+u['title'],title=u['title'],year='2026-2027',models=[model],weeks=[],outcomes=outcomes,source=dict(url=url,checkedAt=CHECKED,status='verified',note=('TTKB 2026–2027 çizelgesinde 5. sınıfta seçilebilen modüler program; düzeyi okul belirler. ' if u.get('modular') else 'MEB resmî 5. sınıf programı. ')+'Haftalar okulun yıllık planına göre değişebilir; boş hafta alanı doğrulanmış bir takvim iddiası taşımaz.'),summary=clean(intro[0].text()) if intro else '',example='',subtopics=subtopics,framework=content,outcomeText=clean(outcomes_node.text()) if outcomes_node else '',hours=clean(f['Ders Saati'].text()) if 'Ders Saati' in f else None,level=u.get('duzeyAd'),sourceSha256=hashlib.sha256(body).hexdigest())
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: units=list(pool.map(import_unit,all_units))
result=dict(version=1,checkedAt=CHECKED,year='2026-2027',yearSource=BASE+'/taslak-cerceve-planlari/temel-egitim',courseListSource=BASE+'/Ders/GetDerslerBySinif?sinifId=6&kademe=2&programListedOnly=false',scheduleVerification='pending',courses=selected,units=units)
out=ROOT/'src/grade5/official-curriculum.json';out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
(CACHE/'raw-curriculum.json').write_text(json.dumps(result,ensure_ascii=False))
print(json.dumps(dict(courses=len(selected),units=len(units),outcomes=sum(len(u['outcomes']) for u in units),frameworkLines=sum(len(u['subtopics']) for u in units)),ensure_ascii=False))
for c in selected:print(c['name'],len([u for u in units if u['courseId']==c['id']]))
