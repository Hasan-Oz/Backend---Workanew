<script lang="ts">
  import { onMount } from 'svelte';

  let draft: any = {};
  let isLoading = false;

  // Navigation Helper
  function navigate(path: string) {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  onMount(() => {
    // 1. Load the draft data from memory
    const saved = localStorage.getItem("draftWorkshop");
    if (saved) {
      draft = JSON.parse(saved);
    } else {
      // If no data, go back to create
      navigate('/create-workshop');
    }
  });

    async function handleSchedule() {
        isLoading = true;
        const token = localStorage.getItem("token");

        // CHECK: Do we have an ID? 
        // If yes, it's an EDIT (PUT). If no, it's a NEW (POST).
        const isEdit = !!draft.id; 
        const url = isEdit 
        ? `http://localhost:3000/api/workshops/${draft.id}` 
        : "http://localhost:3000/api/workshops";
        
        const method = isEdit ? "PUT" : "POST";

        try {
        const res = await fetch(url, {
            method: method,
            headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(draft)
        });

        if (res.ok) {
            localStorage.removeItem("draftWorkshop");
            // Use your navigate helper if available, or window.location
            window.location.href = '/dashboard'; 
        } else {
            const err = await res.json();
            alert("Failed: " + (err.error || "Unknown error"));
        }
        } catch (err) {
        console.error(err);
        alert("Server error.");
        } finally {
        isLoading = false;
        }
    }

  function handleCancel() {
    // Go back to edit
    navigate('/create-workshop');
  }
</script>

<main class="min-h-screen w-full flex justify-center px-6 py-10 bg-[#F6F6F6] font-sans">
  <div class="flex items-end gap-6">

    <div class="w-[720px] flex flex-col gap-5">

      <div class="rounded-[18px] bg-white border border-black/10 px-6 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
        <div class="flex items-center gap-2 text-[18px]">
          <span class="font-semibold">Preview</span>
          <span class="text-black/30">·</span>
          <span class="text-black/40">confirm before publishing</span>
        </div>
      </div>

      <div class="rounded-[18px] bg-white border border-black/10 px-6 py-5 shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
        <div class="flex justify-between">
          <div class="text-[18px] font-semibold">{draft.title || 'Untitled'}</div>
          <div class="text-[13px] text-black/45">{draft.duration || 60} min</div>
        </div>

        <div class="mt-4 flex items-center gap-6 text-[13px] text-black/55">
          <span class="text-[20px] font-semibold text-[#2F62E9] uppercase">{draft.language ? draft.language.slice(0,2) : 'EN'}</span>
          <div class="h-8 w-px bg-black/10"></div>
          <div class="flex gap-10">
            <div>
              <div class="font-medium">{draft.location || 'Online'}</div>
              <div>{draft.time || '10:00 AM'}</div>
            </div>
            <div>
              <div class="font-medium">Teacher</div>
              <div>Software</div>
            </div>
          </div>
        </div>

        <div class="mt-5 grid grid-cols-2 gap-4">
          <button class="h-[44px] rounded-[12px] bg-black/5 text-black/55 hover:bg-black/10 transition">
            View Details
          </button>
          <button class="h-[44px] rounded-[12px] bg-[#1F2D4B] text-white hover:bg-[#2a3c5e] transition">
            Sign up
          </button>
        </div>
      </div>

      <div class="rounded-[18px] bg-white border border-black/10 shadow-[0_18px_40px_rgba(0,0,0,0.12)] overflow-hidden">
        <div class="px-6 py-4 border-b border-black/10 flex justify-between text-[13px] text-black/50">
          <span>Date Preview: <strong class="text-[#111827]">{draft.date || 'TBD'}</strong></span>
          <span class="font-semibold text-blue-600 uppercase">{draft.status || 'Draft'}</span>
        </div>

        <div class="px-6 py-6">
          <div class="flex justify-between gap-6">
            <div class="flex gap-5">
              <div class="h-[72px] w-[72px] rounded-[18px] bg-[#E9ECFF] flex items-center justify-center text-2xl">
                📚
              </div>
              <div>
                <div class="text-[22px] font-semibold">{draft.title || 'Workshop Title'}</div>
                <div class="mt-2 text-[13px] text-black/55">
                   Created by You · {draft.language || 'English'}
                </div>
              </div>
            </div>

            <button class="h-[40px] px-5 rounded-[12px] bg-[#1F2D4B] text-white hover:bg-[#2a3c5e] transition">
              Sign Up
            </button>
          </div>

          <div class="mt-6 h-px bg-black/10"></div>

          <div class="mt-6 grid grid-cols-[220px_1fr] gap-y-6 text-[14px]">
            <div class="text-black/45">Topic</div>
            <div class="flex gap-3">
              <span class="px-3 h-[30px] flex items-center rounded-[10px] bg-[#E9F0FF] text-[#2F62E9] text-[12px] font-semibold">
                {draft.topic || 'General'}
              </span>
            </div>

            <div class="text-black/45">Room</div>
            <div>{draft.location || 'Online'}</div>

            <div class="text-black/45">Date</div>
            <div>{draft.date || 'TBD'}</div>

            <div class="text-black/45">Duration</div>
            <div>{draft.duration || 60} min</div>

            <div class="text-black/45">Description</div>
            <div class="text-black/60 whitespace-pre-wrap">
              {draft.description || 'No description provided.'}
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="w-[260px] flex flex-col gap-3 pb-2">
      <button 
        on:click={handleSchedule}
        disabled={isLoading}
        class="h-[46px] rounded-[12px] bg-[#1F2D4B] text-white shadow-[0_10px_22px_rgba(0,0,0,0.18)] font-semibold hover:bg-[#2a3c5e] transition disabled:opacity-50">
        {isLoading ? 'Publishing...' : 'Schedule Workshop'}
      </button>
      
      <button 
        on:click={handleCancel}
        class="h-[46px] rounded-[12px] bg-white border border-black/15 text-black/40 font-semibold hover:bg-gray-50 transition">
        Edit / Cancel
      </button>
    </div>

  </div>
</main>