import {useState} from 'react';
import type {SocialPhoto as Photo} from '../grade5/social-photos';
export function SocialPhoto({photo,fallback}:{photo:Photo;fallback:React.ReactNode}){
 const [failed,setFailed]=useState(false);if(failed)return fallback;
 return <figure className="social-real-photo"><img src={photo.src} alt={photo.alt} onError={()=>setFailed(true)}/><figcaption><strong>{photo.caption}</strong><span>Gerçek yaşamdan örnek fotoğraf</span><details><summary>Fotoğraf kaynağı ve lisansı</summary><span>{photo.author} · {photo.license}</span><a href={photo.sourceUrl} target="_blank" rel="noreferrer">Kaynak ↗</a><a href={photo.licenseUrl} target="_blank" rel="noreferrer">Lisans ↗</a></details></figcaption></figure>;
}
