#!/usr/bin/env python3
"""Find freely reusable Commons photos; download, inspect, then explicitly approve locally.
No unreviewed candidate is added to the student catalogue.
"""
import argparse, hashlib, html, json, re, urllib.parse, urllib.request
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
LICENSES={'CC0','Public domain','CC BY 4.0','CC BY-SA 4.0','CC BY 3.0','CC BY-SA 3.0'}
class Plain(HTMLParser):
 def __init__(self):super().__init__();self.parts=[]
 def handle_data(self,data):self.parts.append(data)
def plain(value):
 p=Plain();p.feed(value);return html.unescape(' '.join(p.parts)).strip()
def request(url):
 if not url.startswith(('https://commons.wikimedia.org/','https://upload.wikimedia.org/')):raise ValueError('Unexpected photo host')
 return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'EylunicaEducationalCatalog/1.0 (license-verified local educational images)'}),timeout=30)
def api(**params):
 with request('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','format':'json',**params})) as r:return json.load(r)
def info(title):
 pages=api(titles=title,prop='imageinfo',iiprop='url|mime|extmetadata',iiurlwidth=960)['query']['pages']
 page=next(iter(pages.values()));i=page.get('imageinfo',[{}])[0];meta=i.get('extmetadata',{})
 license=plain(meta.get('LicenseShortName',{}).get('value',''))
 if license not in LICENSES:raise ValueError('License not accepted or unverified: '+license)
 if i.get('mime') not in ('image/jpeg','image/png'):raise ValueError('Only raster photo candidates are accepted')
 source='https://commons.wikimedia.org/wiki/'+urllib.parse.quote(page['title'],safe=':')
 license_url=meta.get('LicenseUrl',{}).get('value','').replace('http://','https://',1)
 if license=='Public domain' and not license_url:license_url=source
 if not license_url.startswith(('https://creativecommons.org/','https://commons.wikimedia.org/')):raise ValueError('Unverified license URL')
 author=plain(meta.get('Artist',{}).get('value',''))
 if not author:raise ValueError('Author/credit is missing')
 return {'title':page['title'],'author':author,'sourceUrl':source,'originalUrl':i['url'],'downloadUrl':i.get('thumburl',i['url']),'license':license,'licenseUrl':license_url,'rawMetadata':meta}
def search(query):
 data=api(list='search',srsearch=query,srnamespace=6,srlimit=12)
 for result in data['query']['search']:
  try:
   m=info(result['title']);print(json.dumps({k:m[k] for k in ['title','author','license','sourceUrl']},ensure_ascii=False))
  except ValueError:pass

def download(title,out):
 m=info(title);out=Path(out);out.mkdir(parents=True,exist_ok=True)
 with request(m['downloadUrl']) as r:data=r.read(20*1024*1024+1)
 if len(data)>20*1024*1024:raise ValueError('Photo exceeds 20 MiB')
 (out/'candidate.image').write_bytes(data);m['downloadSha256']=hashlib.sha256(data).hexdigest()
 (out/'candidate.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
 print('Downloaded candidate for visual inspection:',str(out/'candidate.image'))

def approve(args):
 from PIL import Image,ImageOps
 folder=Path(args.candidate);m=json.loads((folder/'candidate.json').read_text());data=(folder/'candidate.image').read_bytes()
 if hashlib.sha256(data).hexdigest()!=m['downloadSha256']:raise ValueError('Candidate changed after download')
 if m['license'] not in LICENSES:raise ValueError('Unverified license')
 if args.topic=='topic-f31f5d0c12bc3e58' and args.context=='example' and args.role=='choir':raise ValueError('A choir photo must not illustrate the chess worked example')
 frames=[int(v) for v in args.frames.split(',')]
 if not frames or any(f<0 or f>3 for f in frames):raise ValueError('Frame must be 0–3')
 Image.MAX_IMAGE_PIXELS=40_000_000
 with Image.open(folder/'candidate.image') as original:
  im=ImageOps.exif_transpose(original).convert('RGB');im.thumbnail((1200,900))
  name=args.role+'-'+m['downloadSha256'][:12]+'.webp';dest=ROOT/'public/media/social'/name;dest.parent.mkdir(parents=True,exist_ok=True);im.save(dest,'WEBP',quality=85)
 digest=hashlib.sha256(dest.read_bytes()).hexdigest();record={k:m[k] for k in ['author','sourceUrl','originalUrl','license','licenseUrl']}
 record.update(id=args.topic+'-'+args.role+'-'+args.context,topicId=args.topic,role=args.role,src='/media/social/'+name,alt=args.alt,caption=args.caption,sha256=digest,reviewed=True,frames=frames,context=args.context,changes='Resized and converted to WebP; original attribution and license retained.')
 path=ROOT/'src/grade5/social-photo-catalog.json';catalog=json.loads(path.read_text());catalog=[p for p in catalog if p['id']!=record['id']];catalog.append(record)
 path.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
 dest.with_suffix('.license.txt').write_text('\n'.join(str(record[k]) for k in ['author','sourceUrl','license','licenseUrl','changes'])+'\n')
 print('Added visually reviewed photo:',record['id'])
if __name__=='__main__':
 parser=argparse.ArgumentParser(description=__doc__);sub=parser.add_subparsers(dest='command',required=True)
 p=sub.add_parser('search');p.add_argument('query')
 p=sub.add_parser('download');p.add_argument('--title',required=True);p.add_argument('--out',required=True)
 p=sub.add_parser('approve');p.add_argument('--candidate',required=True);p.add_argument('--topic',required=True);p.add_argument('--role',choices=['family','school','choir','chess','context'],required=True);p.add_argument('--frames',required=True);p.add_argument('--context',choices=['explanation','example'],required=True);p.add_argument('--alt',required=True);p.add_argument('--caption',required=True)
 args=parser.parse_args()
 if args.command=='search':search(args.query)
 elif args.command=='download':download(args.title,args.out)
 else:approve(args)
