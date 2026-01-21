<script lang="ts">
  import { onMount } from 'svelte';
  import TeacherWorkshops from './TeacherWorkshops.svelte';
  import StudentDashboard from './StudentDashboard.svelte';
  
  let userRole = localStorage.getItem("role") || "student";
  let token = localStorage.getItem("token");

  
  // Navigation Helper
  function navigate(path) {
    window.history.pushState({}, "", path);
    // This line forces App.svelte to notice the change and switch pages
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  function logout() {
    localStorage.clear();
    window.location.href = "/login";
  }
</script>

<div class="min-h-screen bg-[#F6F6F6] flex font-sans">
  
  <aside class="w-[86px] shrink-0 bg-white h-screen sticky top-0 flex flex-col items-center py-10 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
    
    <div class="w-10 h-10 mb-14 cursor-pointer hover:opacity-80 transition" onclick={() => navigate('/dashboard')}>
      <img src="/assets/images/logo.svg" alt="Logo" class="w-full h-full object-contain" />
    </div>

    <nav class="flex flex-col gap-10 w-full items-center">
      
      <div class="group cursor-pointer relative w-full flex justify-center" onclick={() => navigate('/dashboard')}>
        <div class="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#1F2D4B] rounded-r-full"></div>
        
        <div class="p-2 rounded-xl transition group-hover:bg-gray-50">
          <img src="/assets/images/Dashboard.svg" alt="Dashboard" class="w-6 h-6 opacity-100" />
        </div>
      </div>
      
      <div class="group cursor-pointer relative w-full flex justify-center" onclick={() => navigate('/workshops')}>
        <div class="p-2 rounded-xl transition group-hover:bg-gray-50">
          <img src="/assets/images/workshopoverview.svg" alt="Workshops" class="w-6 h-6 opacity-40 group-hover:opacity-100 transition" />
        </div>
      </div>

      <div class="group cursor-pointer relative w-full flex justify-center" onclick={() => navigate('/suggestions')}>
        <div class="p-2 rounded-xl transition group-hover:bg-gray-50">
          <img src="/assets/images/studentsuggestions.svg" alt="Suggestions" class="w-6 h-6 opacity-40 group-hover:opacity-100 transition" />
        </div>
      </div>

    </nav>

    <div class="mt-auto flex flex-col gap-8 items-center w-full pb-4">
      
      <div class="cursor-pointer p-2 rounded-xl hover:bg-red-50 group transition" onclick={() => navigate('/login')}>
        <img src="/assets/images/logout.svg" alt="Logout" class="w-6 h-6 opacity-40 group-hover:opacity-100 transition" />
      </div>

      <div class="h-10 w-10 rounded-full bg-[#1F2D4B] flex items-center justify-center text-white font-bold text-xs border-2 border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition">
        <span>US</span>
      </div>

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