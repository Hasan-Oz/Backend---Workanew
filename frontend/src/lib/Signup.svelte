<script>
  export let onNavigate;
  let username = "", email = "", password = "", confirmPassword = "", error = "";
  
  // New variable for the dropdown
  let role = "student"; 

  async function handleSignup() {
    if (password !== confirmPassword) { error = "Passwords do not match!"; return; }
    try {
      // Now we send the role the user actually selected!
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }) 
      });
      if (res.ok) { alert("Account created! Please login."); onNavigate('login'); } 
      else { const data = await res.json(); error = data.error || "Signup failed"; }
    } catch (e) { error = "Server error."; }
  }
</script>

<div class="w-screen h-screen bg-[#F6F6F6] flex items-center justify-center p-8">
  <div class="w-full max-w-4xl bg-white rounded-[20px] overflow-hidden shadow-lg flex flex-col lg:flex-row h-full max-h-[800px]">
    <div class="w-full lg:w-1/2 p-12 flex flex-col overflow-y-auto">
      <div class="flex justify-between items-center mb-10">
        <div class="flex items-center gap-2 font-semibold text-[#111111]">
          <img src="/assets/images/logo.svg" alt="Logo" class="w-6 h-6"> <span>Workshop Forge</span>
        </div>
        <button type="button" on:click={() => onNavigate('login')} class="text-[#B8B9E8] font-semibold">Login instead</button>
      </div>
      <h1 class="text-3xl font-bold mb-2">Get Started Now</h1>
      {#if error}<div class="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>{/if}
      
      <div class="space-y-4">
        <div><label class="block text-sm font-semibold mb-1">Username</label><input type="text" bind:value={username} class="w-full h-12 border rounded-xl px-4 outline-none focus:border-[#1F2D4B]" /></div>
        <div><label class="block text-sm font-semibold mb-1">Email</label><input type="email" bind:value={email} class="w-full h-12 border rounded-xl px-4 outline-none focus:border-[#1F2D4B]" /></div>
        
        <div>
          <label class="block text-sm font-semibold mb-1">I am a...</label>
          <select bind:value={role} class="w-full h-12 border rounded-xl px-4 outline-none focus:border-[#1F2D4B] bg-white">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        <div><label class="block text-sm font-semibold mb-1">Password</label><input type="password" bind:value={password} class="w-full h-12 border rounded-xl px-4 outline-none focus:border-[#1F2D4B]" /></div>
        <div><label class="block text-sm font-semibold mb-1">Confirm Password</label><input type="password" bind:value={confirmPassword} class="w-full h-12 border rounded-xl px-4 outline-none focus:border-[#1F2D4B]" /></div>
      </div>
      
      <button type="button" on:click={handleSignup} class="mt-8 h-12 bg-[#1F2D4B] text-white rounded-xl font-semibold hover:opacity-90 transition">Sign Up</button>
    </div>
    <div class="hidden lg:block w-1/2 bg-[#1F2D4B] relative">
      <img src="/assets/images/sidebanner.svg" class="absolute inset-0 w-full h-full object-cover" alt="Banner" />
    </div>
  </div>
</div>