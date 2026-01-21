<script lang="ts">
  import { onMount } from 'svelte';
  import Login from './lib/Login.svelte';
  import Dashboard from './lib/Dashboard.svelte';
  import Marketplace from './lib/Marketplace.svelte'; 
  import CreateWorkshop from './lib/CreateWorkshop.svelte';
  import PreviewWorkshop from './lib/PreviewWorkshop.svelte';

  let currentPath = window.location.pathname;

  onMount(() => {
    window.addEventListener('popstate', () => {
      currentPath = window.location.pathname;
    });
  });
</script>

<main>
  {#if currentPath === '/dashboard'}
    <Dashboard />
  {:else if currentPath === '/workshops' || currentPath === '/marketplace'}
    <Marketplace />
  {:else if currentPath === '/create-workshop'}
    <CreateWorkshop />
  {:else if currentPath === '/preview-workshop'}
    <PreviewWorkshop />
  {:else if currentPath === '/suggestions'}
    <div class="p-10">Suggestions Page (Link working!)</div> 
  {:else}
    <Login />
  {/if}
</main>