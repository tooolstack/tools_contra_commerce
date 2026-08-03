import { expect, test } from '@playwright/test';

test('health and readiness endpoints return structured responses',async({request})=>{
  for(const endpoint of ['/api/health','/api/ready']){
    const response=await request.get(endpoint);
    expect([200,503],`${endpoint} returned an unexpected status`).toContain(response.status());
    expect(response.headers()['content-type']).toContain('application/json');
    expect(await response.json()).toBeTruthy();
  }
});

const guardedPosts=['ad-copy','courier-book','courier-rates','domain-check','event','fraud-check','lead','product-description','store-health','survey-vote','track'];
for(const endpoint of guardedPosts){
  test(`${endpoint} rejects or safely handles an empty request`,async({request})=>{
    const response=await request.post(`/api/${endpoint}`,{data:{}});
    expect(response.status(),`/api/${endpoint} crashed`).toBeLessThan(504);
    expect(response.headers()['content-type']||'').toContain('application/json');
  });
}

test('URL inspection blocks local-network targets',async({request})=>{
  const response=await request.post('/api/url-inspect',{data:{url:'http://127.0.0.1',mode:'headers'}});
  expect(response.status()).toBe(400);
  expect(JSON.stringify(await response.json())).toMatch(/public|local|private/i);
});
