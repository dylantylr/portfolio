const API='https://pokeapi.co/api/v2';
const clean=t=>t.replace(/[\n\f\r­]+/g,' ').replace(/\s+/g,' ').trim();
const titleCase=s=>s.split('-').map(p=>p[0].toUpperCase()+p.slice(1)).join(' ');
function matcher(slug){return new RegExp(slug.split('-').map(p=>p.replace(/[^a-z0-9]/gi,'')).join("[\s.\-']*"),'gi');}

// Snorlax (143) and Mr. Mime (122) exercise the tricky redaction cases.
for (const id of [143, 122, 25, 1]) {
  const sp = await (await fetch(`${API}/pokemon-species/${id}`)).json();
  const en = sp.flavor_text_entries.filter(e=>e.language.name==='en');
  const ja = sp.flavor_text_entries.filter(e=>e.language.name==='ja');
  const p  = await (await fetch(`${API}/pokemon/${sp.id}`)).json();
  const art = p.sprites?.other?.['official-artwork']?.front_default;
  const raw = clean(en[0].flavor_text);
  console.log('---', sp.name, '| en entries', en.length, '| ja entries', ja.length);
  console.log('  raw      :', raw.slice(0,95));
  console.log('  redacted :', raw.replace(matcher(sp.name),'?????').slice(0,95));
  console.log('  leak?    :', new RegExp(sp.name,'i').test(raw.replace(matcher(sp.name),'?????')));
  console.log('  artwork  :', art ? 'present' : 'MISSING');
  console.log('  cry      :', p.cries?.latest ? 'present' : 'missing');
  console.log('  version  :', en[0].version.name, '| gen', sp.generation.name);
}
const names = await (await fetch(`${API}/pokemon-species?limit=1025`)).json();
console.log('\nspecies list count:', names.results.length, '| sample:', names.results.slice(0,3).map(r=>r.name).join(', '));
