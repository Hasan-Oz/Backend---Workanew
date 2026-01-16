<script>
  import { onMount } from 'svelte';
  export let onLogout;

  // --- VARIABLES ---
  let workshops = [];
  let isLoading = true;
  let showModal = false;
  let error = "";
  
  // Navigation
  let activeTab = "browse"; 
  let userRole = localStorage.getItem("role");
  let userId = localStorage.getItem("userId");

  // Search Logic
  let searchQuery = "";
  
  // Stats (for Teachers)
  let stats = { count: 0, totalStudents: 0 };

  // Date Protection (Get today's date)
  const today = new Date().toISOString().split('T')[0];

  // Guest List Modal Logic
  let showGuestsModal = false;
  let currentGuests = [];
  let currentWorkshopTitle = "";

  let newWorkshop = {
    topic: "",
    date: "",
    location: "",
    description: ""
  };

  // --- REACTIVE FILTER ---
  $: filteredWorkshops = Array.isArray(workshops) ? workshops.filter(w => {
    const term = searchQuery.toLowerCase();
    const title = (w.title || w.topic || "").toLowerCase();
    const location = (w.location || "").toLowerCase();
    return title.includes(term) || location.includes(term);
  }) : [];


  // --- FUNCTIONS ---
  async function fetchStats() {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/workshops/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        stats = await res.json();
      }
    } catch (e) {
      console.error("Stats error", e);
    }
  }

  async function fetchWorkshops() {
    isLoading = true;
    workshops = [];
    const token = localStorage.getItem("token");
    
    const url = activeTab === 'schedule' 
      ? "http://localhost:3000/api/workshops/my" 
      : "http://localhost:3000/api/workshops";

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        workshops = data;
      } else {
        workshops = []; 
      }
    } catch (e) {
      workshops = [];
    } finally {
      isLoading = false;
    }
  }

  // Reload when tab changes
  $: if (activeTab) fetchWorkshops();

  // Load stats on mount
  onMount(() => {
    fetchWorkshops();
    if (userRole) fetchStats();
  });

  async function handleCreate() {
    const token = localStorage.getItem("token");
    try {
      const payload = { ...newWorkshop, title: newWorkshop.topic, status: 'public' };
      
      const res = await fetch("http://localhost:3000/api/workshops", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload) 
      });

      if (res.ok) {
        await fetchWorkshops();
        if (userRole === 'teacher') fetchStats(); 
        showModal = false;
        newWorkshop = { topic: "", date: "", location: "", description: "" }; 
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create");
      }
    } catch (e) {
      alert("Server error");
    }
  }

  async function handleDelete(id) {
    if(!confirm("Are you sure you want to delete this?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/api/workshops/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        workshops = workshops.filter(w => w.id !== id);
        if (userRole === 'teacher') fetchStats();
      }
    } catch (e) { alert("Could not delete."); }
  }

  async function handleJoin(id) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/api/workshops/${id}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Success! Joined.");
        fetchWorkshops(); 
      } else {
        const data = await res.json();
        alert(data.error || "Could not join.");
      }
    } catch (e) { alert("Server error."); }
  }

  async function handleLeave(id) {
    if(!confirm("Are you sure you want to leave this workshop?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/api/workshops/${id}/leave`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        workshops = workshops.filter(w => w.id !== id);
      } else {
        alert("Could not leave.");
      }
    } catch (e) { alert("Server error."); }
  }

  async function viewGuests(workshop) {
    const token = localStorage.getItem("token");
    currentWorkshopTitle = workshop.title || workshop.topic;
    
    try {
      const res = await fetch(`http://localhost:3000/api/workshops/${workshop.id}/participants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        currentGuests = await res.json();
        showGuestsModal = true;
      } else {
        alert("Could not load guest list.");
      }
    } catch (e) {
      alert("Server error.");
    }
  }
</script>

<div class="min-h-screen bg-[#F6F7FB] flex relative">
  
  <aside class="hidden md:flex w-64 flex-col py-6 bg-white border-r fixed h-full z-10 px-4">
    <div class="flex items-center gap-3 px-4 mb-10 text-[#1F2D4B]">
      <div class="h-8 w-8 rounded-lg bg-[#1F2D4B] flex items-center justify-center text-white font-bold">WF</div>
      <span class="font-bold text-lg">WorkAnew</span>
    </div>
    
    <nav class="space-y-2 flex-1">
      <button 
        on:click={() => activeTab = 'browse'}
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium {activeTab === 'browse' ? 'bg-[#F6F7FB] text-[#1F2D4B]' : 'text-gray-400 hover:bg-gray-50'}">
        <span>🔍</span> Browse Workshops
      </button>

      {#if userRole === 'student'}
        <button 
          on:click={() => activeTab = 'schedule'}
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium {activeTab === 'schedule' ? 'bg-[#F6F7FB] text-[#1F2D4B]' : 'text-gray-400 hover:bg-gray-50'}">
          <span>📅</span> My Schedule
        </button>
      {/if}
    </nav>

    <button on:click={onLogout} class="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition font-medium">
      <span>🚪</span> Logout
    </button>
  </aside>

  <main class="flex-1 p-8 md:ml-64">
    
{#if userRole === 'teacher'}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-[20px] shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 class="text-lg font-medium text-[#1F2D4B]">My Impact</h2>
            <p class="text-sm text-gray-400 mt-1">Total engagement across all workshops</p>
          </div>
          <div class="mt-6 flex items-end gap-2">
            <span class="text-5xl font-bold text-[#1F2D4B]">{stats.totalStudents || 0}</span>
            <span class="text-lg text-gray-400 mb-1">Students Joined</span>
          </div>
          <div class="mt-2 text-sm text-[#5A5BE7] font-medium">
            Across {stats.count || 0} active workshops
          </div>
        </div>

        <div class="bg-white rounded-[20px] shadow-sm p-5">
          <div class="flex items-center justify-between gap-4">
            <div class="text-[18px] font-medium text-[#1F2D4B] truncate">Workshop composition</div>
            <a class="text-[14px] font-medium text-[#5A5BE7] shrink-0" href="#">View Report</a>
          </div>
          <div class="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6">
            <div class="flex items-start gap-3">
              <span class="mt-1 h-8 w-[3px] rounded-full bg-[#1F2D4B]"></span>
              <div><div class="text-[12px] text-gray-400">Software</div><div class="text-[16px] font-medium text-[#1F2D4B]">42%</div></div>
            </div>
            <div class="flex items-start gap-3">
              <span class="mt-1 h-8 w-[3px] rounded-full bg-[#1F2D4B]"></span>
              <div><div class="text-[12px] text-gray-400">Security</div><div class="text-[16px] font-medium text-[#1F2D4B]">25%</div></div>
            </div>
             <div class="flex items-start gap-3">
              <span class="mt-1 h-8 w-[3px] rounded-full bg-[#1F2D4B]"></span>
              <div><div class="text-[12px] text-gray-400">Design</div><div class="text-[16px] font-medium text-[#1F2D4B]">17%</div></div>
            </div>
          </div>
        </div>
      </div>

    {:else if userRole === 'student'}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        <div class="bg-white rounded-[20px] shadow-sm p-5">
          <div class="flex items-center justify-between gap-4">
            <div class="text-[18px] font-medium text-[#1F2D4B] truncate">Attendance breakdown</div>
            <a class="text-[14px] font-medium text-[#5A5BE7] shrink-0" href="#">Expand</a>
          </div>

          <div class="mt-4 flex items-center gap-6">
            <div class="relative h-[210px] w-[210px] shrink-0">
              <svg viewBox="0 0 120 120" class="h-full w-full">
                <circle cx="60" cy="60" r="44" fill="none" stroke="#EEF0F6" stroke-width="18" />
                <circle cx="60" cy="60" r="44" fill="none" stroke="#1F2D4B" stroke-width="18" stroke-linecap="round" stroke-dasharray="62 214" stroke-dashoffset="0" transform="rotate(-90 60 60)"/>
                <circle cx="60" cy="60" r="44" fill="none" stroke="#4B5C86" stroke-width="18" stroke-linecap="round" stroke-dasharray="54 214" stroke-dashoffset="-70" transform="rotate(-90 60 60)"/>
              </svg>

              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="text-[44px] font-medium text-[#1F2D4B] leading-none">{stats.joined || 0}</div>
                <div class="text-[14px] font-medium text-[rgba(0,0,0,.45)] -mt-0.5">Total</div>
              </div>
            </div>

            <div class="flex-1 space-y-4 pl-4 min-w-0 hidden sm:block">
              <div class="flex items-center gap-4"><span class="h-3 w-3 rounded-full bg-[#1F2D4B]"></span><span class="text-sm text-gray-600">Software</span></div>
              <div class="flex items-center gap-4"><span class="h-3 w-3 rounded-full bg-[#4B5C86]"></span><span class="text-sm text-gray-600">Design</span></div>
              <div class="flex items-center gap-4"><span class="h-3 w-3 rounded-full bg-[#B9BFF0]"></span><span class="text-sm text-gray-600">Security</span></div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-[20px] shadow-sm p-5 flex flex-col">
          <div class="flex items-center justify-between gap-4 mb-4">
            <div class="flex items-center gap-3">
              <div class="text-[18px] font-medium text-[#1F2D4B]">Notifications</div>
              <span class="h-6 px-2 rounded-lg bg-[#EEF0F6] text-[12px] font-medium text-[#111827] flex items-center">3</span>
            </div>
            <a class="text-[14px] font-medium text-[#5A5BE7]" href="#">See All</a>
          </div>

          <div class="space-y-5 overflow-y-auto h-48 pr-2">
            <div class="flex gap-3">
              <div class="h-9 w-9 rounded-xl bg-[#EEF0F6] flex items-center justify-center shrink-0 text-[#5A5BE7] font-bold">?</div>
              <div>
                <div class="text-[16px] font-medium text-[#5A5BE7]">Any ideas?</div>
                <div class="text-[15px] text-gray-400 leading-tight mt-1">Share your ideas and interests in the suggestions tab.</div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="h-9 w-9 rounded-xl bg-[#EEF0F6] flex items-center justify-center shrink-0 text-[#1F2D4B] font-bold">i</div>
              <div>
                <div class="text-[16px] font-medium text-[#1F2D4B]">Changed time</div>
                <div class="text-[15px] text-gray-400 leading-tight mt-1">Computational Thinking will start 30 mins later.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <h1 class="text-2xl font-bold text-[#1F2D4B]">
        {activeTab === 'browse' ? 'Browse Workshops' : 'My Schedule'}
      </h1>
      
      <div class="flex items-center gap-4 w-full md:w-auto">
        <div class="relative flex-1 md:w-64">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            bind:value={searchQuery} 
            placeholder="Search topics..." 
            class="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-[#1F2D4B] outline-none"
          />
        </div>

        {#if userRole === 'teacher'}
          <button on:click={() => showModal = true} class="bg-[#1F2D4B] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition whitespace-nowrap">
            + Create
          </button>
        {/if}
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#if isLoading}
        <div class="col-span-full text-center py-12 text-gray-400">Loading...</div>
      {:else if filteredWorkshops.length === 0}
        <div class="col-span-full bg-white p-12 rounded-[20px] text-center shadow-sm border border-dashed border-gray-300">
          <p class="text-gray-400 font-medium">No workshops found.</p>
        </div>
      {:else}
        {#each filteredWorkshops as w}
          <div class="bg-white p-6 rounded-[24px] shadow-sm hover:shadow-md transition group relative overflow-hidden">
            
            <div class="absolute top-4 right-4 flex gap-2">
              {#if userRole === 'teacher'}
                <button on:click={() => viewGuests(w)} class="p-2 bg-blue-50 text-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-blue-100" title="Guest List">📋</button>
                <button on:click={() => handleDelete(w.id)} class="p-2 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-100">🗑️</button>
              {:else if userRole === 'student'}
                {#if activeTab === 'schedule'}
                  <button on:click={() => handleLeave(w.id)} class="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition hover:opacity-90">Leave</button>
                {:else}
                  <button on:click={() => handleJoin(w.id)} class="px-3 py-1 bg-[#1F2D4B] text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition hover:opacity-90">Join</button>
                {/if}
              {/if}
            </div>

            <h3 class="font-bold text-xl text-[#1F2D4B] mb-2">{w.title || w.topic}</h3>
            <p class="text-sm text-gray-500 mb-6 line-clamp-2">{w.description}</p>
            
            <div class="flex items-center justify-between text-xs font-medium text-gray-400 border-t pt-4 border-gray-100">
              <div class="flex items-center gap-1">📍 {w.location}</div>
              <div class="flex items-center gap-1">📅 {w.date ? new Date(w.date).toLocaleDateString() : 'TBD'}</div>
              <div class="flex items-center gap-1 text-[#1F2D4B]">👥 {w.participants || 0}</div>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </main>

  {#if showModal}
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-lg rounded-[24px] shadow-2xl p-8 relative">
        <h2 class="text-2xl font-bold text-[#1F2D4B] mb-6">New Workshop</h2>
        
        <form class="space-y-4" on:submit|preventDefault={handleCreate}>
          <div>
            <input type="text" required bind:value={newWorkshop.topic} class="w-full h-12 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-[#1F2D4B] outline-none transition" placeholder="Topic" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <input type="date" required min={today} bind:value={newWorkshop.date} class="w-full h-12 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-[#1F2D4B] outline-none transition text-gray-500" />
            </div>
            <div>
              <input type="text" required bind:value={newWorkshop.location} class="w-full h-12 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-[#1F2D4B] outline-none transition" placeholder="Location" />
            </div>
          </div>

          <div>
            <textarea bind:value={newWorkshop.description} class="w-full h-32 border border-gray-200 rounded-xl p-4 resize-none focus:ring-2 focus:ring-[#1F2D4B] outline-none transition" placeholder="Description"></textarea>
          </div>

          <div class="flex gap-3 mt-4">
            <button type="button" on:click={() => showModal = false} class="flex-1 py-3 text-gray-500 hover:bg-gray-100 rounded-xl transition font-medium">Cancel</button>
            <button type="submit" class="flex-1 py-3 bg-[#1F2D4B] text-white font-bold rounded-xl hover:opacity-90 transition">Create</button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  {#if showGuestsModal}
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-md rounded-[24px] shadow-2xl p-8 relative">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-[#1F2D4B]">Guest List</h2>
          <button on:click={() => showGuestsModal = false} class="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <p class="text-sm text-gray-500 mb-4">Workshop: <span class="font-semibold">{currentWorkshopTitle}</span></p>
        <div class="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">
          {#if currentGuests.length === 0}
            <p class="text-center text-gray-400">No one has joined yet.</p>
          {:else}
            <ul class="space-y-3">
              {#each currentGuests as guest}
                <li class="flex items-center gap-3 border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                  <div class="h-8 w-8 rounded-full bg-[#1F2D4B] text-white flex items-center justify-center text-xs font-bold">
                    {guest.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p class="font-medium text-[#1F2D4B] text-sm">{guest.username}</p>
                    <p class="text-xs text-gray-400">{guest.email}</p>
                  </div>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
        <button on:click={() => showGuestsModal = false} class="w-full mt-6 py-3 bg-[#1F2D4B] text-white font-bold rounded-xl hover:opacity-90 transition">Close</button>
      </div>
    </div>
  {/if}
</div>

<style>
  :root {
    --navy: #1F2D4B;
    --muted: rgba(0,0,0,.55);
    --chip: #EEF0F6;
    --link: #5A5BE7;
    --radius: 20px;
  }
  div, button, input, textarea {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  }
</style>