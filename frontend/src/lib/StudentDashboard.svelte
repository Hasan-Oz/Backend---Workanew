<script lang="ts">
  import { onMount } from 'svelte';
  import StudentWorkshopDetailsModal from './StudentWorkshopDetailsModal.svelte';
  
  // 1. Today's Workshops (Top Left)
  let todayWorkshops = [
    { title: "Python functions", time: "01:30 PM", room: "OIL 4.30", lang: "EN", teacher: "Avetyan, Rafayel" },
    { title: "HTML structure basics", time: "01:30 PM", room: "OIL 4.30", lang: "EN", teacher: "Eyck, Anke" },
  ];

  // 2. Suggestions with Voting State (Middle)
  // userVote: 0 = none, 1 = upvoted, -1 = downvoted
  let suggestions = [
    { id: 101, title: "Business plan definition", votes: 31, date: "Jan 6", tags: ["new"], userVote: 0 },
    { id: 102, title: "Unreal Engine Camera", votes: 12, date: "Dec 15", tags: [], userVote: 1 }, // Already upvoted
    { id: 103, title: "Responsive layouts", votes: 5, date: "Dec 8", tags: [], userVote: 0 }
  ];

  // 3. Stats (Top Right)
  const stats = [
    { label: "Software", pct: 42 }, { label: "Security", pct: 25 }, 
    { label: "Media", pct: 17 }, { label: "Infrastructure", pct: 16 }
  ];

  // 4. Notifications (Top Right)
  let notifications = [
    { title: "Any ideas for future workshops?", type: "info", time: "new" },
    { title: "Computational Thinking: Changed time", type: "update", time: "new" },
  ];

  // --- REAL DATA FOR "MY SCHEDULE" ---
  let myWorkshops: any[] = [];
  let selectedWorkshop = null;

  async function fetchMyWorkshops() {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/workshops/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        myWorkshops = await res.json();
      }
    } catch (e) { console.error(e); }
  }

  // --- VOTING LOGIC ---
  function handleVote(id: number, direction: number) {
    const index = suggestions.findIndex(s => s.id === id);
    if (index === -1) return;

    let item = suggestions[index];

    // If clicking same button, toggle off (0). Else switch direction.
    const newVote = item.userVote === direction ? 0 : direction;
    
    // Calculate new total
    item.votes = item.votes - item.userVote + newVote;
    item.userVote = newVote;

    // Trigger reactivity
    suggestions[index] = item; 
  }

  onMount(() => {
    fetchMyWorkshops();
  });
</script>

<div class="space-y-6 font-sans pb-10">
  
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    
    <div class="lg:col-span-4 flex flex-col gap-6">
      <div class="flex items-center justify-between">
         <div class="flex items-center gap-3">
            <h3 class="font-bold text-gray-800 text-lg">Today's workshops</h3>
            <span class="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-md">{todayWorkshops.length}</span>
         </div>
         <button class="text-[#2F62E9] text-sm font-semibold hover:underline">See All</button>
      </div>
      <div class="flex flex-col gap-4">
        {#each todayWorkshops as w}
          <div class="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 group">
            <div class="flex justify-between items-start mb-4">
              <h4 class="font-bold text-[#111111] text-lg">{w.title}</h4>
              <span class="text-xs text-gray-400">30 min</span>
            </div>
            <div class="text-xs text-gray-500 mb-4 space-y-2">
               <div class="flex gap-2 items-center"><span class="font-bold text-[#2F62E9] text-sm">{w.lang}</span> {w.room}</div>
               <div class="flex gap-2 items-center"><span class="text-gray-400">{w.time}</span> • {w.teacher}</div>
            </div>
            <div class="flex gap-3">
               <button class="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">View Details</button>
               <button class="flex-1 py-2 bg-[#1F2D4B] text-white rounded-lg text-xs font-semibold">Sign up</button>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="lg:col-span-4 flex flex-col gap-6">
      <div class="flex items-center justify-between">
         <div class="flex items-center gap-3">
            <h3 class="font-bold text-gray-800 text-lg">Student suggestions</h3>
            <span class="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-md">{suggestions.length}</span>
         </div>
         <button class="text-[#2F62E9] text-sm font-semibold hover:underline">See All</button>
      </div>

      <div class="flex flex-col gap-4 relative">
        <div class="absolute left-[30px] top-4 bottom-4 w-px border-l-2 border-dashed border-gray-200 z-0"></div>

        {#each suggestions as s, i}
          <div class="flex items-start gap-4 z-10">
             
             <div class="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0 mt-1">
               {i + 1}
             </div>

             <div class="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex-1 flex gap-3">
                
                <div class="flex-1">
                   <div class="flex justify-between items-start mb-1">
                      <span class="text-[10px] text-gray-400 font-medium">{s.date}</span>
                      {#if s.tags.length > 0}
                        <span class="bg-blue-50 text-blue-600 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">{s.tags[0]}</span>
                      {/if}
                   </div>
                   <h4 class="font-bold text-[#111111] text-sm leading-tight">{s.title}</h4>
                   <p class="text-[11px] text-gray-400 mt-1 line-clamp-2">Vote on this topic if you want to see it next.</p>
                </div>

                <div class="flex flex-col items-center gap-1">
                   
                   <button 
                     on:click={() => handleVote(s.id, 1)}
                     class="h-7 w-7 rounded-full border flex items-center justify-center transition-all {s.userVote === 1 ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-110' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200 hover:text-blue-500'}">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
                   </button>

                   <span class="font-bold text-sm transition-colors {s.userVote !== 0 ? 'text-[#111827]' : 'text-gray-500'}">
                     {s.votes}
                   </span>

                   <button 
                     on:click={() => handleVote(s.id, -1)}
                     class="h-7 w-7 rounded-full border flex items-center justify-center transition-all {s.userVote === -1 ? 'bg-red-500 border-red-500 text-white shadow-md transform scale-110' : 'bg-white border-gray-100 text-gray-400 hover:border-red-200 hover:text-red-500'}">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                   </button>
                </div>
             </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="lg:col-span-4 flex flex-col gap-6">
      <div class="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
         <h3 class="font-bold text-gray-800 mb-4">Workshop composition</h3>
         <div class="grid grid-cols-2 gap-4">
            {#each stats as stat}
              <div>
                 <div class="text-[10px] text-gray-400">{stat.label}</div>
                 <div class="text-sm font-bold text-[#1F2D4B]">{stat.pct}%</div>
              </div>
            {/each}
         </div>
      </div>
      
      <div class="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex-1">
         <h3 class="font-bold text-gray-800 mb-4">Notifications</h3>
         <div class="flex flex-col gap-3">
            {#each notifications as n}
              <div class="flex gap-3 text-sm">
                 <div class="text-blue-500 font-bold">•</div>
                 <div class="font-semibold text-gray-700">{n.title}</div>
              </div>
            {/each}
         </div>
      </div>
    </div>
  </div>

  <div class="pt-6 border-t border-gray-200">
     <h3 class="font-bold text-gray-800 text-lg mb-6">My Schedule</h3>
     
     {#if myWorkshops.length === 0}
       <div class="bg-white rounded-[20px] p-12 text-center border-2 border-dashed border-gray-200">
         <p class="text-gray-400">You haven't joined any workshops yet.</p>
         <a href="/marketplace" class="text-blue-600 font-semibold mt-2 inline-block hover:underline">Browse Workshops</a>
       </div>
     {:else}
       <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {#each myWorkshops as w}
           <div 
             on:click={() => selectedWorkshop = w}
             class="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group">
             
             <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-bold text-gray-400 uppercase">{w.topic}</span>
                <span class="h-2 w-2 rounded-full bg-green-500"></span>
             </div>
 
             <h3 class="text-lg font-bold text-[#111111] mb-2 group-hover:text-[#2F62E9] transition-colors">{w.title}</h3>
             <p class="text-gray-500 text-sm mb-4 line-clamp-2">{w.description}</p>
             
             <div class="pt-4 border-t border-gray-50 flex items-center gap-4 text-xs text-gray-400 font-medium">
                <span>{w.date}</span>
                <span>•</span>
                <span>{w.room || 'Online'}</span>
             </div>
           </div>
         {/each}
       </div>
     {/if}
  </div>

  {#if selectedWorkshop}
    <StudentWorkshopDetailsModal 
      workshop={selectedWorkshop} 
      on:close={() => selectedWorkshop = null}
      on:refresh={fetchMyWorkshops} 
    />
  {/if}
</div>