<script>
  import { onMount } from 'svelte';
  export let onLogout;

  let workshops = [];
  let isLoading = true;
  let showModal = false;
  let error = "";
  
  // NEW: Variables for the Guest List Modal
  let showGuestsModal = false;
  let currentGuests = [];
  let currentWorkshopTitle = "";

  // NEW: Function to fetch and show guests
  async function viewGuests(workshop) {
    const token = localStorage.getItem("token");
    currentWorkshopTitle = workshop.title || workshop.topic;
    
    try {
      const res = await fetch(`http://localhost:3000/api/workshops/${workshop.id}/participants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        currentGuests = await res.json();
        showGuestsModal = true; // Open the popup
      } else {
        alert("Could not load guest list.");
      }
    } catch (e) {
      alert("Server error.");
    }
  }

  // NEW: State to track which page we are on ('browse' or 'schedule')
  let activeTab = "browse"; 
  let userRole = localStorage.getItem("role");

  let newWorkshop = {
    topic: "",
    date: "",
    location: "",
    description: ""
  };

  // 1. UPDATED: Fetch function checks which tab is active
  async function fetchWorkshops() {
    isLoading = true;
    workshops = []; // Clear list while loading
    const token = localStorage.getItem("token");
    
    // Choose the URL based on the tab
    const url = activeTab === 'schedule' 
      ? "http://localhost:3000/api/workshops/my" 
      : "http://localhost:3000/api/workshops";

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        workshops = await res.json();
      }
    } catch (e) {
      console.error("Error fetching workshops");
    } finally {
      isLoading = false;
    }
  }

  // Reload data whenever the tab changes
  $: if (activeTab) fetchWorkshops();

  async function handleCreate() {
    const token = localStorage.getItem("token");
    try {
      // Note: We map 'topic' to 'title' because of your DB schema
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
        showModal = false;
        newWorkshop = { topic: "", date: "", location: "", description: "" }; 
      } else {
        const data = await res.json();
        error = data.error || "Failed to create workshop";
      }
    } catch (e) {
      error = "Server error";
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
      if (res.ok) workshops = workshops.filter(w => w.id !== id);
    } catch (e) { alert("Could not delete."); }
  }

  async function handleJoin(id) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/api/workshops/${id}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert("Success! Joined.");
        fetchWorkshops(); // Refresh to update counts
      } else {
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
        // Remove it immediately from the list so the UI updates fast
        workshops = workshops.filter(w => w.id !== id);
      } else {
        alert("Could not leave.");
      }
    } catch (e) { alert("Server error."); }
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
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-[#1F2D4B]">
        {activeTab === 'browse' ? 'Browse Workshops' : 'My Schedule'}
      </h1>
      
      {#if userRole === 'teacher'}
        <button on:click={() => showModal = true} class="bg-[#1F2D4B] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition">
          + Create Workshop
        </button>
      {/if}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#if isLoading}
        <div class="col-span-full text-center py-12 text-gray-400">Loading...</div>
      {:else if workshops.length === 0}
        <div class="col-span-full bg-white p-12 rounded-[20px] text-center shadow-sm border border-dashed border-gray-300">
          <p class="text-gray-400 font-medium">
            {activeTab === 'browse' ? 'No workshops available.' : 'You haven\'t joined any workshops yet.'}
          </p>
        </div>
      {:else}
        {#each workshops as w}
          <div class="bg-white p-6 rounded-[24px] shadow-sm hover:shadow-md transition group relative overflow-hidden">
            
            <div class="absolute top-4 right-4 flex gap-2">
              {#if userRole === 'teacher'}
                <button on:click={() => viewGuests(w)} class="p-2 bg-blue-50 text-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-blue-100" title="View Guest List">📋</button>
                
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

        <button on:click={() => showGuestsModal = false} class="w-full mt-6 py-3 bg-[#1F2D4B] text-white font-bold rounded-xl hover:opacity-90 transition">
          Close
        </button>

      </div>
    </div>
  {/if}

  {#if showModal}
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-lg rounded-[24px] shadow-2xl p-8 relative">
        <h2 class="text-2xl font-bold text-[#1F2D4B] mb-6">New Workshop</h2>
        <div class="space-y-4">
          <input type="text" bind:value={newWorkshop.topic} class="w-full h-12 border rounded-xl px-4" placeholder="Topic" />
          <div class="grid grid-cols-2 gap-4">
            <input type="date" bind:value={newWorkshop.date} class="w-full h-12 border rounded-xl px-4" />
            <input type="text" bind:value={newWorkshop.location} class="w-full h-12 border rounded-xl px-4" placeholder="Location" />
          </div>
          <textarea bind:value={newWorkshop.description} class="w-full h-32 border rounded-xl p-4 resize-none" placeholder="Description"></textarea>
          <div class="flex gap-3 mt-4">
            <button on:click={() => showModal = false} class="flex-1 py-3 text-gray-500 hover:bg-gray-100 rounded-xl transition">Cancel</button>
            <button on:click={handleCreate} class="flex-1 py-3 bg-[#1F2D4B] text-white font-bold rounded-xl hover:opacity-90 transition">Create</button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>