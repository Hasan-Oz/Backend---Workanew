<script lang="ts">
  import { onMount } from 'svelte';

  // --- STATE ---
  let isEditMode = false; // Tracks if we are editing an existing workshop
  let workshopId = null;  // Stores the ID if editing
  let minDate = "";       // Stores today's date to block past dates

  // Form Fields
  let title = "";
  let topic = "";
  let teacherName = ""; 
  let room = "";
  let date = "";
  let time = "";
  let duration = "60";
  let language = "Dutch";
  let visibility = "hidden"; 
  let description = "";

  // Navigation Helper
  function navigate(path: string) {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  // --- ON MOUNT: LOAD DATA & SET DATE ---
  onMount(() => {
    // 1. Set Minimum Date to Today
    const today = new Date();
    minDate = today.toISOString().split('T')[0];

    // 2. Check for Draft / Edit Data
    const saved = localStorage.getItem("draftWorkshop");
    if (saved) {
      const d = JSON.parse(saved);
      
      // Check if this is an edit (has an ID)
      if (d.id) {
        isEditMode = true;
        workshopId = d.id;
      }

      // Populate Fields
      title = d.title || "";
      topic = d.topic || "";
      teacherName = d.teacherName || "";
      room = d.location || d.room || "";
      date = d.date || "";
      time = d.time || "";
      duration = d.duration || "60";
      language = d.language || "Dutch";
      // Handle casing (API might return 'Public', form uses 'public')
      visibility = (d.status?.toLowerCase() === 'public' || d.visibility?.toLowerCase() === 'public') ? 'public' : 'hidden';
      description = d.description || "";
    }
  });

  // --- ACTIONS ---

  function assignToMe() {
    teacherName = "Me (Current User)"; 
  }

  function goToPreview() {
    // Basic validation
    if (!title || !date) {
      alert("Please fill in at least Title and Date");
      return;
    }

    // Create Draft Object
    const draftData = {
      id: workshopId, // Keep ID if editing (so Preview knows it's an update)
      title,
      topic,
      location: room,
      date,
      time,
      duration,
      language,
      status: visibility === 'public' ? 'Public' : 'Hidden',
      description,
      teacherName 
    };

    // Save to Memory
    localStorage.setItem("draftWorkshop", JSON.stringify(draftData));

    // Go to Preview Page
    navigate('/preview-workshop');
  }

  async function handleDelete() {
    if(!confirm("Are you sure you want to delete this workshop? This cannot be undone.")) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/api/workshops/${workshopId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        localStorage.removeItem("draftWorkshop");
        navigate('/dashboard');
      } else {
        const err = await res.json();
        alert("Failed to delete: " + (err.error || "Unknown error"));
      }
    } catch (e) {
      alert("Server error");
    }
  }

  function handleCancel() {
    localStorage.removeItem("draftWorkshop");
    navigate('/dashboard');
  }
</script>

<div class="min-h-screen w-full bg-[#F6F6F6] text-[#111827] font-sans flex">
    
    <aside class="fixed left-0 top-0 h-screen w-[78px] bg-white border-r border-black/5 flex flex-col items-center py-4 z-20">
      <div class="h-11 w-11 rounded-xl bg-[#0F172A] flex items-center justify-center mb-6 cursor-pointer" on:click={() => navigate('/dashboard')}>
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white"><path d="M12 2L2 7l10 5 10-5-10-5Z" stroke="currentColor" stroke-width="2"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2"/></svg>
      </div>
      <nav class="flex flex-col gap-3">
        <button on:click={() => navigate('/dashboard')} class="h-11 w-11 rounded-xl hover:bg-black/5 flex items-center justify-center text-[#64748B]">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </button>
      </nav>
    </aside>

    <main class="ml-[78px] px-10 py-10 w-full overflow-y-auto">
      <div class="mx-auto w-full max-w-[1160px]">
        
        <div class="w-full rounded-2xl bg-white border border-black/5 px-6 py-4 shadow-[0_6px_16px_rgba(15,23,42,0.06)]">
          <div class="flex items-center gap-2 text-[18px]">
            <span class="font-semibold">{isEditMode ? 'Update Workshop' : 'Workshop Definition'}</span>
            <span class="text-black/35">•</span>
            <span class="text-black/40 font-normal">{isEditMode ? 'updates generate notifications' : 'schedule new workshops'}</span>
          </div>
        </div>

        <div class="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <section class="space-y-5">
            <div>
              <div class="rounded-2xl bg-white border border-black/5 px-5 py-4 flex items-center gap-4 shadow-[0_6px_16px_rgba(15,23,42,0.06)] focus-within:border-[#1F2D4B]">
                <div class="h-9 w-9 rounded-xl bg-black/5 flex items-center justify-center">
                  <svg class="h-5 w-5 text-black/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V5h16v2"></path><path d="M9 19h6"></path><path d="M12 5v14"></path></svg>
                </div>
                <input bind:value={title} class="w-full bg-transparent outline-none text-[20px] font-light placeholder:text-black/35" placeholder="Title" />
              </div>
              <p class="mt-2 text-[13px] text-black/35">Title · use short recognizable phrases</p>
            </div>

            <div>
              <div class="rounded-2xl bg-white border border-black/5 px-5 py-4 flex items-center justify-between gap-4 shadow-[0_6px_16px_rgba(15,23,42,0.06)] focus-within:border-[#1F2D4B]">
                <div class="flex items-center gap-4 w-full">
                  <div class="h-9 w-9 rounded-xl bg-black/5 flex items-center justify-center">
                    <svg class="h-5 w-5 text-black/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14"></path><path d="M8 7h8"></path><path d="M8 11h8"></path></svg>
                  </div>
                   <input bind:value={topic} class="w-full bg-transparent outline-none text-[20px] font-light placeholder:text-black/35" placeholder="Topic" />
                </div>
              </div>
              <p class="mt-2 text-[13px] text-black/35">Topic · main subject matter</p>
            </div>

            <div>
              <div class="rounded-2xl bg-white border border-black/5 px-5 py-4 flex items-center justify-between gap-4 shadow-[0_6px_16px_rgba(15,23,42,0.06)]">
                <div class="flex items-center gap-4 w-full">
                  <div class="h-9 w-9 rounded-xl bg-black/5 flex items-center justify-center">
                    <svg class="h-5 w-5 text-black/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10L12 5 2 10l10 5 10-5z"></path><path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5"></path></svg>
                  </div>
                  <input bind:value={teacherName} class="w-full bg-transparent outline-none text-[20px] font-light placeholder:text-black/35" placeholder="Teacher Name" />
                </div>
                <button on:click={assignToMe} class="text-[13px] font-semibold text-[#3A4099] hover:opacity-80 whitespace-nowrap">
                  Assign to me
                </button>
              </div>
              <p class="mt-2 text-[13px] text-black/35">Teacher · quickly assign yourself via the button</p>
            </div>

            <div>
              <div class="rounded-2xl bg-white border border-black/5 px-5 py-4 flex items-center gap-4 shadow-[0_6px_16px_rgba(15,23,42,0.06)] focus-within:border-[#1F2D4B]">
                <div class="h-9 w-9 rounded-xl bg-black/5 flex items-center justify-center">
                  <svg class="h-5 w-5 text-black/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21v-8"></path><path d="M8 21v-5"></path><path d="M16 21v-11"></path><circle cx="12" cy="5" r="2"></circle></svg>
                </div>
                <input bind:value={room} class="w-full bg-transparent outline-none text-[20px] font-light placeholder:text-black/35" placeholder="Room / Location" />
              </div>
              <p class="mt-2 text-[13px] text-black/35">Room · physical or virtual location</p>
            </div>

            <div>
              <div class="rounded-2xl bg-white border border-black/5 px-5 py-4 flex items-center justify-between gap-4 shadow-[0_6px_16px_rgba(15,23,42,0.06)] focus-within:border-[#1F2D4B]">
                <div class="flex items-center gap-4 w-full">
                  <div class="h-9 w-9 rounded-xl bg-black/5 flex items-center justify-center">
                    <svg class="h-5 w-5 text-black/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path></svg>
                  </div>
                  <input type="date" bind:value={date} min={minDate} class="w-full bg-transparent outline-none text-[20px] font-light placeholder:text-black/35" />
                </div>
              </div>
              <p class="mt-2 text-[13px] text-black/35">Date · past dates are disabled</p>
            </div>

            <div class="flex gap-4">
                <div class="flex-1">
                    <div class="rounded-2xl bg-white border border-black/5 px-5 py-4 flex items-center gap-4 shadow-[0_6px_16px_rgba(15,23,42,0.06)] focus-within:border-[#1F2D4B]">
                        <input type="time" bind:value={time} class="w-full bg-transparent outline-none text-[20px] font-light placeholder:text-black/35" />
                    </div>
                    <p class="mt-2 text-[13px] text-black/35">Start Time</p>
                </div>
                <div class="flex-1">
                    <div class="rounded-2xl bg-white border border-black/5 px-5 py-4 flex items-center gap-4 shadow-[0_6px_16px_rgba(15,23,42,0.06)] focus-within:border-[#1F2D4B]">
                        <input type="number" bind:value={duration} class="w-full bg-transparent outline-none text-[20px] font-light placeholder:text-black/35" placeholder="60" />
                        <span class="text-black/35">min</span>
                    </div>
                    <p class="mt-2 text-[13px] text-black/35">Duration</p>
                </div>
            </div>

          </section>

          <section class="space-y-5">
            <div>
              <div class="rounded-2xl bg-white border border-black/5 px-5 py-4 flex items-center justify-between gap-4 shadow-[0_6px_16px_rgba(15,23,42,0.06)]">
                <div class="flex items-center gap-4">
                  <div class="h-9 w-9 rounded-xl bg-black/5 flex items-center justify-center">
                    <svg class="h-5 w-5 text-black/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18"></path><path d="M12 3a15 15 0 0 0 0 18"></path></svg>
                  </div>
                  <div class="text-[20px] font-light text-black/55">Language</div>
                </div>
                <div class="flex items-center gap-4 text-[13px] font-semibold">
                  <button on:click={() => language = 'Dutch'} class:text-[#3A4099]={language==='Dutch'} class:text-black-35={language!=='Dutch'}>Dutch</button>
                  <span class="h-4 w-px bg-black/10"></span>
                  <button on:click={() => language = 'English'} class:text-[#3A4099]={language==='English'} class:text-black-35={language!=='English'}>English</button>
                </div>
              </div>
              <p class="mt-2 text-[13px] text-black/35">Language · Dutch by default</p>
            </div>

            <div>
              <div class="rounded-2xl bg-white border border-black/5 px-5 py-4 flex items-center justify-between gap-4 shadow-[0_6px_16px_rgba(15,23,42,0.06)]">
                <div class="flex items-center gap-4">
                  <div class="h-9 w-9 rounded-xl bg-black/5 flex items-center justify-center">
                    <svg class="h-5 w-5 text-black/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </div>
                  <div class="text-[20px] font-light text-black/55">Visibility</div>
                </div>
                <div class="flex items-center gap-4 text-[13px] font-semibold">
                  <button on:click={() => visibility = 'hidden'} class:text-[#3A4099]={visibility==='hidden'} class="hover:text-[#3A4099]">Hidden</button>
                  <span class="h-4 w-px bg-black/10"></span>
                  <button on:click={() => visibility = 'public'} class:text-[#3A4099]={visibility==='public'} class="hover:text-[#3A4099]">Public</button>
                </div>
              </div>
              <p class="mt-2 text-[13px] text-black/35">Visibility · hidden by default</p>
            </div>

            <div>
              <div class="rounded-2xl bg-white border border-black/5 px-5 py-4 flex items-center justify-between gap-4 shadow-[0_6px_16px_rgba(15,23,42,0.06)]">
                <div class="flex items-center gap-4">
                  <div class="h-9 w-9 rounded-xl bg-black/5 flex items-center justify-center">
                    <svg class="h-5 w-5 text-black/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M8 7h8"></path><path d="M8 11h8"></path></svg>
                  </div>
                  <div class="text-[20px] font-light text-black/55">Description</div>
                </div>
              </div>
              <p class="mt-2 text-[13px] text-black/35">Description · concise description</p>

              <div class="mt-4 rounded-2xl bg-white border border-black/5 shadow-[0_6px_16px_rgba(15,23,42,0.06)] overflow-hidden focus-within:border-[#1F2D4B]">
                <textarea bind:value={description} class="w-full h-[320px] px-6 py-5 text-[20px] font-light outline-none placeholder:text-black/30 resize-none" placeholder="Start typing ..."></textarea>
              </div>
            </div>
          </section>
        </div>

        <div class="mt-8 flex items-center justify-between gap-5 pb-10">
          
          {#if isEditMode}
            <button on:click={handleDelete} class="h-[46px] w-[140px] rounded-xl bg-[#991b1b] text-white text-[14px] font-semibold hover:bg-[#7f1d1d] shadow-sm transition">
              Delete
            </button>
          {:else}
            <div></div> {/if}

          <div class="flex gap-5">
            <button on:click={handleCancel} class="h-[46px] w-[180px] rounded-xl bg-white border border-black/10 text-[14px] font-semibold text-black/50 hover:text-black/60 shadow-[0_6px_16px_rgba(15,23,42,0.04)] transition">
              Cancel
            </button>

            <button on:click={goToPreview} class="h-[46px] w-[240px] rounded-xl bg-[#1F2D4B] text-white text-[14px] font-semibold shadow-[0_10px_22px_rgba(31,45,75,0.24)] hover:opacity-95 flex items-center justify-center transition">
              Preview Workshop
            </button>
          </div>
        </div>

      </div>
    </main>
</div>