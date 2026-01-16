<script>
  import { onMount } from 'svelte';
  import Login from './lib/Login.svelte';
  import Signup from './lib/Signup.svelte';
  import Dashboard from './lib/Dashboard.svelte';

  let page = 'login'; // Options: 'login', 'signup', 'dashboard'

  onMount(() => {
    // 1. Check for Social Login Token in URL
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    if (urlToken) {
      localStorage.setItem('token', urlToken);
      window.history.replaceState({}, document.title, "/"); // Clean URL
      page = 'dashboard';
    } 
    // 2. Check for existing Token in Storage
    else if (localStorage.getItem('token')) {
      page = 'dashboard';
    }
  });

  function handleLoginSuccess() {
    page = 'dashboard';
  }

  function handleLogout() {
    localStorage.removeItem('token');
    page = 'login';
  }

  function handleNavigate(destination) {
    page = destination;
  }
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