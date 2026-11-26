const projectUrl = '';
const publishableKey = '';

export let backend = null;
if (projectUrl && publishableKey) {
  const {createClient} = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.89.0/+esm');
  backend = createClient(projectUrl, publishableKey, {
    auth: {flowType: 'pkce', storageKey: 'digitalis-tanulomuhely-auth'}
  });
}
