var u=Object.defineProperty;var g=(c,t,r)=>t in c?u(c,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):c[t]=r;var l=(c,t,r)=>(g(c,typeof t!="symbol"?t+"":t,r),r);import{K as d}from"./index-fbee997b.js";const n=class n{constructor(){if(n.instance)return n.instance;n.instance=this}getClient(){return d.getClient()}async createUser(t){const r=this.getClient(),s=Object.fromEntries(Object.entries(t).filter(([a,f])=>f!==void 0)),{data:e,error:i}=await r.from("users").insert([s]).select();if(i)throw i;return e[0]}async getUserById(t){const r=this.getClient(),{data:s,error:e}=await r.from("users").select("*").eq("id",t).single();if(e)throw e;return s}async getUserByEmail(t){const r=this.getClient(),{data:s,error:e}=await r.from("users").select("*").eq("email",t).single();if(e&&e.code!=="PGRST116")throw e;return s}async getUserByUsername(t){const r=this.getClient(),{data:s,error:e}=await r.from("users").select("*").eq("username",t).single();if(e&&e.code!=="PGRST116")throw e;return s}async getUserByNickname(t){const r=this.getClient(),{data:s,error:e}=await r.from("users").select("*").eq("nickname",t).single();if(e&&e.code!=="PGRST116")throw e;return s}async updateUserNickname(t,r){const s=this.getClient(),{data:e,error:i}=await s.from("users").update({nickname:r}).eq("id",t).select();if(i)throw i;return e[0]}async updateUserPassword(t,r){const s=this.getClient(),e=await this.hashPassword(r),{data:i,error:a}=await s.from("users").update({password_hash:e}).eq("id",t).select();if(a)throw a;return i[0]}async hashPassword(t){const s=new TextEncoder().encode(t),e=await crypto.subtle.digest("SHA-256",s);return Array.from(new Uint8Array(e)).map(a=>a.toString(16).padStart(2,"0")).join("")}async verifyPassword(t,r){return await this.hashPassword(t)===r}async getResources(t={}){let s=this.getClient().from("resources").select("*");t.category&&(s=s.eq("category",t.category)),t.difficulty&&(s=s.eq("difficulty",t.difficulty)),t.search&&(s=s.or(`title.ilike.%${t.search}%,description.ilike.%${t.search}%`)),s=s.order("created_at",{ascending:!1}),t.limit&&(s=s.limit(t.limit)),t.offset&&(s=s.range(t.offset,t.offset+(t.limit||10)-1));const{data:e,error:i}=await s;if(i)throw i;return e}async getResourceById(t){const r=this.getClient(),{data:s,error:e}=await r.from("resources").select("*").eq("id",t).single();if(e)throw e;return s}async createResource(t){const r=this.getClient(),{data:s,error:e}=await r.from("resources").insert([t]).select();if(e)throw e;return s[0]}async createCommunityPost(t){console.log("🔄 Supabase服务：准备创建社区帖子，数据:",t);const r=this.getClient(),{data:s,error:e}=await r.from("community_posts").insert([t]).select();if(e)throw console.error("❌ Supabase服务：创建社区帖子失败:",e),console.error("❌ 错误详情:",e.message,e.details,e.hint),e;return console.log("✅ Supabase服务：社区帖子创建成功，返回数据:",s[0]),s[0]}async addLearningRecord(t){const r=this.getClient(),{data:s,error:e}=await r.from("learning_records").insert([t]).select();if(e)throw e;return s[0]}async getLearningRecords(t,r={}){let e=this.getClient().from("learning_records").select(`
        *,
        resources (
          id,
          title,
          description,
          category,
          difficulty,
          rating,
          duration,
          provider,
          url
        )
      `).order("created_at",{ascending:!1});r.limit&&(e=e.limit(r.limit)),r.offset&&(e=e.range(r.offset,r.offset+(r.limit||10)-1));const{data:i,error:a}=await e;if(a)throw a;return i}async updateLearningProgress(t,r){const s=this.getClient(),{data:e,error:i}=await s.from("learning_records").update({progress:r,completed_at:r>=100?new Date().toISOString():null}).eq("id",t).select();if(i)throw i;return e[0]}async addToFavorites(t,r){const s=this.getClient(),{data:e,error:i}=await s.from("favorites").insert([{user_id:t,resource_id:r}]).select();if(i)throw i;return e[0]}async removeFromFavorites(t,r){const s=this.getClient(),{error:e}=await s.from("favorites").delete().eq("user_id",t).eq("resource_id",r);if(e)throw e}async getFavorites(t,r={}){let e=this.getClient().from("favorites").select(`
        *,
        resources (
          id,
          title,
          description,
          category,
          difficulty,
          rating,
          duration,
          provider,
          url,
          created_at
        )
      `).order("created_at",{ascending:!1});r.limit&&(e=e.limit(r.limit)),r.offset&&(e=e.range(r.offset,r.offset+(r.limit||10)-1));const{data:i,error:a}=await e;if(a)throw a;return i}async customQuery(t,r={}){return d.query(t,r)}};l(n,"instance");let o=n;const w=new o;export{o as SupabaseService,w as supabaseService};
