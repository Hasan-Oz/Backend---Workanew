<script lang="ts">
  import { onMount } from 'svelte';
  import StudentWorkshopDetailsModal from './StudentWorkshopDetailsModal.svelte';
  import TeacherWorkshopDetailsModal from './TeacherWorkshopDetailsModal.svelte';

  // --- STATE ---
  let userRole = localStorage.getItem("role") || "student";
  let isMobileMenuOpen = false;
  let selectedWorkshop = null;
  
  // Initialize weeks with empty structure
  let weekDays = [
    { name: 'Monday', date: '', fullDate: '', workshops: [] },
    { name: 'Tuesday', date: '', fullDate: '', workshops: [] },
    { name: 'Wednesday', date: '', fullDate: '', workshops: [] },
    { name: 'Thursday', date: '', fullDate: '', workshops: [] },
    { name: 'Friday', date: '', fullDate: '', workshops: [] }
  ];

  function navigate(path: string) {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  function logout() {
    localStorage.clear();
    window.location.href = "/login";
  }

  // --- DATE LOGIC ---
  function setCurrentWeekDates() {
    const today = new Date();
    const currentDay = today.getDay(); 
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const mondayDate = new Date(today);
    mondayDate.setDate(today.getDate() - distanceToMonday);

    weekDays = weekDays.map((dayObj, index) => {
      const d = new Date(mondayDate);
      d.setDate(mondayDate.getDate() + index);

      const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      // Construct YYYY-MM-DD manually to avoid timezone shifts
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      
      return { ...dayObj, date: displayDate, fullDate: `${year}-${month}-${day}`, workshops: [] };
    });
  }

  // --- DATA LOADING ---
  onMount(async () => {
    setCurrentWeekDates(); // Set header dates immediately

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/workshops", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        
        // Distribute workshops to correct columns
        data.forEach(w => {
            const workshopDateStr = w.date.split(' ')[0]; 
            const matchingDayIndex = weekDays.findIndex(day => day.fullDate === workshopDateStr);
            if (matchingDayIndex !== -1) {
                weekDays[matchingDayIndex].workshops.push(w);
            }
        });
        weekDays = [...weekDays]; 
      }
    } catch (e) {
      console.error(e);
    }
  });

  function openDetails(w) {
    selectedWorkshop = w;
  }
</script>

<div class="min-h-screen bg-[#F6F6F6] flex font-sans overflow-hidden">
  
  {#if isMobileMenuOpen}
    <div class="fixed inset-0 bg-black/50 z-40 lg:hidden" on:click={() => isMobileMenuOpen = false}></div>
  {/if}

  <aside 
    class="fixed inset-y-0 left-0 z-50 w-64 bg-[#1F2D4B] text-white flex flex-col transition-transform duration-300 lg:translate-x-0 
    {isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}"
  >
    <div class="p-6 text-xl font-bold flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <span>Forge</span>
      </div>
      <button class="lg:hidden text-gray-400 hover:text-white" on:click={() => isMobileMenuOpen = false}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
      </button>
    </div>

    <nav class="flex-1 px-4 py-6 space-y-2">
      <button on:click={() => navigate('/dashboard')} class="w-full text-left px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition flex items-center gap-3">
         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
         Overview
      </button>
      <button on:click={() => navigate('/workshops')} class="w-full text-left px-4 py-3 bg-white/10 text-white rounded-xl font-medium flex items-center gap-3 transition">
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

  <main class="flex-1 lg:ml-64 p-4 sm:p-8 overflow-x-hidden w-full">
    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
      <div class="flex items-center gap-4 w-full md:w-auto">
        <button class="lg:hidden h-10 w-10 bg-white rounded-xl flex items-center justify-center text-gray-500 shadow-sm" on:click={() => isMobileMenuOpen = true}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        <div class="bg-white px-6 py-4 rounded-[20px] shadow-sm font-bold text-lg text-[#111827] flex-1 md:flex-none whitespace-nowrap">
          Workshop Overview 
          <span class="text-gray-400 font-normal ml-2 hidden sm:inline text-sm">• make the most of your day</span>
        </div>
      </div>

      <div class="flex flex-wrap gap-3 w-full md:w-auto">
        <div class="bg-white px-4 py-3 rounded-[16px] flex items-center gap-3 shadow-sm flex-1 md:w-64 text-gray-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span class="text-sm">Search</span>
        </div>
        <button class="bg-white h-12 px-4 rounded-[16px] flex items-center gap-2 shadow-sm hover:bg-gray-50 font-semibold text-[#111827]">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
           Filter
        </button>
        {#if userRole === 'teacher'}
          <button on:click={() => navigate('/create-workshop')} class="bg-[#1F2D4B] h-12 px-6 rounded-[16px] flex items-center gap-2 shadow-lg hover:opacity-90 text-white font-bold transition whitespace-nowrap">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
             New
          </button>
        {/if}
      </div>
    </div>

    <div class="flex gap-6 overflow-x-auto pb-10 scrollbar-hide">
      {#each weekDays as day}
        <div class="min-w-[320px] flex flex-col gap-4">
          
          <div class="bg-[#F3F4F6] px-5 py-4 rounded-[20px] flex justify-between items-center text-[#111827]">
            <div class="flex items-center gap-3">
               <span class="font-bold text-sm">{day.name}</span>
               <span class="bg-[#1F2D4B] text-white text-[11px] font-bold h-5 w-5 flex items-center justify-center rounded-[6px]">{day.workshops.length}</span>
            </div>
            <span class="text-gray-400 text-xs font-medium">{day.date}</span>
          </div>

          {#each day.workshops as w}
            <div on:click={() => openDetails(w)} class="bg-white p-5 rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-transparent hover:border-gray-200 transition cursor-pointer group flex flex-col gap-3">
              
              <div class="flex justify-between items-start">
                 <div class="flex items-center gap-2">
                    <div class="bg-[#F3F4F6] p-1.5 rounded-lg text-gray-500">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{w.topic || 'General'}</span>
                 </div>
                 <button class="text-gray-300 hover:text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                 </button>
              </div>

              <div>
                 <h3 class="font-bold text-[#111827] text-[15px] mb-1 leading-tight group-hover:text-[#2F62E9] transition-colors">{w.title}</h3>
                 <p class="text-gray-400 text-[11px] leading-relaxed line-clamp-2">{w.description}</p>
              </div>

              <div class="flex items-center gap-4 mt-1 pt-3 border-t border-gray-50">
                 <div class="flex items-center gap-1.5 text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    <span class="text-[10px] font-bold">{w.language ? w.language.substring(0,2) : 'EN'}</span>
                 </div>
                 <div class="flex items-center gap-1.5 text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span class="text-[10px] font-bold">{w.room ? w.room.split(' ')[0] : 'Online'}</span>
                 </div>
                 <div class="flex items-center gap-1.5 text-gray-400 ml-auto">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span class="text-[10px] font-bold">{w.time}</span>
                 </div>
              </div>

            </div>
          {/each}

          {#if day.workshops.length === 0}
            <div class="h-32 bg-[#F3F4F6] rounded-[20px] flex flex-col gap-2 items-center justify-center text-gray-400">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12"/></svg>
               <span class="text-[11px] font-medium">No workshops scheduled yet</span>
            </div>
          {/if}
        </div>
      {/each}
    </div>

  </main>

  {#if selectedWorkshop}
    {#if userRole === 'teacher'}
      <TeacherWorkshopDetailsModal workshop={selectedWorkshop} on:close={() => selectedWorkshop = null} />
    {:else}
      <StudentWorkshopDetailsModal workshop={selectedWorkshop} on:close={() => selectedWorkshop = null} />
    {/if}
  {/if}
</div>

<style>
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>