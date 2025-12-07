<template>
  <div class="min-h-screen bg-[#f2f0e9] font-sans selection:bg-[#b03e3e] selection:text-white flex items-center justify-center p-4 relative overflow-hidden">
    
    <!-- Background: Blurred Restricted Area -->
    <div class="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=2000&auto=format&fit=crop" 
        class="w-full h-full object-cover opacity-20 grayscale mix-blend-multiply"
        alt="Restricted Door"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#f2f0e9] via-[#f2f0e9]/80 to-transparent"></div>
    </div>

    <!-- Main Notice Card -->
    <div class="relative z-10 w-full max-w-md bg-white shadow-2xl border-t-8 border-[#b03e3e] p-10 md:p-12 text-center overflow-hidden rounded-sm">
      
      <!-- Watermark -->
      <ShieldAlert class="absolute -right-8 -bottom-8 w-48 h-48 text-[#b03e3e]/5 -z-0 pointer-events-none rotate-12" />

      <div class="relative z-10">
        <!-- Icon -->
        <div class="mx-auto h-20 w-20 bg-[#b03e3e]/10 flex items-center justify-center mb-8 border-2 border-[#b03e3e]/20 rounded-full">
          <Lock class="h-10 w-10 text-[#b03e3e]" />
        </div>

        <!-- Text -->
        <h2 class="text-[#b03e3e] text-xs font-bold uppercase tracking-[0.3em] mb-3">Security Protocol</h2>
        <h1 class="text-3xl md:text-4xl font-serif font-bold text-[#1a3c34] mb-4">Restricted Access</h1>
        <p class="text-[#1a3c34]/70 font-serif italic mb-10 leading-relaxed text-lg">
          "Scholar credentials are required to view this archive. Please identify yourself."
        </p>

        <!-- Actions -->
        <div class="space-y-4">
          <router-link 
            to="/login"
            class="block w-full py-4 bg-[#1a3c34] text-[#d4c5a3] font-bold uppercase tracking-widest text-xs hover:bg-[#235246] hover:shadow-lg transition-all border border-[#1a3c34]"
          >
            Present Credentials (Login)
          </router-link>
          
          <div class="flex items-center justify-center gap-4 pt-2">
             <span class="h-px w-8 bg-[#1a3c34]/10"></span>
             <span class="text-[#1a3c34]/40 text-[10px] font-mono uppercase">New Scholar?</span>
             <span class="h-px w-8 bg-[#1a3c34]/10"></span>
          </div>

          <router-link 
            to="/register"
            class="block w-full py-3 border border-[#1a3c34]/30 text-[#1a3c34] font-bold uppercase tracking-widest text-xs hover:bg-[#1a3c34] hover:text-white transition-all"
          >
            Apply for Registry
          </router-link>
        </div>

        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-[#1a3c34]/10">
          <router-link to="/" class="inline-flex items-center gap-2 text-[#1a3c34]/50 hover:text-[#1a3c34] transition-colors font-serif italic text-sm group">
            <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return to Public Hall
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { Lock, ShieldAlert, ArrowLeft } from 'lucide-vue-next'
</script>