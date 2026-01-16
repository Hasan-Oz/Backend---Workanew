<script>
  export let onLoginSuccess;
  export let onNavigate;

  let email = "";
  let password = "";
  let error = "";

  async function handleLogin() {
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        onLoginSuccess();
      } else {
        error = data.error || "Invalid credentials";
      }
    } catch (e) {
      error = "Server connection failed.";
    }
  }

  function handleGoogleLogin() {
    window.location.href = "http://localhost:3000/api/auth/google";
  }
</script>

<div class="w-screen h-screen bg-[#F6F6F6] flex items-center justify-center p-8">
  <div class="w-full max-w-4xl bg-white rounded-[20px] overflow-hidden shadow-lg flex flex-col lg:flex-row h-full max-h-[800px]">
    
    <div class="w-full lg:w-1/2 p-12 flex flex-col overflow-y-auto">
      <div class="flex justify-between items-center mb-10">
        <div class="flex items-center gap-2 font-semibold text-[#111111]">
          <img src="/assets/images/logo.svg" alt="Logo" class="w-6 h-6">
          <span>Workshop Forge</span>
        </div>
        <button type="button" on:click={() => onNavigate('signup')} class="text-[#B8B9E8] font-semibold">Sign Up</button>
      </div>

      <h1 class="text-3xl font-bold mb-2">Welcome Back</h1>
      <p class="text-gray-500 mb-8">Please enter your details.</p>

      <div class="flex gap-4 mb-6">
        <button type="button" on:click={handleGoogleLogin} class="flex-1 h-12 border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition">
          <img src="/assets/images/google.svg" class="w-5 h-5" alt="Google" />
          <span class="text-sm font-medium">Google</span>
        </button>
      </div>

      <div class="flex items-center gap-2 mb-6 text-sm text-gray-400">
        <div class="h-px bg-gray-200 flex-1"></div><span>or</span><div class="h-px bg-gray-200 flex-1"></div>
      </div>

      {#if error}
        <div class="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>
      {/if}

      <div class="space-y-4">
        <div>
          <label for="login-email" class="block text-sm font-semibold mb-1">Email</label>
          <input id="login-email" type="email" bind:value={email} class="w-full h-12 border rounded-xl px-4 outline-none focus:border-[#1F2D4B]" placeholder="Enter your email" />
        </div>
        <div>
          <label for="login-pass" class="block text-sm font-semibold mb-1">Password</label>
          <input id="login-pass" type="password" bind:value={password} class="w-full h-12 border rounded-xl px-4 outline-none focus:border-[#1F2D4B]" placeholder="Enter your password" />
        </div>
      </div>

      <button type="button" on:click={handleLogin} class="mt-8 h-12 bg-[#1F2D4B] text-white rounded-xl font-semibold hover:opacity-90 transition">Login</button>
    </div>

    <div class="hidden lg:block w-1/2 bg-[#1F2D4B] relative">
      <img src="public/assets/images/sidebanner.svg" class="absolute inset-0 w-full h-full object-cover" alt="Banner" />
    </div>
  </div>
</div>