<script>
  import { onMount } from 'svelte';
  export let onLogout;
  let workshops = [], isLoading = true;

  onMount(async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/workshops", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) workshops = await res.json();
    } catch (e) { console.error("Error"); } finally { isLoading = false; }
  });
</script>

<div class="min-h-screen bg-[#F6F7FB] flex">
  <aside class="hidden md:flex w-[86px] flex-col items-center py-6 bg-white border-r">
    <div class="h-12 w-12 rounded-2xl bg-[#1F2D4B] flex items-center justify-center text-white font-bold text-xl mb-8">WF</div>
    <button on:click={onLogout} class="mt-auto h-10 w-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center">🛑</button>
  </aside>
  <main class="flex-1 p-8 overflow-y-auto">
    <h1 class="text-2xl font-bold text-[#1F2D4B] mb-8">Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#if isLoading}
        <p>Loading...</p>
      {:else if workshops.length === 0}
        <div class="col-span-full bg-white p-8 rounded-[20px] text-center shadow-sm">No workshops found.</div>
      {:else}
        {#each workshops as w}
          <div class="bg-white p-5 rounded-[20px] shadow-sm hover:shadow-md transition">
            <h3 class="font-bold text-lg text-[#1F2D4B]">{w.title}</h3>
            <p class="text-sm text-gray-500 mt-2 mb-4">{w.description}</p>
            <div class="flex justify-between text-xs text-gray-400 border-t pt-4">
              <span>📍 {w.location}</span><span>📅 {new Date(w.date).toLocaleDateString()}</span>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </main>
</div>