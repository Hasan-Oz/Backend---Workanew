<script>
  import { onMount } from 'svelte';
  export let onLogout;

  let workshops = [];
  let isLoading = true;
  let showModal = false; // Controls the popup
  let error = "";
  
  // 1. Get the Role (teacher vs student)
  let userRole = localStorage.getItem("role"); 

  // Data for the new workshop (Renamed Title -> Topic)
  let newWorkshop = {
    topic: "",
    date: "",
    location: "",
    description: ""
  };

  // 2. Load Workshops on Start
  async function fetchWorkshops() {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/workshops", {
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

  onMount(fetchWorkshops);

  // 3. Handle Creating a Workshop
  async function handleCreate() {
    const token = localStorage.getItem("token");
    try {
      // We add "status: public" so the backend doesn't hide it!
      const res = await fetch("http://localhost:3000/api/workshops", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ ...newWorkshop, status: 'public' }) 
      });

      if (res.ok) {
        await fetchWorkshops(); // Refresh list
        showModal = false;
        newWorkshop = { topic: "", date: "", location: "", description: "" }; // Reset form
      } else {
        const data = await res.json();
        error = data.error || "Failed to create workshop";
      }
    } catch (e) {
      error = "Server error";
    }
  }

  // 4. Handle Deleting a Workshop
  async function handleDelete(id) {
    if(!confirm("Are you sure you want to delete this?")) return;

    const token = localStorage.getItem("token");
    try {
      // Uses `id` instead of `_id`
      const res = await fetch(`http://localhost:3000/api/workshops/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        workshops = workshops.filter(w => w.id !== id);
      } else {
        alert("Delete failed.");
      }
    } catch (e) {
      alert("Could not delete.");
    }
  }

  // 5. Handle Joining (Placeholder for now)
async function handleJoin(id) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/api/workshops/${id}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      
      if (res.ok) {
        alert("Success! You have joined the workshop. 🎉");
        // Optional: Here you could refresh the list or disable the button
      } else {
        alert(data.error || "Could not join.");
      }
    } catch (e) {
      alert("Server error. Please try again.");
    }
  }
</script>

<div class="min-h-screen bg-[#F6F7FB] flex relative">
  
  <aside class="hidden md:flex w-[86px] flex-col items-center py-6 bg-white border-r fixed h-full z-10">
    <div class="h-12 w-12 rounded-2xl bg-[#1F2D4B] flex items-center justify-center text-white font-bold text-xl mb-8">WF</div>
    
    <button on:click={onLogout} class="mt-auto h-10 w-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition" title="Logout">
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
    </button>
  </aside>

  <main class="flex-1 p-8 md:ml-[86px]">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-[#1F2D4B]">Dashboard</h1>
      
      {#if userRole === 'teacher'}
        <button on:click={() => showModal = true} class="bg-[#1F2D4B] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition flex items-center gap-2">
          <span>+ Create Workshop</span>
        </button>
      {/if}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#if isLoading}
        <p class="text-gray-400">Loading workshops...</p>
      {:else if workshops.length === 0}
        <div class="col-span-full bg-white p-12 rounded-[20px] text-center shadow-sm border border-dashed border-gray-300">
          <p class="text-gray-400 font-medium">No workshops found.</p>
          {#if userRole === 'teacher'}
            <button on:click={() => showModal = true} class="text-[#1F2D4B] font-bold mt-2 hover:underline">Create your first one</button>
          {/if}
        </div>
      {:else}
        {#each workshops as w}
          <div class="bg-white p-6 rounded-[24px] shadow-sm hover:shadow-md transition group relative overflow-hidden">
            
            {#if userRole === 'teacher'}
              <button on:click={() => handleDelete(w.id)} class="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-100" title="Delete">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            {:else if userRole === 'student'}
              <button on:click={() => handleJoin(w.id)} class="absolute top-4 right-4 px-4 py-2 bg-[#1F2D4B] text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-opacity-90">
                Join
              </button>
            {/if}

            <h3 class="font-bold text-xl text-[#1F2D4B] mb-2">{w.topic}</h3>
            <p class="text-sm text-gray-500 mb-6 line-clamp-2">{w.description}</p>
            
            <div class="flex items-center justify-between text-xs font-medium text-gray-400 border-t pt-4 border-gray-100">
            <div class="flex items-center gap-1">
                <span>📍</span> <span>{w.location}</span>
            </div>
            <div class="flex items-center gap-1">
                <span>📅</span> <span>{w.date ? new Date(w.date).toLocaleDateString() : 'TBD'}</span>
            </div>
            
            <div class="flex items-center gap-1 text-[#1F2D4B]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span>{w.participants || 0}</span>
            </div>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </main>

  {#if showModal}
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-lg rounded-[24px] shadow-2xl p-8 relative animate-in fade-in zoom-in duration-200">
        
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-[#1F2D4B]">New Workshop</h2>
          <button on:click={() => showModal = false} class="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {#if error}
          <div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>
        {/if}

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Topic</label>
            <input type="text" bind:value={newWorkshop.topic} class="w-full h-12 border rounded-xl px-4 focus:outline-none focus:border-[#1F2D4B] transition" placeholder="e.g. Intro to Svelte" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Date</label>
              <input type="date" bind:value={newWorkshop.date} class="w-full h-12 border rounded-xl px-4 focus:outline-none focus:border-[#1F2D4B] transition" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Location</label>
              <input type="text" bind:value={newWorkshop.location} class="w-full h-12 border rounded-xl px-4 focus:outline-none focus:border-[#1F2D4B] transition" placeholder="e.g. Room 301" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <textarea bind:value={newWorkshop.description} class="w-full h-32 border rounded-xl p-4 focus:outline-none focus:border-[#1F2D4B] transition resize-none" placeholder="What is this workshop about?"></textarea>
          </div>

          <button on:click={handleCreate} class="w-full h-12 bg-[#1F2D4B] text-white font-bold rounded-xl mt-4 hover:opacity-90 transition shadow-lg">
            Create Workshop
          </button>
        </div>

      </div>
    </div>
  {/if}

</div>