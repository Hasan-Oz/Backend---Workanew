<script>
  import { onMount } from 'svelte';

  // --- STATE ---
  let weekData = $state([]); 
  let isLoading = $state(true);
  let errorMsg = $state(""); 
  let selectedWorkshop = $state(null); 

  // --- NAVIGATION ---
  function navigate(path) {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  // --- HELPERS ---
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

  function getFullDateString(dateStr) {
    if (!dateStr) return 'Monday, Jan 19';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }

  function getTimeString(dateStr) {
    if (!dateStr) return '00:00';
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  // --- LOAD DATA ---
  async function loadData() {
    const currentWeekDates = getCurrentWeekDays();
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const token = localStorage.getItem('token'); 

    if (!token) { navigate('/login'); return; }
    
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

{#if selectedWorkshop}
  <div 
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-end p-6"
    onclick={() => selectedWorkshop = null}
  >
    <div 
      class="bg-white w-full max-w-[600px] h-full max-h-[95vh] shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col rounded-[40px] overflow-hidden"
      onclick={(e) => e.stopPropagation()} 
    >
      
      <div class="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
        <div class="flex items-center gap-2 text-xs font-bold text-gray-400">
          <div class="w-5 h-5 opacity-40"><img src="/assets/images/logo.svg" /></div>
          <span>Week Jan 12 - 16</span>
          <span class="text-gray-300">/</span>
          <span class="text-black">{getFullDateString(selectedWorkshop.date)}</span>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold text-gray-400 flex items-center gap-1">
             <div class="w-1.5 h-1.5 rounded-full border border-gray-400"></div> Public
          </div>
          <button 
             onclick={() => selectedWorkshop = null}
             class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          >
             <img src="/assets/images/close.svg" class="w-4 h-4 opacity-40" />
          </button>
        </div>
      </div>

      <div class="p-8 overflow-y-auto flex-1">
        
        <div class="flex justify-between items-start mb-10">
           <div class="flex gap-6">
              <div class="w-20 h-20 bg-[#EEF2FF] rounded-[24px] flex items-center justify-center text-[#4F46E5] shrink-0">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                 </svg>
              </div>
              <div class="pt-1">
                 <h2 class="text-3xl font-bold text-[#111111] mb-2 leading-tight">{selectedWorkshop.title || 'Workshop Title'}</h2>
                 <div class="flex flex-col gap-1 text-xs text-gray-500 font-medium">
                    <div class="flex items-center gap-2"><span class="opacity-50">👤</span> Unknown Instructor</div>
                    <div class="flex items-center gap-2"><span class="opacity-50">🌐</span> {selectedWorkshop.language || 'English'}</div>
                 </div>
              </div>
           </div>
           
           <button class="bg-[#1F2D4B] text-white px-8 py-3 rounded-[12px] font-bold text-sm shadow-lg shadow-blue-900/10 hover:bg-[#2a3c5e] transition shrink-0">
              Sign Up
           </button>
        </div>

        <div class="flex gap-8 border-b border-gray-100 mb-8">
           <button class="pb-3 border-b-2 border-[#1F2D4B] text-[#1F2D4B] font-bold text-sm">General</button>
           <button class="pb-3 border-b-2 border-transparent text-gray-400 font-bold text-sm hover:text-gray-600 transition">Participants</button>
           <button class="pb-3 border-b-2 border-transparent text-gray-400 font-bold text-sm hover:text-gray-600 transition">History</button>
        </div>

        <div class="space-y-6">
           <div class="grid grid-cols-[100px_1fr] items-center">
              <div class="flex items-center gap-2 text-sm text-gray-400"><span class="opacity-50">📄</span> Topic</div>
              <div><span class="bg-[#EEF2FF] text-[#4F46E5] text-xs font-bold px-3 py-1 rounded-full">{selectedWorkshop.topic || 'General'}</span></div>
           </div>
           
           <div class="grid grid-cols-[100px_1fr] items-center">
              <div class="flex items-center gap-2 text-sm text-gray-400"><span class="opacity-50">📍</span> Room</div>
              <div class="text-sm font-bold text-[#111111]">{selectedWorkshop.room || 'TBD'}</div>
           </div>

           <div class="grid grid-cols-[100px_1fr] items-center">
              <div class="flex items-center gap-2 text-sm text-gray-400"><span class="opacity-50">📅</span> Date</div>
              <div class="text-sm font-bold text-[#111111]">{selectedWorkshop.date || 'Upcoming'}</div>
           </div>

           <div class="grid grid-cols-[100px_1fr] items-center">
              <div class="flex items-center gap-2 text-sm text-gray-400"><span class="opacity-50">🕒</span> Time</div>
              <div class="text-sm font-bold text-[#111111]">{getTimeString(selectedWorkshop.date)}</div>
           </div>

           <div class="grid grid-cols-[100px_1fr] items-start pt-1">
              <div class="flex items-center gap-2 text-sm text-gray-400"><span class="opacity-50">📝</span> Desc</div>
              <div class="text-sm text-[#111111] leading-relaxed">{selectedWorkshop.description || 'No description provided.'}</div>
           </div>
        </div>

      </div>
    </div>
  </div>
{/if}

<div class="flex min-h-screen bg-[#F6F6F6] font-sans relative z-0">

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

  <main class="flex-1 p-8 overflow-y-auto">
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
</div>