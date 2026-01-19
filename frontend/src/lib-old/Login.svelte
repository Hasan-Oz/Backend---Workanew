<script>
  export let onLogin;
  export let onSwitchToRegister;

  let email = "";
  let password = "";

  async function handleLogin() {
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        // 1. Save Token
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("userId", data.user.id);
        
        // 2. Switch Page (With Safety Fallback)
        if (typeof onLogin === 'function') {
          onLogin(); // The smooth way
        } else {
          window.location.reload(); // The brute force way (if props are missing)
        }

      } else {
        alert(data.error || "Login failed");
      }
    } catch (e) {
      console.error(e);
      alert("Server error");
    }
  }
</script>

<div class="w-screen h-screen bg-[#F6F6F6] overflow-hidden flex font-sans">
  <div class="h-full w-full flex flex-col lg:flex-row gap-8 p-8 box-border">

    <div class="w-full lg:w-1/2 bg-white rounded-[20px] px-8 lg:px-12 py-6 flex flex-col h-full overflow-hidden">

      <div class="flex justify-between items-center shrink-0">
        <div class="flex items-center gap-3 font-semibold text-[#111111]">
          <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">L</div>
          <span>Workshop Forge</span>
        </div>

        <div class="text-[15px] leading-[19px]">
          <span class="font-normal text-[#111111]">
            Don’t have an account?
          </span>
          <button on:click={onSwitchToRegister} class="font-semibold text-[#B8B9E8] ml-1 hover:underline">
            Sign Up
          </button>
        </div>
      </div>

      <div class="flex-1 flex flex-col justify-center w-full max-w-[520px] mx-auto">
        
          <h1 class="text-[30px] font-semibold text-[#111111] mb-2">
            Get Started Now
          </h1>

          <p class="text-[15px] text-[#7A7A7A] leading-[1.5] mb-6">
            Please enter your information to access your account.
          </p>

          <div class="w-full">
            <div class="flex flex-col md:flex-row gap-4 mb-5">
              <button class="flex-1 h-[48px] border border-[#E5E5E5] rounded-[16px] flex items-center justify-center gap-2 text-[14px] text-[#111111] whitespace-nowrap hover:bg-gray-50 transition">
                  <span class="text-xl font-bold">G</span> 
                  <span>Log In with Google</span>
              </button>

              <button class="flex-1 h-[48px] border border-[#E5E5E5] rounded-[16px] flex items-center justify-center gap-2 text-[14px] text-[#111111] whitespace-nowrap hover:bg-gray-50 transition">
                  <span class="text-xl font-bold text-blue-600">f</span> 
                  <span>Log In with Facebook</span>
              </button>
            </div>

            <div class="flex items-center gap-3 mb-5">
              <div class="flex-1 h-px bg-[#E0E0E0]"></div>
              <span class="text-[13px] text-[#9A9A9A]">or</span>
              <div class="flex-1 h-px bg-[#E0E0E0]"></div>
            </div>

            <form on:submit|preventDefault={handleLogin}>
                
                <label class="block text-[13px] font-semibold text-[#111111] mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  bind:value={email}
                  class="w-full h-[48px] border border-[#E5E5E5] rounded-[16px] px-4 mb-4 flex items-center text-[#111111] text-[14px] outline-none focus:border-[#1F2D4B] transition"
                  placeholder="Enter your email"
                />

                <label class="block text-[13px] font-semibold text-[#111111] mb-1">Password</label>
                <div class="relative h-[48px] border border-[#E5E5E5] rounded-[16px] px-4 mb-2 flex items-center bg-white transition focus-within:border-[#1F2D4B]">
                  <input 
                    type="password" 
                    required
                    bind:value={password}
                    class="w-full h-full text-[#111111] text-[14px] outline-none bg-transparent"
                    placeholder="Enter your password"
                  />
                  <img src="/eye.svg" alt="" class="w-4 h-4 absolute right-4 opacity-60 cursor-pointer">
                </div>

                <div class="text-right text-[14px] font-semibold text-[#B8B9E8] mb-6 cursor-pointer hover:underline">
                  Forgot password?
                </div>

                <button type="submit" class="w-full h-[52px] bg-[#1F2D4B] rounded-[16px] flex items-center justify-center text-white text-[16px] font-semibold hover:opacity-90 transition">
                  Login
                </button>
            </form>
          </div>
      </div>

      <div class="mt-auto text-center text-[14px] font-normal text-black shrink-0">
        © 2025. All Rights Reserved.
      </div>
    </div>

    <div class="hidden lg:block lg:w-1/2 self-stretch">
      <div class="relative h-full rounded-[20px] overflow-hidden bg-[#1F2D4B]">
        <div class="absolute inset-0 bg-gradient-to-br from-[#1F2D4B] to-black opacity-50"></div>
        <img
          src="/sidebanner.svg"
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