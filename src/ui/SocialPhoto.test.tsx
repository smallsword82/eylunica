import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {SocialPhoto} from './SocialPhoto';
import type {SocialPhoto as Photo} from '../grade5/social-photos';
afterEach(cleanup);
it('shows explicit credits and gracefully returns to the lesson illustration when a local photo fails',()=>{
 const photo={src:'/media/social/fixture.webp',alt:'Test image',caption:'Test caption',author:'Fixture author',license:'CC0',sourceUrl:'https://commons.wikimedia.org/wiki/File:Fixture.jpg',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/'} as Photo;
 render(<SocialPhoto photo={photo} fallback={<svg role="img" aria-label="Mevcut öğretici şekil"/>}/>);expect(screen.getByText('Gerçek yaşamdan örnek fotoğraf')).toBeInTheDocument();expect(screen.getByText('Fixture author · CC0')).toBeInTheDocument();fireEvent.error(screen.getByAltText('Test image'));expect(screen.getByRole('img',{name:'Mevcut öğretici şekil'})).toBeInTheDocument();expect(screen.queryByText('Yüklenemedi')).not.toBeInTheDocument();
});
