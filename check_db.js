const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found');
  process.exit(1);
}

const env = fs.readFileSync(envPath, 'utf8').split('\n').reduce((acc, line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) acc[match[1].trim()] = match[2].trim();
  return acc;
}, {});

const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('❌ Supabase env variables missing in .env');
  process.exit(1);
}

const supabase = createClient(url, key);

(async () => {
  try {
    console.log('\n📊 Fetching data from Supabase...\n');
    
    // Get form_responses with contacts
    const { data: responses, error: err1 } = await supabase
      .from('form_responses')
      .select('id, created_at, answers, contact_id')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (err1) {
      console.error('❌ Error fetching responses:', err1);
      process.exit(1);
    }
    
    console.log(`✅ Total form_responses: ${responses.length}`);
    console.log('\n📋 Recent Responses:\n');
    
    responses.forEach((resp, idx) => {
      console.log(`${idx + 1}. ID: ${resp.id}`);
      console.log(`   Created: ${new Date(resp.created_at).toLocaleString('pt-BR')}`);
      if (resp.answers) {
        const answers = typeof resp.answers === 'string' ? JSON.parse(resp.answers) : resp.answers;
        console.log(`   Data: ${JSON.stringify(answers, null, 2).split('\n').slice(0, 3).join('\n')}`);
      }
      console.log('');
    });
    
    // Get contacts count
    const { count, error: err2 } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true });
    
    if (!err2) {
      console.log(`\n👥 Total Contacts in database: ${count}`);
    }
    
    console.log('\n✨ Database verification complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
})();
