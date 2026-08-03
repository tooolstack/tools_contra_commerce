import { describe, expect, it } from 'vitest';
import { validateImageFile } from '../components/ImageToolsStudio';

const mb=(value:number)=>value*1024*1024;

describe('image workflow safeguards', () => {
  it.each(['image/jpeg','image/png','image/webp'])('accepts supported %s files', type => {
    expect(validateImageFile({name:'photo',size:mb(2),type},3000,2000)).toBeNull();
  });
  it('rejects disguised or unsupported files', () => {
    expect(validateImageFile({name:'vector.svg',size:500,type:'image/svg+xml'})).toBe('Choose a JPG, PNG or WebP image.');
  });
  it('rejects files above the byte limit', () => {
    expect(validateImageFile({name:'huge.png',size:mb(41),type:'image/png'})).toContain('40.00 MB limit');
  });
  it('rejects decoded images above the pixel limit', () => {
    expect(validateImageFile({name:'huge.png',size:mb(10),type:'image/png'},10_000,6_000)).toContain('60.0 megapixels');
  });
});
