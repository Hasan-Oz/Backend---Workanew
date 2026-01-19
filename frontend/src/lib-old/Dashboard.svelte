<script>
  import { onMount } from 'svelte';
  export let onLogout;

  // --- VARIABLES ---
  let workshops = [];
  let isLoading = true;
  let userRole = localStorage.getItem("role"); // 'teacher' or 'student'
  
  // Stats
  let stats = { count: 0, totalStudents: 0, joined: 0 };

  // --- API ---
  async function fetchData() {
    isLoading = true;
    const token = localStorage.getItem("token");
    
    // 1. Fetch Workshops (Different for Teacher vs Student)
    // Teacher: Get "My Workshops" (created by them)
    // Student: Get "All Workshops" (to browse/attend)
    const url = userRole === 'teacher' 
      ? "http://localhost:3000/api/workshops/my" 
      : "http://localhost:3000/api/workshops";

    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) workshops = await res.json();
    } catch (e) { console.error(e); }

    // 2. Fetch Stats
    try {
      const resStats = await fetch("http://localhost:3000/api/workshops/stats", { headers: { Authorization: `Bearer ${token}` } });
      if (resStats.ok) stats = await resStats.json();
    } catch (e) { console.error(e); }

    isLoading = false;
  }

  onMount(() => {
    fetchData();
  });
</script>

<svelte:head>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.cdnfonts.com/css/sf-pro-display" rel="stylesheet">
</svelte:head>

<div class="bg-[var(--page-bg)] text-[#0F172A] overflow-hidden font-medium h-screen w-full flex">

    <aside class="hidden md:flex w-[86px] shrink-0 px-4 py-6 flex-col items-center">
      <div class="h-12 w-12 rounded-2xl bg-white shadow-[var(--shadow)] flex items-center justify-center">
        <span class="text-xl font-bold text-[#1F2D4B]">WF</span>
      </div>
      <nav class="mt-8 flex flex-col gap-3">
        <div class="h-11 w-11 rounded-2xl bg-[var(--navy)] flex items-center justify-center shadow-[var(--shadow)] cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 10.5L12 4l8 6.5V20a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 20v-9.5Z" stroke="white" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 21v-7h6v7" stroke="white" stroke-width="1.7" stroke-linejoin="round"/></svg>
        </div>
        <div class="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-[var(--shadow)] text-gray-400"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" stroke="#1F2D4B" stroke-width="1.7" stroke-linejoin="round"/></svg></div>
        <div class="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-[var(--shadow)]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3 3 8l9 5 9-5-9-5Z" stroke="#1F2D4B" stroke-width="1.7" stroke-linejoin="round"/><path d="M3 12l9 5 9-5" stroke="#1F2D4B" stroke-width="1.7" stroke-linejoin="round"/><path d="M3 16l9 5 9-5" stroke="#1F2D4B" stroke-width="1.7" stroke-linejoin="round"/></svg></div>
      </nav>
      <div class="mt-auto flex flex-col gap-3">
        <button on:click={onLogout} class="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-[var(--shadow)] cursor-pointer hover:bg-gray-50 transition"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M10 17l-5-5 5-5" stroke="#1F2D4B" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12h10" stroke="#1F2D4B" stroke-width="1.7" stroke-linecap="round"/></svg></button>
        <div class="h-12 w-12 rounded-2xl bg-[var(--navy)] flex items-center justify-center shadow-[var(--shadow)]"><div class="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center"><div class="h-7 w-7 rounded-full bg-white/30 flex items-center justify-center"><div class="h-6 w-6 rounded-full bg-white"></div></div></div></div>
      </div>
    </aside>

    <main class="flex-1 h-screen overflow-hidden py-6 px-4 md:px-6 lg:pr-6">
      <div class="w-full 2xl:max-w-[1680px] 2xl:mx-auto h-full">
        <div class="grid grid-cols-12 lg:grid-cols-3 gap-x-6 gap-y-4 h-full items-stretch">

          <section class="col-span-12 lg:col-span-1 min-w-0 flex flex-col gap-4 overflow-y-auto">
            <div class="bg-white rounded-[var(--radius)] shadow-[var(--shadow)] px-5 py-4 shrink-0">
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="text-[18px] font-medium truncate">Today's workshops</div>
                  <span class="h-6 px-2 rounded-lg bg-[var(--chip)] text-[12px] font-medium text-[#111827] flex items-center shrink-0">{workshops.length}</span>
                </div>
                <a class="text-[14px] font-medium text-[var(--link)] shrink-0" href="#">See All</a>
              </div>
            </div>

            {#each workshops.slice(0, 2) as w}
            <div class="bg-white rounded-[var(--radius)] shadow-[var(--shadow)] px-5 py-4 shrink-0">
                <div class="flex items-start justify-between gap-3">
                    <div class="text-[18px] font-medium truncate">{w.topic || w.title}</div>
                    <div class="text-[13px] text-[rgba(0,0,0,.45)] font-medium shrink-0">30 min</div>
                </div>
                <div class="mt-3 grid grid-cols-[auto_auto_1fr_auto_1fr] items-center gap-4">
                    <div class="shrink-0"><div class="text-[20px] font-medium text-[#3B4CCA] leading-none">EN</div></div>
                    <div class="flex justify-center"><div class="w-px h-10 bg-black/10"></div></div>
                    <div class="flex items-center gap-2 text-[13px] text-[var(--muted)] shrink-0">
                        <span class="leading-4">{w.location || 'TBD'}<br><span class="text-[rgba(0,0,0,.35)] font-medium">{w.date ? new Date(w.date).toLocaleDateString() : 'Date'}</span></span>
                    </div>
                    <div class="flex justify-center"><div class="w-px h-10 bg-black/10"></div></div>
                    <div class="min-w-0">
                        <div class="flex flex-col gap-2 text-[13px] text-[var(--muted)] min-w-0">
                            <div class="flex items-center gap-2 min-w-0"><span class="truncate">Teacher</span></div>
                            <div class="flex items-center gap-2 min-w-0"><span class="truncate">General</span></div>
                        </div>
                    </div>
                </div>
                <div class="mt-4 grid grid-cols-2 gap-4">
                    <button class="h-11 rounded-xl bg-[#EEF0F6] text-[14px] font-medium text-[#374151]">View Details</button>
                    <button class="h-11 rounded-xl bg-[var(--navy)] text-white text-[14px] font-medium">Sign up</button>
                </div>
            </div>
            {/each}
          </section>

          <section class="col-span-12 lg:col-span-1 min-w-0 flex flex-col gap-4 overflow-y-auto">
            <div class="bg-white rounded-[var(--radius)] shadow-[var(--shadow)] px-5 py-4 shrink-0">
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="text-[18px] font-medium truncate">Student suggestions</div>
                  <span class="h-6 px-2 rounded-lg bg-[var(--chip)] text-[12px] font-medium text-[#111827] flex items-center shrink-0">16</span>
                </div>
                <a class="text-[14px] font-medium text-[var(--link)] shrink-0" href="#">See All</a>
              </div>
            </div>
            <div class="bg-white rounded-[var(--radius)] shadow-[var(--shadow)] p-4 flex gap-4 shrink-0">
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2 text-[12px] text-[rgba(0,0,0,.45)] font-medium min-w-0"><span class="truncate">Business Data</span></div>
                  <div class="text-[12px] text-[rgba(0,0,0,.45)] font-medium shrink-0">Jan 6, 2026</div>
                </div>
                <div class="mt-2 text-[16px] font-medium truncate">Business plan definition</div>
                <p class="mt-2 text-[13px] leading-5 text-[rgba(0,0,0,.45)]">Due to heavy traffic, I will be running later.</p>
              </div>
              <div class="w-[62px] shrink-0 flex flex-col items-center justify-center gap-3"><div class="text-[18px] font-medium text-[#1F2D4B]">31</div></div>
            </div>
            <div class="bg-white rounded-[var(--radius)] shadow-[var(--shadow)] p-4 flex gap-4 shrink-0">
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2 text-[12px] text-[rgba(0,0,0,.45)] font-medium min-w-0"><span class="truncate">Game Design</span></div>
                  <div class="text-[12px] text-[rgba(0,0,0,.45)] font-medium shrink-0">Dec 15, 2025</div>
                </div>
                <div class="mt-2 text-[16px] font-medium truncate">Unreal Engine Camera</div>
                <p class="mt-2 text-[13px] leading-5 text-[rgba(0,0,0,.45)]">Introduction to camera mechanics.</p>
              </div>
              <div class="w-[62px] shrink-0 flex flex-col items-center justify-center gap-3"><div class="text-[18px] font-medium text-[#1F2D4B]">12</div></div>
            </div>
          </section>

          <section class="col-span-12 lg:col-span-1 lg:row-span-2 flex flex-col gap-4 min-w-0 overflow-y-auto">
            
            {#if userRole === 'teacher'}
                <div class="bg-white rounded-[var(--radius)] shadow-[var(--shadow)] p-5 shrink-0">
                    <div class="flex items-center justify-between gap-4">
                        <div class="text-[18px] font-medium truncate">Workshop composition</div>
                        <a class="text-[14px] font-medium text-[var(--link)] shrink-0" href="#">Revert</a>
                    </div>
                    <div class="mt-6 grid grid-cols-3 gap-x-10 gap-y-8">
                        <div class="flex items-start gap-3"><span class="mt-1 h-10 w-[3px] rounded-full bg-[var(--navy)]"></span><div class="min-w-0"><div class="text-[12px] font-medium text-[rgba(0,0,0,.40)] truncate">Software</div><div class="text-[16px] font-medium text-[#1F2D4B] leading-5">42%</div></div></div>
                        <div class="flex items-start gap-3"><span class="mt-1 h-10 w-[3px] rounded-full bg-[var(--navy)]"></span><div class="min-w-0"><div class="text-[12px] font-medium text-[rgba(0,0,0,.40)] truncate">Security</div><div class="text-[16px] font-medium text-[#1F2D4B] leading-5">25%</div></div></div>
                        <div class="flex items-start gap-3"><span class="mt-1 h-10 w-[3px] rounded-full bg-[var(--navy)]"></span><div class="min-w-0"><div class="text-[12px] font-medium text-[rgba(0,0,0,.40)] truncate">Media</div><div class="text-[16px] font-medium text-[#1F2D4B] leading-5">17%</div></div></div>
                    </div>
                </div>
            {:else}
                <div class="bg-white rounded-[var(--radius)] shadow-[var(--shadow)] p-5 min-h-[370px]">
                    <div class="flex items-center justify-between gap-4">
                        <div class="text-[18px] font-medium truncate">Attendance breakdown</div>
                        <a class="text-[14px] font-medium text-[var(--link)] shrink-0" href="#">Expand</a>
                    </div>
                    <div class="mt-4 flex items-center gap-6">
                        <div class="relative h-[210px] w-[210px] shrink-0">
                            <svg viewBox="0 0 120 120" class="h-full w-full">
                                <circle cx="60" cy="60" r="44" fill="none" stroke="#EEF0F6" stroke-width="18" />
                                <circle cx="60" cy="60" r="44" fill="none" stroke="#1F2D4B" stroke-width="18" stroke-dasharray="62 214" stroke-dashoffset="0" transform="rotate(-90 60 60)"/>
                                <circle cx="60" cy="60" r="44" fill="none" stroke="#4B5C86" stroke-width="18" stroke-dasharray="54 214" stroke-dashoffset="-70" transform="rotate(-90 60 60)"/>
                            </svg>
                            <div class="absolute inset-0 flex flex-col items-center justify-center">
                                <div class="text-[44px] font-medium text-[#1F2D4B] leading-none">{stats.joined || 0}</div>
                                <div class="text-[14px] font-medium text-[rgba(0,0,0,.45)] -mt-0.5">Total</div>
                            </div>
                        </div>
                        <div class="flex-1 space-y-4 pl-4 min-w-0">
                            <div class="flex items-center gap-4 min-w-0"><span class="h-3 w-3 rounded-full bg-[#1F2D4B] shrink-0"></span><span class="text-[14px] font-medium text-[rgba(0,0,0,.65)] truncate">Joined</span></div>
                        </div>
                    </div>
                </div>
            {/if}

            <div class="bg-white rounded-[var(--radius)] shadow-[var(--shadow)] p-5 flex-1 min-w-0 flex flex-col shrink-0">
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="text-[18px] font-medium truncate">Notifications</div>
                  <span class="h-6 px-2 rounded-lg bg-[var(--chip)] text-[12px] font-medium text-[#111827] flex items-center shrink-0">5</span>
                </div>
                <a class="text-[14px] font-medium text-[var(--link)] shrink-0" href="#">See All</a>
              </div>
              <div class="mt-4 space-y-5 min-w-0">
                 <div class="flex gap-3 min-w-0"><div class="h-9 w-9 rounded-xl bg-[#EEF0F6] flex items-center justify-center shrink-0"><span class="text-[14px] font-medium text-[#5A5BE7]">?</span></div><div class="flex-1 min-w-0"><div class="text-[16px] font-medium text-[#5A5BE7] truncate">Any ideas?</div><div class="mt-2 text-[15px] leading-6 text-[rgba(0,0,0,.45)]">Share your ideas.</div></div></div>
              </div>
              <div class="flex-1"></div>
            </div>
          </section>

          <section class="col-span-12 lg:col-span-2 min-w-0 flex flex-col gap-4">
            <div class="bg-white rounded-[var(--radius)] shadow-[var(--shadow)] px-5 py-4 shrink-0">
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-2 min-w-0">
                  <div class="text-[18px] font-medium truncate">
                    {#if userRole === 'teacher'}My Workshops{:else}Recently attended workshops{/if}
                  </div>
                  {#if userRole === 'student'}<span class="text-[14px] font-medium text-[rgba(0,0,0,.35)] shrink-0">· reflection materials</span>{/if}
                </div>
                <a class="text-[14px] font-medium text-[var(--link)] shrink-0" href="#">See All</a>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch min-h-0">
                {#each workshops.slice(0, 3) as w}
                <div class="bg-white rounded-[var(--radius)] shadow-[var(--shadow)] p-5 h-full flex flex-col">
                    <div class="flex items-start justify-between gap-3">
                        <div class="text-[16px] font-medium truncate">{w.topic || w.title}</div>
                        <span class="h-5 px-2 rounded-lg bg-[#EEF0F6] text-[11px] font-medium text-[#111827] shrink-0">
                            {#if userRole === 'teacher'}Edit{:else}New{/if}
                        </span>
                    </div>
                    <p class="mt-3 text-[12.5px] leading-5 text-[rgba(0,0,0,.45)]">{w.description || "No description."}</p>
                    <div class="mt-auto pt-4 flex items-center justify-between text-[12px] font-medium text-[rgba(0,0,0,.45)] gap-4">
                        <div class="flex items-center gap-2 min-w-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 21V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14" stroke="#1F2D4B" stroke-width="1.7" stroke-linecap="round"/></svg>
                            <span class="truncate">{#if userRole === 'teacher'}Participants: {w.participants || 0}{:else}Teacher{/if}</span>
                        </div>
                        <div class="flex items-center gap-2 min-w-0">
                            <span class="truncate">{w.location || 'TBD'}</span>
                        </div>
                    </div>
                </div>
                {/each}
            </div>
          </section>

        </div>
      </div>
    </main>
</div>

<style>
    * { font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
    :root{
      --page-bg:#F6F7FB;
      --navy:#1F2D4B;
      --muted:rgba(0,0,0,.55);
      --line:rgba(0,0,0,.06);
      --chip:#EEF0F6;
      --link:#5A5BE7;
      --radius:20px;
      --shadow:0 10px 30px rgba(16,24,40,0.06);
    }
</style>