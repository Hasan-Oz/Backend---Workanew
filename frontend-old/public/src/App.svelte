<script>
  import { onMount } from 'svelte';
  import Login from './lib/Login.svelte';
  import Signup from './lib/Signup.svelte';
  import Dashboard from './lib/Dashboard.svelte';

  let page = 'login'; 

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || localStorage.getItem('token');

    if (token) {
      localStorage.setItem('token', token);
      if (params.get('token')) window.history.replaceState({}, document.title, "/");
      page = 'dashboard';
    }
  });

  function handleLoginSuccess() { page = 'dashboard'; }
  function handleLogout() { localStorage.removeItem('token'); page = 'login'; }
  function handleNavigate(dest) { page = dest; }
</script>

<main>
  {#if page === 'login'}
    <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />
  {:else if page === 'signup'}
    <Signup onNavigate={handleNavigate} />
  {:else if page === 'dashboard'}
    <Dashboard onLogout={handleLogout} />
  {/if}
</main>