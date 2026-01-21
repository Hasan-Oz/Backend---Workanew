<script>
  import { onMount } from 'svelte';
  // 1. IMPORT THE MODAL (Make sure this file exists in your lib folder)
  import StudentWorkshopDetailsModal from './StudentWorkshopDetailsModal.svelte';

  // --- STATE ---
  let weekData = $state([]); 
  let isLoading = $state(true);
  let errorMsg = $state(""); 
  
  // 2. MODAL STATE
  let selectedWorkshop = $state(null); // Holds the data of the workshop you clicked

  // --- NAVIGATION ---
  function navigate(path) {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  // --- HELPER: Get Dates ---
  function getCurrentWeekDays() {
    const curr = new Date(); 
    const week = [];
    const first = curr.getDate() - curr.getDay() + 1; 
    for (let i = 0; i < 5; i++) {
      let day = new Date(curr.setDate(first + i));
      week.push(day);
    }
    return week; 
  }

  function formatDate(dateObj) {
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // --- LOAD DATA ---
  async function loadData() {
    const currentWeekDates = getCurrentWeekDays();
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const token = localStorage.getItem('token'); 

    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const res = await fetch('http://localhost:3000/api/workshops', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      const allWorkshops = await res.json();
      
      weekData = currentWeekDates.map((dateObj, index) => {
        const todaysWorkshops = allWorkshops.filter(w => {
          const wDate = new Date(w.date || w.start_time || w.createdAt); 
          return wDate.getDate() === dateObj.getDate() &&
                 wDate.getMonth() === dateObj.getMonth() &&
                 wDate.getFullYear() === dateObj.getFullYear();
        });

        return {
          name: dayNames[index],
          date: formatDate(dateObj),
          workshops: todaysWorkshops
        };
      });

    } catch (e) {
      console.error("Fetch Error:", e);
      errorMsg = "Connection failed.";
    } finally {
      isLoading = false;
    }
  }

  onMount(loadData);
</script>

<div class="flex min-h-screen bg-[#F6F6F6] font-sans relative">

  <aside class="w-[86px] shrink-0 bg-white h-screen sticky top-0 flex flex-col items-center py-10 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
    <div class="w-10 h-10 mb-14 cursor-pointer hover:opacity-80 transition" onclick={() => navigate('/dashboard')}>
      <img src="/assets/images/logo.svg" alt="Logo" class="w-full h-full object-contain" />
    </div>
    <nav class="flex flex-col gap-10 w-full items-center">
      <div class="group cursor-pointer relative w-full flex justify-center" onclick={() => navigate('/dashboard')}>
        <div class="p-2 rounded-xl transition group-hover:bg-gray-50">
          <img src="/assets/images/Dashboard.svg" alt="Dashboard" class="w-6 h-6 opacity-40 group-hover:opacity-100 transition" />
        </div>
      </div>
      <div class="group cursor-pointer relative w-full flex justify-center" onclick={() => navigate('/workshops')}>
        <div class="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#1F2D4B] rounded-r-full"></div>
        <div class="p-2 rounded-xl transition group-hover:bg-gray-50">
          <img src="/assets/images/workshopoverview.svg" alt="Workshops" class="w-6 h-6 opacity-100" />
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

  <main class="flex-1 p-8 overflow-y-auto z-0">
    <header class="flex justify-between items-center mb-10">
      <div class="bg-white px-8 py-5 rounded-[24px] shadow-sm">
        <h1 class="text-[20px] font-bold text-[#111111]">Workshop Overview <span class="text-gray-300 font-normal ml-2">• make the most of your day</span></h1>
      </div>
      <div class="flex gap-4">
        <div class="relative bg-white rounded-[24px] shadow-sm group focus-within:ring-2 ring-[#B8B9E8]/20 transition">
          <input type="text" placeholder="Search" class="pl-12 pr-6 py-4 w-[280px] rounded-[24px] outline-none text-sm placeholder:text-gray-300" />
          <img src="/assets/images/search.svg" alt="Search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30" />
        </div>
        <button class="bg-white px-8 py-4 rounded-[24px] shadow-sm font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition text-[#1F2D4B]">
          <img src="/assets/images/filter.svg" alt="Filter" class="w-4 h-4" /> Filter
        </button>
      </div>
    </header>

    {#if isLoading}
      <div class="text-center py-20 text-gray-400">Loading schedule...</div>
    {:else if errorMsg}
      <div class="p-6 bg-red-50 text-red-500 rounded-xl border border-red-100 text-center">{errorMsg}</div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {#each weekData as day}
          <div class="space-y-6">
            <div class="bg-white/60 p-5 rounded-[24px] flex justify-between items-center border border-white backdrop-blur-sm">
              <div class="flex items-center gap-2">
                 <span class="font-bold text-sm text-[#111111]">{day.name}</span>
                 {#if day.workshops.length > 0}
                    <span class="bg-[#1F2D4B] text-white text-[10px] px-2 py-0.5 rounded font-bold">{day.workshops.length}</span>
                 {:else}
                    <span class="bg-gray-200 text-gray-500 text-[10px] px-2 py-0.5 rounded font-bold">0</span>
                 {/if}
              </div>
              <span class="text-[10px] text-gray-400 font-medium">{day.date}</span>
            </div>

            {#if day.workshops.length > 0}
              {#each day.workshops as w}
                <div 
                  class="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50 group hover:shadow-lg hover:-translate-y-1 transition duration-300 cursor-pointer"
                  onclick={() => selectedWorkshop = w} 
                >
                   <div class="flex justify-between mb-4">
                      <div class="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        <img src="/assets/images/logo.svg" alt="Icon" class="w-3 h-3 opacity-30" /> 
                        {w.topic || w.category || 'Workshop'}
                      </div>
                      <div class="text-[10px] text-gray-300">⟷</div>
                   </div>
                   
                   <h3 class="font-bold text-[14px] text-[#111111] mb-4">{w.title || w.name || 'Untitled'}</h3>
                   <p class="text-[10px] text-gray-400 leading-relaxed mb-6 line-clamp-3">
                     {w.description || 'No description provided.'}
                   </p>
                   
                   <div class="flex flex-wrap gap-3 text-[9px] text-gray-400 font-bold border-t border-gray-50 pt-4">
                     <span class="flex items-center gap-1">🌐 {w.language || 'EN'}</span>
                     <span class="flex items-center gap-1">📍 {w.room || 'TBD'}</span>
                     <span class="flex items-center gap-1">🕒 {w.duration || '30'} min</span>
                   </div>
                </div>
              {/each}
            {:else}
              <div class="bg-white/40 border border-dashed border-gray-200 rounded-[24px] h-32 flex flex-col items-center justify-center gap-2 opacity-60">
                 <div class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-400">🕒</div>
                 <p class="text-[10px] text-gray-400">No workshops</p>
              </div>
            {/if}
          </div>
        {/each}

      </div>
    {/if}
  </main>

  {#if selectedWorkshop}
    <StudentWorkshopDetailsModal 
       workshop={selectedWorkshop} 
       onClose={() => selectedWorkshop = null} 
    />
  {/if}

</div>