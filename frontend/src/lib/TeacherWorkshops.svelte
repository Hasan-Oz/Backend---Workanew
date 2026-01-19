<script lang="ts">
  import { onMount } from 'svelte';
  import TeacherWorkshopDetailsModal from './TeacherWorkshopDetailsModal.svelte';

  // State
  let myWorkshops: any[] = [];
  let selectedWorkshop = null;
  let loading = true;

  // Mock Data for "Today's Workshops" (Top Left)
  let todayWorkshops = [
    { title: "Python functions", time: "01:30 PM", room: "OIL 4.30", lang: "EN", attendees: "Avetyan, Rafayel" },
    { title: "HTML structure basics", time: "01:30 PM", room: "OIL 4.30", lang: "EN", attendees: "Eyck, Anke" },
  ];

  // Mock Data for "Student Suggestions" (Middle)
  let suggestions = [
    { title: "Business plan definition", votes: 31, date: "Jan 6, 2026", tags: ["new"] },
    { title: "Unreal Engine Camera", votes: 12, date: "Dec 15, 2025", tags: [] },
    { title: "Responsive layouts", votes: 5, date: "Dec 8, 2025", tags: [] }
  ];

  // Mock Data for Stats (Top Right)
  const stats = [
    { label: "Software", pct: 42 },
    { label: "Security", pct: 25 },
    { label: "IT Management", pct: 0 },
    { label: "Infrastructure", pct: 16 },
    { label: "Media Design", pct: 17 },
    { label: "AI", pct: 0 },
  ];

  // Mock Data for Notifications (Right Side)
  let notifications = [
    { title: "Any ideas for future workshops?", type: "info", time: "new" },
    { title: "Computational Thinking: Changed time", type: "update", time: "new" },
    { title: "Computational Thinking: Cancelled", type: "alert", time: "" },
  ];

  onMount(async () => {
    const token = localStorage.getItem("token");
    // Fetch real workshops for the bottom list
    try {
      const res = await fetch("http://localhost:3000/api/workshops", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        myWorkshops = await res.json();
      }
    } catch (e) { console.error(e); } 
    finally { loading = false; }
  });
</script>

<div class="space-y-8 font-sans">

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    
    <div class="lg:col-span-4 flex flex-col gap-5">
      <div class="flex items-center justify-between">
         <div class="flex items-center gap-3">
            <h3 class="font-bold text-gray-800 text-lg">Today's workshops</h3>
            <span class="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-md">{todayWorkshops.length}</span>
         </div>
         <button class="text-[#2F62E9] text-sm font-semibold hover:underline">See All</button>
      </div>

      <div class="flex flex-col gap-4">
        {#each todayWorkshops as w}
          <div class="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 relative group hover:shadow-md transition">
            <div class="flex justify-between items-start mb-3">
              <h4 class="font-bold text-[#111111] text-lg">{w.title}</h4>
              <span class="text-xs text-gray-400">30 min</span>
            </div>
            
            <div class="grid grid-cols-2 gap-y-2 text-xs text-gray-500 mb-4">
               <div class="flex items-center gap-2">
                 <span class="font-bold text-[#2F62E9] text-lg">{w.lang}</span>
               </div>
               <div class="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {w.room}
               </div>
               <div class="flex items-center gap-2 col-span-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {w.time}
               </div>
            </div>

            <div class="flex gap-3">
               <button class="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition">View Details</button>
               <button class="flex-1 py-2 bg-[#1F2D4B] text-white rounded-lg text-xs font-semibold hover:bg-[#2a3c5e] transition">Start Class</button>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="lg:col-span-4 flex flex-col gap-5">
      <div class="flex items-center justify-between">
         <div class="flex items-center gap-3">
            <h3 class="font-bold text-gray-800 text-lg">Student suggestions</h3>
            <span class="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-md">16</span>
         </div>
         <button class="text-[#2F62E9] text-sm font-semibold hover:underline">See All</button>
      </div>

      <div class="flex flex-col gap-4 relative">
        <div class="absolute left-[24px] top-4 bottom-4 w-px border-l-2 border-dashed border-gray-200 z-0"></div>

        {#each suggestions as s, i}
          <div class="flex items-start gap-4 z-10">
             <div class="h-6 w-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400 shrink-0 mt-1">
               {i + 1}
             </div>
             <div class="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex-1 flex gap-3">
                <div class="flex-1">
                   <div class="flex justify-between items-start mb-1">
                      <div class="flex items-center gap-2">
                        <div class="h-6 w-6 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                        </div>
                        <span class="text-[10px] text-gray-400">{s.date}</span>
                      </div>
                   </div>
                   <div class="flex items-center gap-2 mb-1">
                     <h4 class="font-bold text-[#111111] text-sm">{s.title}</h4>
                     {#each s.tags as tag}
                       <span class="bg-gray-100 text-gray-500 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">{tag}</span>
                     {/each}
                   </div>
                   <p class="text-[11px] text-gray-400 line-clamp-2">Student description goes here...</p>
                </div>
             </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="lg:col-span-4 flex flex-col gap-6">
      
      <div class="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
         <h3 class="font-bold text-gray-800 mb-4">Workshop composition</h3>
         <div class="grid grid-cols-2 gap-y-5 gap-x-2">
            {#each stats as stat}
              <div class="flex flex-col">
                 <div class="flex items-center gap-1.5 mb-1">
                    <div class="h-6 w-0.5 bg-[#1F2D4B] rounded-full"></div>
                    <div>
                       <div class="text-[10px] text-gray-400 leading-none mb-0.5">{stat.label}</div>
                       <div class="text-sm font-bold text-[#1F2D4B]">{stat.pct}%</div>
                    </div>
                 </div>
              </div>
            {/each}
         </div>
      </div>

      <div class="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex-1">
         <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-gray-800">Notifications</h3>
            <span class="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-md">{notifications.length}</span>
         </div>
         <div class="flex flex-col gap-4">
            {#each notifications as n}
              <div class="flex gap-3 items-start">
                 <div class="mt-0.5 h-4 w-4 rounded-full border border-gray-200 text-gray-400 flex items-center justify-center text-[10px]">!</div>
                 <div class="flex-1">
                    <div class="flex justify-between">
                       <p class="text-xs font-bold text-gray-700">{n.title}</p>
                       {#if n.time === 'new'}<span class="text-[8px] font-bold text-blue-500 bg-blue-50 px-1 rounded">NEW</span>{/if}
                    </div>
                 </div>
              </div>
            {/each}
         </div>
      </div>
    </div>
  </div>

  <div>
    <div class="flex justify-between items-center mb-6 pt-4 border-t border-gray-200">
      <h3 class="font-bold text-gray-800 text-lg">My workshops <span class="text-gray-400 font-normal text-sm ml-2">storage directory</span></h3>
      
      <a href="/create-workshop" class="bg-[#1F2D4B] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2a3c5e] transition shadow-md flex items-center gap-2 text-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
        Create New
      </a>
    </div>

    {#if myWorkshops.length === 0}
      <div class="bg-white rounded-[20px] p-12 text-center border-2 border-dashed border-gray-200">
        <p class="text-gray-400 mb-4">You haven't created any workshops yet.</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each myWorkshops as w}
          <div 
            on:click={() => selectedWorkshop = w}
            class="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group">
            
            <div class="flex items-center justify-between mb-4">
               <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">{w.topic}</span>
               <span class="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Active</span>
            </div>

            <h3 class="text-lg font-bold text-[#111111] mb-2 group-hover:text-[#2F62E9] transition-colors">{w.title}</h3>
            <p class="text-gray-500 text-sm mb-6 line-clamp-2">{w.description}</p>
            
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
    <TeacherWorkshopDetailsModal 
      workshop={selectedWorkshop} 
      on:close={() => selectedWorkshop = null} 
    />
  {/if}

</div>