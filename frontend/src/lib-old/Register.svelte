<script>
  export let onSwitchToLogin; 

  let username = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  
  let role = "student"; 

  async function handleRegister() {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful! Please login.");
        onSwitchToLogin(); 
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (e) {
      console.error(e);
      alert("Server error");
    }
  }
</script>

<div class="w-screen h-screen bg-[#F6F6F6] overflow-hidden flex font-sans">
  <div class="h-full w-full flex flex-col lg:flex-row gap-8 p-8 box-border">

    <div class="w-full lg:w-1/2 bg-white rounded-[20px] px-8 lg:px-12 py-6 flex flex-col overflow-y-auto">

      <div class="flex justify-between items-center shrink-0">
        <div class="flex items-center gap-3 font-semibold text-[#111111]">
          <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">L</div>
          <span>Workshop Forge</span>
        </div>

        <div class="text-[16px] leading-[19px]">
          <span class="font-normal text-[#111111]">
            Already have an account?
          </span>
          <button on:click={onSwitchToLogin} class="font-semibold text-[#B8B9E8] ml-1 hover:underline">
            Login
          </button>
        </div>
      </div>

      <div class="mt-[30px] lg:mt-[40px]">
        <div class="max-w-[520px] mx-auto text-left">

          <h1 class="text-[30px] font-semibold text-[#111111] mb-2">
            Get Started Now
          </h1>

          <p class="text-[15px] text-[#7A7A7A] leading-[1.5] mb-4">
            Please enter your information to access your account.
          </p>

          <div class="flex flex-col md:flex-row gap-4 mb-5">
            <button class="flex-1 h-[48px] border border-[#E5E5E5] rounded-[16px] flex items-center justify-center gap-2 text-[14px] text-[#111111] whitespace-nowrap hover:bg-gray-50 transition">
                <span class="text-xl font-bold">G</span> 
                <span>Sign up with Google</span>
            </button>

            <button class="flex-1 h-[48px] border border-[#E5E5E5] rounded-[16px] flex items-center justify-center gap-2 text-[14px] text-[#111111] whitespace-nowrap hover:bg-gray-50 transition">
                <span class="text-xl font-bold text-blue-600">f</span> 
                <span>Sign up with Facebook</span>
            </button>
          </div>

          <div class="flex items-center gap-3 mb-5">
            <div class="flex-1 h-px bg-[#E0E0E0]"></div>
            <span class="text-[13px] text-[#9A9A9A]">or</span>
            <div class="flex-1 h-px bg-[#E0E0E0]"></div>
          </div>

          <form on:submit|preventDefault={handleRegister}>
            
            <label class="block text-[13px] font-semibold text-[#111111] mb-1">Name</label>
            <input 
              type="text" 
              required
              bind:value={username}
              class="w-full h-[48px] border border-[#E5E5E5] rounded-[16px] px-4 mb-4 flex items-center text-[#111111] text-[14px] outline-none focus:border-[#1F2D4B] transition"
              placeholder="Enter your full name" 
            />

            <label class="block text-[13px] font-semibold text-[#111111] mb-1">Email</label>
            <input 
              type="email" 
              required
              bind:value={email}
              class="w-full h-[48px] border border-[#E5E5E5] rounded-[16px] px-4 mb-4 flex items-center text-[#111111] text-[14px] outline-none focus:border-[#1F2D4B] transition"
              placeholder="Enter your email" 
            />

            <label class="block text-[13px] font-semibold text-[#111111] mb-1">Password</label>
            <div class="relative h-[48px] border border-[#E5E5E5] rounded-[16px] px-4 mb-4 flex items-center bg-white transition focus-within:border-[#1F2D4B]">
              <input 
                type="password" 
                required
                bind:value={password}
                class="w-full h-full text-[#111111] text-[14px] outline-none bg-transparent"
                placeholder="Enter your password"
              />
              <img src="/eye.svg" alt="" class="w-4 h-4 absolute right-4 opacity-60 cursor-pointer">
            </div>

            <label class="block text-[13px] font-semibold text-[#111111] mb-1">Confirm Password</label>
            <div class="relative h-[48px] border border-[#E5E5E5] rounded-[16px] px-4 mb-6 flex items-center bg-white transition focus-within:border-[#1F2D4B]">
              <input 
                type="password" 
                required
                bind:value={confirmPassword}
                class="w-full h-full text-[#111111] text-[14px] outline-none bg-transparent"
                placeholder="Confirm your password"
              />
              <img src="/eye.svg" alt="" class="w-4 h-4 absolute right-4 opacity-60 cursor-pointer">
            </div>

            <button type="submit" class="w-full h-[52px] bg-[#1F2D4B] rounded-[16px] flex items-center justify-center text-white text-[16px] font-semibold hover:opacity-90 transition">
              Sign up
            </button>

          </form>

        </div>
      </div>

      <div class="mt-auto text-center text-[14px] font-normal text-black pt-4">
        © 2025. All Rights Reserved.
      </div>
    </div>

    <div class="hidden lg:block lg:w-1/2 self-stretch">
      <div class="relative h-full rounded-[20px] overflow-hidden bg-[#1F2D4B]">
        <div class="absolute inset-0 bg-gradient-to-br from-[#1F2D4B] to-black opacity-50"></div>
        <img
          src="public/assets/images/sidebanner.svg"
          alt="Side Banner"
          class="absolute inset-0 w-full h-full object-cover block"
          style="object-position: 100% 100%; transform: scale(1) translateX(40px);"
        />
      </div>
    </div>

  </div>
</div>

<style>
  :global(body) { margin: 0; padding: 0; }
  * { font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif; }
</style>