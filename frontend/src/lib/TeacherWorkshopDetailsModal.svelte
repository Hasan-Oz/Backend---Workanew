<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  export let workshop; 

  const dispatch = createEventDispatcher();
  let activeTab = 'general'; // 'general', 'participants', 'history'
  
  // Data State
  let participants = [];
  let historyLogs = [];
  let isLoading = false;

  function close() { dispatch('close'); }

  // Handle Edit Click
  function handleEdit() {
    const dataToEdit = {
      id: workshop.id,
      title: workshop.title,
      topic: workshop.topic,
      location: workshop.room,
      date: workshop.date,
      time: workshop.time,
      duration: workshop.duration || 60,
      language: workshop.language,
      status: 'public',
      description: workshop.description,
      teacherName: workshop.teacherName
    };
    localStorage.setItem("draftWorkshop", JSON.stringify(dataToEdit));
    window.location.href = '/create-workshop'; 
  }

  // Fetch Data when Tab Changes
  async function loadTabData(tab) {
    activeTab = tab;
    if (tab === 'general') return;

    isLoading = true;
    const token = localStorage.getItem("token");
    try {
      // 1. Fetch Participants
      if (tab === 'participants') {
        // Mocking the call - replace with: fetch(`.../api/workshops/${workshop.id}/participants`)
        // For now, we simulate the list
        await new Promise(r => setTimeout(r, 300)); // Fake delay
        participants = [
          { name: "Avetyan, Rafayel", bg: "bg-[#1F2D4B]", text: "text-white" },
          { name: "Bakx, René", bg: "bg-[#1F2D4B]", text: "text-white" },
          { name: "Berkvens, Stijn", bg: "bg-[#EEF1F7]", text: "text-gray-500" },
          { name: "Boom, Robin", bg: "bg-[#EEF1F7]", text: "text-gray-500" },
          { name: "Borzyszkowski, Patryk", bg: "bg-[#EEF1F7]", text: "text-gray-500" },
          { name: "Bosgoed, Jasper", bg: "bg-[#EEF1F7]", text: "text-gray-500" },
          { name: "Daoud, Salmaan", bg: "bg-[#EEF1F7]", text: "text-gray-500" },
          { name: "Derkaoui, Aymane", bg: "bg-[#EEF1F7]", text: "text-gray-500" }
        ];
      }

      // 2. Fetch History
      if (tab === 'history') {
         historyLogs = [
           { time: "Jan 12, 13:38", text: "Does, Darian verified their attendance", bold: "Does, Darian" },
           { time: "Jan 12, 13:37", text: "Does, Darian verified their attendance", bold: "Does, Darian" },
           { time: "Jan 12, 13:36", text: "Daoud, Salmaan verified their attendance", bold: "Daoud, Salmaan" },
           { time: "Jan 12, 13:35", text: "Hoppenbrouwers, Ruben verified attendance", bold: "Hoppenbrouwers, Ruben" },
           { time: "Jan 11, 12:32", text: "Does, Darian signed up", bold: "Does, Darian" },
           { time: "Jan 10, 06:40", text: "Workshop created", bold: "Workshop created" }
         ];
      }
    } catch (e) { console.error(e); }
    finally { isLoading = false; }
  }

  function formatDate(dateString) {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }
</script>

<div class="fixed inset-0 bg-black/50 z-40 transition-opacity" on:click={close}></div>

<aside class="fixed inset-0 p-3 sm:p-4 flex justify-end z-50 pointer-events-none font-sans">
  <div class="pointer-events-auto h-full w-full sm:w-[92%] md:w-[38%] lg:w-[44%] max-w-[720px] rounded-[20px] bg-white border border-[#E9ECF5] shadow-[0_12px_40px_rgba(17,24,39,0.12)] overflow-hidden flex flex-col">
    
    <div class="px-5 sm:px-6 py-4 flex items-center gap-4 border-b border-[#EEF1F7]">
      <div class="h-9 w-9 rounded-xl bg-[#F3F5FF] flex items-center justify-center text-[#111827]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      </div>

      <div class="flex-1 flex items-center gap-2 min-w-0">
        <span class="text-gray-400">Week Jan 12 - 16</span>
        <span class="text-gray-300">/</span>
        <span class="font-semibold text-[#111827]">{formatDate(workshop.date)}</span>
      </div>

      <div class="flex items-center gap-2 text-[#111827] font-semibold text-sm">
         <span class="h-6 w-6 rounded-full border border-gray-200 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></span>
         Public
      </div>

      <button on:click={close} class="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
      </button>
    </div>

    <div class="px-5 sm:px-6 py-5 border-b border-[#EEF1F7]">
      <div class="flex items-center gap-5">
        <div class="h-20 w-20 rounded-2xl bg-[#E7E9FF] flex items-center justify-center shrink-0">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2F62E9" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-2xl font-semibold text-[#111827] leading-tight mb-2">{workshop.title}</div>
          <div class="flex flex-col gap-1 text-sm text-gray-500">
            <div class="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> {workshop.teacherName || 'Unknown'}</div>
            <div class="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg> {workshop.language || 'English'}</div>
          </div>
        </div>
        <button on:click={handleEdit} class="hidden sm:flex h-10 px-6 rounded-xl bg-[#1F2D4B] text-white font-semibold shadow-sm items-center hover:opacity-90">Edit</button>
      </div>
    </div>

    <div class="px-5 sm:px-6 pt-3 border-b border-[#EEF1F7]">
       <div class="flex justify-between max-w-md">
          <button on:click={() => loadTabData('general')} class="pb-4 border-b-2 {activeTab === 'general' ? 'border-[#1F2D4B] text-[#111827]' : 'border-transparent text-gray-400'} font-semibold flex items-center gap-2 px-4 transition-colors">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> General
          </button>
          <button on:click={() => loadTabData('participants')} class="pb-4 border-b-2 {activeTab === 'participants' ? 'border-[#1F2D4B] text-[#111827]' : 'border-transparent text-gray-400'} font-semibold flex items-center gap-2 px-4 transition-colors">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Participants
          </button>
          <button on:click={() => loadTabData('history')} class="pb-4 border-b-2 {activeTab === 'history' ? 'border-[#1F2D4B] text-[#111827]' : 'border-transparent text-gray-400'} font-semibold flex items-center gap-2 px-4 transition-colors">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> History
          </button>
       </div>
    </div>

    <div class="flex-1 overflow-y-auto bg-white">
      
      {#if activeTab === 'general'}
        <div class="px-5 sm:px-6 py-6 grid grid-cols-[100px_1fr] gap-y-8 text-[16px]">
          <div class="text-gray-400 flex gap-2 items-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> Topic</div>
          <div><span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-bold">{workshop.topic}</span></div>

          <div class="text-gray-400 flex gap-2 items-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Room</div>
          <div class="font-medium text-[#111827]">{workshop.room || 'Online'}</div>

          <div class="text-gray-400 flex gap-2 items-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Date</div>
          <div class="font-medium text-[#111827]">{workshop.date}</div>

          <div class="text-gray-400 flex gap-2 items-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Time</div>
          <div class="font-medium text-[#111827]">{workshop.time}</div>

          <div class="text-gray-400 flex gap-2 items-start pt-1"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Desc</div>
          <div class="text-gray-600 leading-relaxed">{workshop.description}</div>
        </div>
      {/if}

      {#if activeTab === 'participants'}
         <div class="px-5 sm:px-6 py-6">
            <div class="flex items-center gap-4 mb-8">
               <div class="flex-1 relative">
                  <input type="text" placeholder="Search" class="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm" />
                  <svg class="absolute left-3 top-3.5 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
               </div>
               <div class="flex items-center gap-2">
                  <button class="h-12 w-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
                  <span class="font-bold w-4 text-center">1</span>
                  <button class="h-12 w-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>
               </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
               {#each participants as p}
                 <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-full {p.bg} flex items-center justify-center {p.text}">
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <span class="font-medium text-[#111827]">{p.name}</span>
                 </div>
               {/each}
            </div>
         </div>
      {/if}

      {#if activeTab === 'history'}
         <div class="px-5 sm:px-6 py-6">
            <div class="flex items-center gap-4 mb-8">
               <div class="flex-1 relative">
                  <input type="text" placeholder="Search" class="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm" />
                  <svg class="absolute left-3 top-3.5 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
               </div>
               <div class="flex items-center gap-2">
                  <button class="h-12 w-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
                  <span class="font-bold w-4 text-center">1</span>
                  <button class="h-12 w-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>
               </div>
            </div>

            <div class="flex flex-col gap-6">
               {#each historyLogs as log}
                 <div class="flex gap-4 items-baseline">
                    <span class="text-xs text-gray-400 w-24 shrink-0 text-right">{log.time}</span>
                    <span class="text-sm text-gray-700">
                       <span class="font-bold">{log.bold}</span> {log.text.replace(log.bold, '')}
                    </span>
                 </div>
               {/each}
            </div>
         </div>
      {/if}

    </div>
  </div>
</aside>