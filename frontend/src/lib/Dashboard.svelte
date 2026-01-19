<script lang="ts">
  import { onMount } from 'svelte';
  import TeacherWorkshops from './TeacherWorkshops.svelte';
  import StudentDashboard from './StudentDashboard.svelte';
  
  let userRole = localStorage.getItem("role") || "student";
  let token = localStorage.getItem("token");

  // Navigation Helper
  function navigate(path: string) {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  function logout() {
    localStorage.clear();
    window.location.href = "/login";
  }
</script>

<div class="min-h-screen bg-[#F6F6F6] flex font-sans">
  
  <aside class="w-64 bg-[#1F2D4B] text-white flex flex-col fixed h-full z-20">
    <div class="p-6 text-xl font-bold flex items-center gap-2">
      <div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      </div>
      Workshop Forge
    </div>

    <nav class="flex-1 px-4 py-6 space-y-2">
      <button on:click={() => navigate('/dashboard')} class="w-full text-left px-4 py-3 bg-white/10 rounded-xl font-medium flex items-center gap-3 transition">
         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
         Overview
      </button>

      <button on:click={() => navigate('/workshops')} class="w-full text-left px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition flex items-center gap-3">
         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
         Workshops
      </button>
    </nav>

    <div class="p-4 border-t border-white/10">
      <button on:click={logout} class="flex items-center gap-3 text-gray-400 hover:text-red-400 transition w-full px-4 py-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Sign Out
      </button>
    </div>
  </aside>

  <main class="flex-1 p-8 ml-64 overflow-y-auto">
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Welcome Back!</h1>
        <p class="text-gray-500">Here is what is happening today.</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold capitalize">{userRole}</div>
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed={userRole}" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-white shadow" />
      </div>
    </header>

    {#if userRole === 'teacher'}
      <TeacherWorkshops />
    {:else}
      <StudentDashboard />
    {/if}
  </main>
</div>