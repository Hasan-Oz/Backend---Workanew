<script lang="ts">
  let email = "";
  let password = "";
  let showPassword = false;
  let isLoading = false;
  let errorMessage = "";

  // 1. NAVIGATION HELPER
  // This allows us to switch pages without reloading and getting a 404 error
  function navigate(path: string) {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  async function handleLogin() {
    isLoading = true;
    errorMessage = "";

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        
        // Go to Dashboard
        navigate("/dashboard");
      } else {
        errorMessage = data.error || "Login failed";
      }
    } catch (error) {
      console.error(error);
      errorMessage = "Server connection failed.";
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="w-screen h-screen bg-[#F6F6F6] overflow-hidden font-sans">
  <div class="h-full flex flex-col lg:flex-row gap-8 p-8 box-border">

    <div class="w-full lg:w-1/2 bg-white rounded-[20px] px-8 lg:px-12 py-8 flex flex-col">
      
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3 font-semibold text-[#111111]">
          <img src="/assets/images/logo.svg" alt="Logo" class="w-6 h-6">
          <span>Workshop Forge</span>
        </div>

        <div class="text-[16px]">
          <span class="font-normal text-[#111111]">Don’t have an account?</span>
          <button 
            on:click={() => navigate("/register")} 
            class="font-semibold text-[#B8B9E8] ml-1 hover:text-[#1F2D4B] transition"
          >
            Sign Up
          </button>
        </div>
      </div>

      <div class="mt-[130px]">
        <div class="max-w-[520px] mx-auto text-left">
          <h1 class="text-[34px] font-semibold text-[#111111] mb-4">Get Started Now</h1>
          
          {#if errorMessage}
            <div class="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-sm">{errorMessage}</div>
          {/if}

          <div class="flex flex-col gap-6">
            
            <div>
              <label class="block text-[14px] font-semibold text-[#111111] mb-2">Email</label>
              <input type="email" bind:value={email} placeholder="Enter your email" 
                class="w-full h-[52px] border border-[#E5E5E5] rounded-[16px] px-4 outline-none focus:border-[#1F2D4B] transition" />
            </div>

            <div class="relative">
              <label class="block text-[14px] font-semibold text-[#111111] mb-2">Password</label>
              <input type={showPassword ? "text" : "password"} bind:value={password} placeholder="Enter your password" 
                class="w-full h-[52px] border border-[#E5E5E5] rounded-[16px] px-4 outline-none focus:border-[#1F2D4B] transition" />
              <button on:click={() => showPassword = !showPassword} class="absolute right-4 top-[38px] opacity-60 hover:opacity-100">
                 <img src="/assets/images/eye.svg" alt="Show" class="w-4 h-4">
              </button>
            </div>

            <button 
              type="button" 
              on:click={handleLogin}
              disabled={isLoading}
              class="w-full h-[52px] bg-[#1F2D4B] rounded-[16px] text-white font-semibold hover:bg-[#2a3c5e] transition mt-4 cursor-pointer disabled:opacity-50">
              {isLoading ? "Logging in..." : "Login"}
            </button>
            
          </div>
        </div>
      </div>
      
      <div class="mt-auto text-center text-[16px] font-normal text-black pb-4 lg:pb-0">
        © 2025. All Rights Reserved.
      </div>
    </div>

    <div class="hidden lg:block lg:w-1/2 bg-[#1F2D4B] rounded-[20px] relative overflow-hidden">
       <img
          src="/assets/images/Sidebanner.svg"
          alt="Side Banner"
          class="absolute inset-0 w-full h-full object-cover block"
        />
    </div>
  </div>
</div>