var u=Object.defineProperty;var g=(n,e,r)=>e in n?u(n,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):n[e]=r;var o=(n,e,r)=>(g(n,typeof e!="symbol"?e+"":e,r),r);import{I as f}from"./index-f8367010.js";const c=class c{constructor(){if(c.instance)return c.instance;c.instance=this}getClient(){return f.getClient()}async createUser(e){const r=this.getClient(),i=Object.fromEntries(Object.entries(e).filter(([a,d])=>d!==void 0)),{data:t,error:s}=await r.from("users").insert([i]).select();if(s)throw s;return t[0]}async getUserById(e){const r=this.getClient(),{data:i,error:t}=await r.from("users").select("*").eq("id",e).single();if(t)throw t;return i}async getUserByEmail(e){const r=this.getClient(),{data:i,error:t}=await r.from("users").select("*").eq("email",e).single();if(t&&t.code!=="PGRST116")throw t;return i}async getUserByUsername(e){const r=this.getClient(),{data:i,error:t}=await r.from("users").select("*").eq("username",e).single();if(t&&t.code!=="PGRST116")throw t;return i}async getUserByNickname(e){const r=this.getClient(),{data:i,error:t}=await r.from("users").select("*").eq("nickname",e).single();if(t&&t.code!=="PGRST116")throw t;return i}async updateUserNickname(e,r){const i=this.getClient(),{data:t,error:s}=await i.from("users").update({nickname:r}).eq("id",e).select();if(s)throw s;return t[0]}async getResources(e={}){let i=this.getClient().from("resources").select("*");e.category&&(i=i.eq("category",e.category)),e.difficulty&&(i=i.eq("difficulty",e.difficulty)),e.search&&(i=i.or(`title.ilike.%${e.search}%,description.ilike.%${e.search}%`)),i=i.order("created_at",{ascending:!1}),e.limit&&(i=i.limit(e.limit)),e.offset&&(i=i.range(e.offset,e.offset+(e.limit||10)-1));const{data:t,error:s}=await i;if(s)throw s;return t}async getResourceById(e){const r=this.getClient(),{data:i,error:t}=await r.from("resources").select("*").eq("id",e).single();if(t)throw t;return i}async createResource(e){const r=this.getClient(),{data:i,error:t}=await r.from("resources").insert([e]).select();if(t)throw t;return i[0]}async addLearningRecord(e){const r=this.getClient(),{data:i,error:t}=await r.from("learning_records").insert([e]).select();if(t)throw t;return i[0]}async getLearningRecords(e,r={}){let t=this.getClient().from("learning_records").select(`
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
      `).eq("user_id",e).order("created_at",{ascending:!1});r.limit&&(t=t.limit(r.limit)),r.offset&&(t=t.range(r.offset,r.offset+(r.limit||10)-1));const{data:s,error:a}=await t;if(a)throw a;return s}async updateLearningProgress(e,r){const i=this.getClient(),{data:t,error:s}=await i.from("learning_records").update({progress:r,completed_at:r>=100?new Date().toISOString():null}).eq("id",e).select();if(s)throw s;return t[0]}async addToFavorites(e,r){const i=this.getClient(),{data:t,error:s}=await i.from("favorites").insert([{user_id:e,resource_id:r}]).select();if(s)throw s;return t[0]}async removeFromFavorites(e,r){const i=this.getClient(),{error:t}=await i.from("favorites").delete().eq("user_id",e).eq("resource_id",r);if(t)throw t}async getFavorites(e,r={}){let t=this.getClient().from("favorites").select(`
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
      `).eq("user_id",e).order("created_at",{ascending:!1});r.limit&&(t=t.limit(r.limit)),r.offset&&(t=t.range(r.offset,r.offset+(r.limit||10)-1));const{data:s,error:a}=await t;if(a)throw a;return s}async customQuery(e,r={}){return f.query(e,r)}};o(c,"instance");let l=c;const h=new l;export{l as SupabaseService,h as supabaseService};
