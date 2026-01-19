<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let workshop; 

  const dispatch = createEventDispatcher();
  let isJoined = false; // You can check this against the user's ID in a real app

  function close() {
    dispatch('close');
  }

  async function handleJoin() {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/api/workshops/${workshop.id}/join`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      isJoined = true;
      alert("Successfully signed up!");
      dispatch('refresh'); // Tell parent to reload list
    } else {
      alert("Failed to join.");
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }
</script>

<div class="fixed inset-0 bg-black/50 z-40 transition-opacity" on:click={close}></div>

<aside class="fixed inset-0 p-3 sm:p-4 flex justify-end z-50 pointer-events-none font-sans">
  <div class="pointer-events-auto h-full w-full sm:w-[92%] md:w-[38%] lg:w-[44%] max-w-[720px] rounded-[20px] bg-white border border-[#E9ECF5] shadow-[0_12px_40px_rgba(17,24,39,0.12)] overflow-hidden flex flex-col">
    
    <div class="px-5 sm:px-6 py-4 flex items-center gap-4 border-b border-[#EEF1F7]">
      <div class="h-9 w-9 rounded-xl bg-[#F3F5FF] flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-[#111827]">
          <path d="M12 3 2 8l10 5 10-5-10-5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>
      </div>

      <div class="flex-1 flex items-center gap-2 min-w-0">
        <span class="text-[#6B7280]">Workshop Details</span>
        <span class="text-[#D1D5DB]">/</span>
        <span class="font-semibold text-[#111827]">{formatDate(workshop.date)}</span>
      </div>

      <div class="flex items-center gap-2 text-[#111827] font-semibold text-sm">
         <span class="h-2 w-2 rounded-full bg-green-500"></span>
         Public
      </div>

      <button on:click={close} class="h-9 w-9 rounded-full border border-[#EEF1F7] flex items-center justify-center hover:bg-gray-50 transition">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
      </button>
    </div>

    <div class="px-5 sm:px-6 py-5 border-b border-[#EEF1F7]">
      <div class="flex items-center gap-5">
        <div class="h-20 w-20 rounded-2xl bg-[#E7E9FF] flex items-center justify-center shrink-0">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2F62E9" stroke-width="1.5">
             <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>

        <div class="flex-1 min-w-0">
          <div class="text-[22px] font-semibold text-[#111827] leading-tight mb-2">{workshop.title}</div>
          <div class="flex flex-col gap-1 text-sm text-[#6B7280]">
            <div class="flex items-center gap-2">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
               {workshop.teacherName || 'Instructor'}
            </div>
            <div class="flex items-center gap-2">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
               {workshop.language || 'English'}
            </div>
          </div>
        </div>

        <button 
          on:click={handleJoin}
          disabled={isJoined}
          class="hidden sm:flex h-11 px-6 rounded-xl {isJoined ? 'bg-gray-100 text-gray-400' : 'bg-[#1F2D4B] text-white hover:bg-[#2a3c5e]'} font-semibold shadow-sm items-center justify-center transition">
          {isJoined ? 'Joined' : 'Sign Up'}
        </button>
      </div>
    </div>

    <div class="px-5 sm:px-6 pt-3 border-b border-[#EEF1F7]">
       <div class="flex gap-8">
          <button class="pb-4 border-b-2 border-[#1F2D4B] font-semibold text-[#111827] flex items-center gap-2">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
             General
          </button>
          </div>
    </div>

    <div class="flex-1 overflow-y-auto px-5 sm:px-6 py-6">
       <div class="grid grid-cols-[100px_1fr] gap-y-8 text-[16px]">
          
          <div class="text-gray-400 flex gap-2 items-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> Topic</div>
          <div><span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-bold">{workshop.topic}</span></div>

          <div class="text-gray-400 flex gap-2 items-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Room</div>
          <div class="font-medium">{workshop.room || 'Online'}</div>

          <div class="text-gray-400 flex gap-2 items-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Date</div>
          <div class="font-medium">{workshop.date}</div>

          <div class="text-gray-400 flex gap-2 items-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Time</div>
          <div class="font-medium">{workshop.time}</div>

          <div class="text-gray-400 flex gap-2 items-start pt-1"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Desc</div>
          <div class="text-gray-600 leading-relaxed">
             {workshop.description}
          </div>
       </div>
    </div>

    <div class="sm:hidden p-4 border-t border-gray-100">
        <button 
          on:click={handleJoin}
          disabled={isJoined}
          class="w-full h-12 rounded-xl {isJoined ? 'bg-gray-100 text-gray-400' : 'bg-[#1F2D4B] text-white'} font-bold shadow-lg">
          {isJoined ? 'Joined' : 'Sign Up'}
        </button>
    </div>

  </div>
</aside>