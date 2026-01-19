<script lang="ts">
  let username = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  
  let showPassword = false;
  let showConfirmPassword = false;
  
  let isLoading = false;
  let errorMessage = "";
  let successMessage = "";

  async function handleRegister() {
    isLoading = true;
    errorMessage = "";
    successMessage = "";

    // 1. Client-side Validation
    if (password !== confirmPassword) {
      errorMessage = "Passwords do not match.";
      isLoading = false;
      return;
    }

    try {
      // 2. Send data to Backend
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, // Mapping "Name" input to "username" backend field
          email, 
          password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. SUCCESS
        console.log("Registration Success:", data);
        successMessage = "Account created! Redirecting to login...";
        
        // Wait 1.5 seconds so user sees the message, then go to login
        setTimeout(() => {
        // Use history push to avoid server reload
        window.history.pushState({}, "", "/login");
        window.dispatchEvent(new PopStateEvent('popstate'));
        }, 1500);

      } else {
        // 4. ERROR
        errorMessage = data.error || "Registration failed";
      }
    } catch (error) {
      console.error(error);
      errorMessage = "Could not connect to server.";
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="w-screen h-screen bg-[#F6F6F6] overflow-hidden font-sans">
  <div class="h-full flex flex-col lg:flex-row gap-8 p-8 box-border">

    <div class="w-full lg:w-1/2 bg-white rounded-[20px] px-8 lg:px-12 py-8 flex flex-col overflow-y-auto">

      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3 font-semibold text-[#111111]">
          <img src="/assets/images/logo.svg" alt="Logo" class="w-6 h-6">
          <span>Workshop Forge</span>
        </div>

        <div class="text-[16px] leading-[19px]">
          <span class="font-normal text-[#111111]">
            Already have an account?
          </span>
          <a href="/login" class="font-semibold text-[#B8B9E8] ml-1">
            Login
          </a>
        </div>
      </div>

      <div class="mt-[80px] lg:mt-[130px]">
        <div class="max-w-[520px] mx-auto text-left">

          <h1 class="text-[34px] font-semibold text-[#111111] mb-4">
            Get Started Now
          </h1>

          <p class="text-[16px] text-[#7A7A7A] leading-[1.5] mb-10">
            Please enter your information to access your account.
          </p>

          {#if errorMessage}
            <div class="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
              {errorMessage}
            </div>
          {/if}

          {#if successMessage}
            <div class="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg text-sm">
              {successMessage}
            </div>
          {/if}

          <form on:submit|preventDefault={handleRegister}>

            <label for="username" class="block text-[14px] font-semibold text-[#111111] mb-2">
              Name
            </label>
            <div class="h-[52px] border border-[#E5E5E5] rounded-[16px] px-4 mb-6 flex items-center text-[#111111] text-[14px] focus-within:border-blue-500 transition">
              <input 
                id="username" 
                type="text" 
                bind:value={username}
                required
                placeholder="Enter your full name" 
                class="w-full h-full outline-none bg-transparent placeholder-[#B5B5B5]"
              />
            </div>

            <label for="email" class="block text-[14px] font-semibold text-[#111111] mb-2">
              Email
            </label>
            <div class="h-[52px] border border-[#E5E5E5] rounded-[16px] px-4 mb-6 flex items-center text-[#111111] text-[14px] focus-within:border-blue-500 transition">
              <input 
                id="email" 
                type="email" 
                bind:value={email}
                required
                placeholder="Enter your email" 
                class="w-full h-full outline-none bg-transparent placeholder-[#B5B5B5]"
              />
            </div>

            <label for="password" class="block text-[14px] font-semibold text-[#111111] mb-2">
              Password
            </label>
            <div class="relative h-[52px] border border-[#E5E5E5] rounded-[16px] px-4 mb-6 flex items-center text-[#111111] text-[14px] focus-within:border-blue-500 transition">
              <input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                bind:value={password}
                required
                placeholder="Enter your password" 
                class="w-full h-full outline-none bg-transparent placeholder-[#B5B5B5]"
              />
              <button type="button" on:click={() => showPassword = !showPassword} class="absolute right-4 opacity-60 hover:opacity-100 cursor-pointer">
                <img src="/assets/images/eye.svg" alt="Show" class="w-4 h-4">
              </button>
            </div>

            <label for="confirm" class="block text-[14px] font-semibold text-[#111111] mb-2">
              Confirm Password
            </label>
            <div class="relative h-[52px] border border-[#E5E5E5] rounded-[16px] px-4 mb-8 flex items-center text-[#111111] text-[14px] focus-within:border-blue-500 transition">
              <input 
                id="confirm" 
                type={showConfirmPassword ? "text" : "password"} 
                bind:value={confirmPassword}
                required
                placeholder="Confirm your password" 
                class="w-full h-full outline-none bg-transparent placeholder-[#B5B5B5]"
              />
               <button type="button" on:click={() => showConfirmPassword = !showConfirmPassword} class="absolute right-4 opacity-60 hover:opacity-100 cursor-pointer">
                <img src="/assets/images/eye.svg" alt="Show" class="w-4 h-4">
              </button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              class="w-full h-[52px] bg-[#1F2D4B] rounded-[16px] flex items-center justify-center text-white text-[16px] font-semibold hover:bg-[#2a3c5e] transition disabled:opacity-50 cursor-pointer">
              {#if isLoading}
                Creating Account...
              {:else}
                Sign up
              {/if}
            </button>

          </form>

        </div>
      </div>

      <div class="mt-auto text-center text-[16px] font-normal text-black pt-8">
        © 2025. All Rights Reserved.
      </div>
    </div>

    <div class="hidden lg:block lg:w-1/2 self-stretch">
      <div class="relative h-full rounded-[20px] overflow-hidden bg-[#1F2D4B]">
        <img
          src="public/assets/images/Sidebanner.svg"
          alt="Side Banner"
          class="absolute inset-0 w-full h-full object-cover block"
        />
      </div>
    </div>

  </div>
</div>