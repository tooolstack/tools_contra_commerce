import { describe, expect, it } from 'vitest';
import { documentPreset, generatedDocumentError, validateDocumentFiles } from '../components/PdfDocumentStudio';

const mb=(value:number)=>value*1024*1024;

describe('PDF and document file safeguards', () => {
  it('accepts supported PDF and image selections', () => {
    expect(validateDocumentFiles([{name:'report.pdf',size:mb(5),type:'application/pdf'}])).toBeNull();
    expect(validateDocumentFiles([{name:'photo.png',size:mb(2),type:'image/png'}],true)).toBeNull();
  });

  it('rejects unsupported types', () => {
    expect(validateDocumentFiles([{name:'script.exe',size:100,type:'application/x-msdownload'}])).toBe('Only PDF files are supported.');
    expect(validateDocumentFiles([{name:'photo.webp',size:100,type:'image/webp'}],true)).toBe('Only JPG and PNG images are supported.');
  });

  it('rejects oversized individual and combined selections', () => {
    expect(validateDocumentFiles([{name:'huge.pdf',size:mb(76),type:'application/pdf'}])).toContain('per-file limit');
    expect(validateDocumentFiles([
      {name:'a.pdf',size:mb(75),type:'application/pdf'},
      {name:'b.pdf',size:mb(75),type:'application/pdf'},
      {name:'c.pdf',size:1,type:'application/pdf'},
    ])).toContain('Keep one operation below');
  });

  it('limits batch count', () => {
    const files=Array.from({length:21},(_,index)=>({name:`${index}.pdf`,size:100,type:'application/pdf'}));
    expect(validateDocumentFiles(files)).toContain('no more than 20');
  });
});

describe('generated document templates', () => {
  it('provides distinct, structured English templates for every generator', () => {
    expect(documentPreset('resume','en').body).toContain('EXPERIENCE');
    expect(documentPreset('certificate','en').title).toContain('Certificate');
    expect(documentPreset('minutes','en').body).toContain('ACTION ITEMS');
    expect(documentPreset('proposal','en').body).toContain('SCOPE');
  });

  it('provides complete Bangla templates instead of mixed-language copy', () => {
    expect(documentPreset('resume','bn').body).toContain('কর্ম-অভিজ্ঞতা');
    expect(documentPreset('certificate','bn').title).toBe('অর্জনের সনদ');
    expect(documentPreset('minutes','bn').body).toContain('করণীয় কাজ');
    expect(documentPreset('proposal','bn').body).toContain('কাজের পরিধি');
  });

  it('validates required content and complete resume URLs', () => {
    const resume=documentPreset('resume','en');
    expect(generatedDocumentError({...resume,title:''},'resume')).toBe('Add a document title.');
    expect(generatedDocumentError({...resume,website:'github.com/example'},'resume')).toContain('http://');
    expect(generatedDocumentError({...resume,website:'https://example.com'},'resume')).toBeNull();
  });
});
