<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let workshop; // The data passed from Marketplace

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  function join() {
    dispatch('join', workshop.id);
  }

  // Helper to format date nicely (e.g., "Thursday, Jan 15")
  function formatDate(dateString: string) {
    if (!dateString || dateString === 'TBD') return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }
</script>

<div class="fixed inset-0 bg-black/50 z-40 transition-opacity" on:click={close}></div>

<aside class="fixed inset-0 p-3 sm:p-4 flex justify-end z-50 pointer-events-none">
  <div class="pointer-events-auto h-full w-full sm:w-[92%] md:w-[38%] lg:w-[44%] max-w-[720px] rounded-[20px] bg-white border border-[#E9ECF5] shadow-[0_12px_40px_rgba(17,24,39,0.12)] overflow-hidden flex flex-col font-sans">
    
    <div class="px-5 sm:px-6 py-4 flex items-center gap-4 border-b border-[#EEF1F7]">
      <div class="h-9 w-9 rounded-xl bg-[#F3F5FF] flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-[#111827]">
          <path d="M12 3 2 8l10 5 10-5-10-5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M2 16l10 5 10-5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>
      </div>

      <div class="flex-1 flex items-center gap-2 min-w-0">
        <span class="text-[#6B7280] whitespace-nowrap">Workshop Details</span>
        <span class="text-[#D1D5DB]">/</span>
        <span class="font-semibold text-[#111827] whitespace-nowrap">{formatDate(workshop.date)}</span>
      </div>

      <button on:click={close} class="h-9 w-9 rounded-full border border-[#EEF1F7] flex items-center justify-center hover:bg-gray-50 transition">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6 6 18" stroke="#111827" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <div class="px-5 sm:px-6 py-5 border-b border-[#EEF1F7]">
      <div class="flex items-center gap-5">
        <div class="h-20 w-20 rounded-2xl bg-[#E7E9FF] flex items-center justify-center shrink-0">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path d="M12 2 20 5.5V12c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V5.5L12 2Z" stroke="#2F62E9" stroke-width="1.8" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="flex-1 min-w-0">
          <div class="text-[22px] sm:text-[24px] font-semibold text-[#111827] leading-tight truncate">
            {workshop.title}
          </div>

          <div class="mt-2 flex flex-col gap-2 text-[#6B7280]">
            <div class="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                 <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" stroke="#6B7280" stroke-width="1.6"/>
                 <path d="M2 12h20" stroke="#6B7280" stroke-width="1.6"/>
                 <path d="M12 2c3 3 3 17 0 20" stroke="#6B7280" stroke-width="1.6"/>
              </svg>
              <span>{workshop.language || 'English'}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4">
           <button on:click={join} class="h-11 px-6 rounded-xl bg-[#1F2D4B] text-white font-semibold shadow-sm hover:opacity-90 transition whitespace-nowrap">
            Sign Up
          </button>
        </div>
      </div>
    </div>

    <div class="px-5 sm:px-6 pt-5 pb-3 overflow-y-auto">
      <div class="grid grid-cols-[56px_1fr] gap-x-4 gap-y-6">

        <div class="flex items-start justify-center pt-1 text-[#6B7280]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" stroke="#6B7280" stroke-width="1.6" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="flex items-start gap-4">
          <span class="w-[90px] text-[#9CA3AF] shrink-0">Topic</span>
          <div class="flex flex-wrap gap-3">
            <span class="px-3 py-2 rounded-lg bg-[#E8EEFF] text-[#2F62E9] font-semibold text-[14px]">
              {workshop.topic}
            </span>
          </div>
        </div>

        <div class="flex items-start justify-center pt-1 text-[#6B7280]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" stroke="#6B7280" stroke-width="1.6"/>
            <path d="M12 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="#6B7280" stroke-width="1.6"/>
          </svg>
        </div>
        <div class="flex items-center gap-4">
          <span class="w-[90px] text-[#9CA3AF] shrink-0">Room</span>
          <span class="text-[#111827] text-[18px] font-medium">{workshop.room || 'Online'}</span>
        </div>

        <div class="flex items-start justify-center pt-1 text-[#6B7280]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M8 3v2M16 3v2" stroke="#6B7280" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M3 9h18" stroke="#6B7280" stroke-width="1.6"/>
            <path d="M5 5h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="#6B7280" stroke-width="1.6"/>
          </svg>
        </div>
        <div class="flex items-center gap-4">
          <span class="w-[90px] text-[#9CA3AF] shrink-0">Date</span>
          <span class="text-[#111827] text-[18px] font-medium">{workshop.date}</span>
        </div>

        <div class="flex items-start justify-center pt-1 text-[#6B7280]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" stroke="#6B7280" stroke-width="1.6"/>
            <path d="M12 7v5" stroke="#6B7280" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M12 12h4" stroke="#6B7280" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="flex items-center gap-4">
          <span class="w-[90px] text-[#9CA3AF] shrink-0">Duration</span>
          <span class="text-[#111827] text-[18px] font-medium">{workshop.duration} min</span>
        </div>

        <div class="flex items-start justify-center pt-1 text-[#6B7280]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M8 6h13M8 12h13M8 18h13" stroke="#6B7280" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M3 6h.01M3 12h.01M3 18h.01" stroke="#6B7280" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="flex items-start gap-4">
          <span class="w-[90px] text-[#9CA3AF] shrink-0">Description</span>
          <span class="text-[#111827] leading-relaxed">
            {workshop.description}
          </span>
        </div>

      </div>
    </div>

    <div class="mt-auto flex items-center justify-center pb-8 opacity-50">
       <div class="px-5 sm:px-6 py-5 flex items-center gap-3 text-[#9CA3AF]">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M7 12a5 5 0 0 1 10 0v1a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-1Z" stroke="#9CA3AF" stroke-width="1.6"/>
            <path d="M12 17v3" stroke="#9CA3AF" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M8 21h8" stroke="#9CA3AF" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M4 7c0 3 2 5 5 5" stroke="#9CA3AF" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M20 7c0 3-2 5-5 5" stroke="#9CA3AF" stroke-width="1.6" stroke-linecap="round"/>
         </svg>
         <span class="text-[18px] sm:text-[20px] font-medium">Standalone Workshop</span>
       </div>
    </div>

  </div>
</aside>