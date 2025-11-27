import{c as Q,d as W,s as tt,r as J,o as et,x as ot,b as g,e as p,f as n,g as S,u as N,n as F,q as Z,F as P,p as X,j as $,i as G,z as Y,H as O,t as x,_ as st}from"./index-9cc4628e.js";import{useDatabaseStore as nt}from"./database-830f62cb.js";import"./supabase-7d3cd435.js";/**
 * @license lucide-vue-next v0.420.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=Q("ThumbsUpIcon",[["path",{d:"M7 10v12",key:"1qc93n"}],["path",{d:"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",key:"emmmcr"}]]),at={class:"min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6"},rt={class:"mb-8"},it={class:"text-3xl font-bold text-gray-900 dark:text-white flex items-center"},lt={class:"bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6"},ct={class:"flex"},ut={key:0,class:"flex justify-center items-center py-12"},dt={key:0,class:"bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md"},mt={class:"bg-gray-100 dark:bg-gray-700 p-4 rounded-full inline-flex items-center justify-center mb-4"},gt=["onClick"],pt={class:"p-4"},_t={class:"font-semibold text-lg mb-2 line-clamp-2"},vt={class:"flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3"},kt={class:"mr-3"},ft={class:"flex flex-wrap gap-1 mb-3"},yt={key:0,class:"text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"},ht={key:0,class:"bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md"},bt={class:"bg-gray-100 dark:bg-gray-700 p-4 rounded-full inline-flex items-center justify-center mb-4"},xt=["onClick"],wt={class:"p-4"},Ct={class:"font-semibold text-lg mb-2 line-clamp-2"},It={class:"flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3"},St={class:"mr-3"},At={class:"flex flex-wrap gap-1 mb-3"},Dt={key:0,class:"text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"},Nt=W({__name:"LikedFavoritesPage",setup(Ut){const H=tt(),A=J("liked"),v=J([]),k=J([]),E=J(!0),K=()=>{var m,s,c;const i=localStorage.getItem("currentUser");if(i)try{return((m=JSON.parse(i).id)==null?void 0:m.toString())||null}catch(u){console.error("Failed to parse current user:",u)}const t=localStorage.getItem("authStore");if(t)try{return((c=(s=JSON.parse(t).user)==null?void 0:s.id)==null?void 0:c.toString())||null}catch(u){console.error("Failed to parse auth store:",u)}return console.warn("⚠️ 未找到当前用户ID，请先登录"),null},z=i=>{const t=new Date(i);return t.toLocaleDateString("zh-CN")+" "+t.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})},R=async()=>{try{E.value=!0;const i=nt(),t=K();if(!t){console.log("用户未登录，无法加载点赞收藏数据"),v.value=[],k.value=[];return}console.log("开始加载用户点赞收藏数据，用户ID:",t);let m=!1,s=null;try{if(s=await i.getClient(),s||(console.log("数据库客户端未初始化，尝试重新连接..."),await i.reconnect(),s=await i.getClient()),!s)throw new Error("数据库客户端初始化失败");m=!0}catch(c){console.warn("⚠️ 数据库连接失败，尝试直接连接:",c.message);try{const{createClient:u}=await Y(()=>import("./index-31c5edd2.js"),[]),w="https://aonlahundnkxuyxfsmcy.supabase.co",C="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE";w&&C&&(s=u(w,C),console.log("✅ 使用直接连接的Supabase客户端"),m=!0)}catch(u){console.warn("⚠️ 直接连接也失败，使用本地存储:",u.message),m=!1}}if(m&&s)try{console.log("📊 开始从数据库加载点赞和收藏数据...");const{data:c,error:u}=await s.from("post_likes").select(`
            post_id,
            created_at,
            posts:post_id (
              id,
              title,
              content,
              created_at,
              view_count,
              like_count,
              comment_count,
              favorite_count,
              user:user_id (
                id,
                username,
                nickname
              ),
              post_likes!post_likes_post_id_fkey!inner(
                user:user_id (
                  id,
                  username,
                  nickname
                )
              )
            )
          `).eq("user_id",t).order("created_at",{ascending:!1});u?(console.warn("⚠️ 数据库加载点赞失败，切换到本地存储:",u.message),m=!1):(console.log("✅ 点赞帖子数据查询成功，数量:",(c||[]).length),v.value=(c||[]).map(d=>{var o,f,y,h;const e=d.posts,D=((o=e.post_likes)==null?void 0:o.map(_=>{var I,b;return((I=_.user)==null?void 0:I.nickname)||((b=_.user)==null?void 0:b.username)||"匿名用户"}))||[],a=((f=e.user)==null?void 0:f.nickname)||((y=e.user)==null?void 0:y.username)||"匿名用户";return{id:e.id,name:e.title,provider:a,duration:"帖子",rating:e.like_count||0,url:`/post/${e.id}`,matchPoints:((h=e.content)==null?void 0:h.substring(0,100))+(e.content.length>100?"...":""),type:"社区帖子",interaction:{liked:!0,saved:!1,likesCount:e.like_count||0},likedUsers:D,favoritedUsers:[],likeCount:e.like_count||0,favoriteCount:e.favorite_count||0,postDetails:{id:e.id,author:a,content:e.content,createdAt:e.created_at,viewCount:e.view_count||0,commentCount:e.comment_count||0}}}),console.log("✅ 数据库点赞帖子加载完成，数量:",v.value.length),console.log("📋 点赞帖子详情:",v.value.map(d=>({id:d.id,title:d.name,author:d.provider,likedUsers:d.likedUsers}))));const{data:w,error:C}=await s.from("post_favorites").select(`
            post_id,
            created_at,
            posts:post_id (
              id,
              title,
              content,
              created_at,
              view_count,
              like_count,
              comment_count,
              favorite_count,
              user:user_id (
                id,
                username,
                nickname
              ),
              post_favorites!inner(
                user:user_id (
                  id,
                  username,
                  nickname
                )
              )
            )
          `).eq("user_id",t).order("created_at",{ascending:!1});C?(console.warn("⚠️ 数据库加载收藏失败，切换到本地存储:",C.message),m=!1):(console.log("✅ 收藏帖子数据查询成功，数量:",(w||[]).length),k.value=(w||[]).map(d=>{var o,f,y,h;const e=d.posts,D=((o=e.post_favorites)==null?void 0:o.map(_=>{var I,b;return((I=_.user)==null?void 0:I.nickname)||((b=_.user)==null?void 0:b.username)||"匿名用户"}))||[],a=((f=e.user)==null?void 0:f.nickname)||((y=e.user)==null?void 0:y.username)||"匿名用户";return{id:e.id,name:e.title,provider:a,duration:"帖子",rating:e.favorite_count||0,url:`/post/${e.id}`,matchPoints:((h=e.content)==null?void 0:h.substring(0,100))+(e.content.length>100?"...":""),type:"社区帖子",interaction:{liked:!1,saved:!0,likesCount:e.like_count||0},likedUsers:[],favoritedUsers:D,likeCount:e.like_count||0,favoriteCount:e.favorite_count||0,postDetails:{id:e.id,author:a,content:e.content,createdAt:e.created_at,viewCount:e.view_count||0,commentCount:e.comment_count||0}}}),console.log("✅ 数据库收藏帖子加载完成，数量:",k.value.length),console.log("📋 收藏帖子详情:",k.value.map(d=>({id:d.id,title:d.name,author:d.provider,favoritedUsers:d.favoritedUsers}))))}catch(c){console.warn("⚠️ 数据库查询异常，切换到本地存储:",c.message),m=!1}if(!m){console.log("🔄 使用本地存储加载点赞收藏数据，并尝试获取帖子详情");const c=`edumatch_likes_${t}`,u=JSON.parse(localStorage.getItem(c)||"[]"),w=`edumatch_favorites_${t}`,C=JSON.parse(localStorage.getItem(w)||"[]"),d=async a=>{var o,f,y,h;try{console.log(`🔍 尝试获取帖子 ${a} 的详细信息...`);let _=await i.getClient();if(_||(console.log("🔗 数据库客户端未连接，尝试重新连接..."),await i.reconnect(),_=await i.getClient()),_){console.log("✅ 使用数据库存储客户端获取帖子详情");const{data:r,error:l}=await _.from("community_posts").select(`
                id,
                title,
                content,
                created_at,
                view_count,
                like_count,
                comment_count,
                favorite_count,
                user:user_id (
                  id,
                  username,
                  nickname
                )
              `).eq("id",a).single();if(!l&&r){const U=((o=r.user)==null?void 0:o.nickname)||((f=r.user)==null?void 0:f.username)||"匿名用户";return console.log(`✅ 成功获取帖子详情: ${r.title} (作者: ${U})`),{title:r.title,author:U,content:r.content,createdAt:r.created_at,viewCount:r.view_count||0,commentCount:r.comment_count||0,likeCount:r.like_count||0,favoriteCount:r.favorite_count||0}}else console.warn("❌ 数据库查询失败:",l==null?void 0:l.message)}console.log("🔄 尝试直接连接Supabase获取帖子详情...");const{createClient:I}=await Y(()=>import("./index-31c5edd2.js"),[]),b="https://aonlahundnkxuyxfsmcy.supabase.co",M="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE";if(b&&M){const r=I(b,M),{data:l,error:U}=await r.from("community_posts").select(`
                id,
                title,
                content,
                created_at,
                view_count,
                like_count,
                comment_count,
                favorite_count,
                user:user_id (
                  id,
                  username,
                  nickname
                )
              `).eq("id",a).single();if(!U&&l){const T=((y=l.user)==null?void 0:y.nickname)||((h=l.user)==null?void 0:h.username)||"匿名用户";return console.log(`✅ 直接连接成功获取帖子详情: ${l.title} (作者: ${T})`),{title:l.title,author:T,content:l.content,createdAt:l.created_at,viewCount:l.view_count||0,commentCount:l.comment_count||0,likeCount:l.like_count||0,favoriteCount:l.favorite_count||0}}}console.log("🔍 尝试从本地存储的社区帖子数据中查找...");const q="edumatch_community_posts",j=JSON.parse(localStorage.getItem(q)||"[]");if(j&&Array.isArray(j)){const r=j.find(l=>l.id===a);if(r)return console.log(`✅ 从本地缓存中找到帖子: ${r.title}`),{title:r.title||"学习经验分享",author:r.author||"社区用户",content:r.content||"这是一篇来自社区的学习经验分享",createdAt:r.created_at||new Date().toISOString(),viewCount:r.view_count||0,commentCount:r.comment_count||0,likeCount:r.like_count||0,favoriteCount:r.favorite_count||0}}}catch(_){console.warn(`❌ 获取帖子 ${a} 详情失败:`,_.message)}return console.log(`⚠️ 无法获取帖子 ${a} 的详情，使用默认值`),{title:"学习经验分享",author:"社区用户",content:"这是一篇来自社区的学习经验分享，内容暂时无法加载",createdAt:new Date().toISOString(),viewCount:0,commentCount:0,likeCount:0,favoriteCount:0}},e=u.map(async a=>{const o=await d(a.post_id);return{id:a.post_id,name:o.title,provider:o.author,duration:"帖子",rating:0,url:`/post/${a.post_id}`,matchPoints:o.content.substring(0,100)+(o.content.length>100?"...":""),type:"社区帖子",interaction:{liked:!0,saved:!1,likesCount:o.likeCount},likedUsers:["当前用户"],favoritedUsers:[],likeCount:o.likeCount,favoriteCount:o.favoriteCount,postDetails:{id:a.post_id,author:o.author,content:o.content,createdAt:o.createdAt,viewCount:o.viewCount,commentCount:o.commentCount}}}),D=C.map(async a=>{const o=await d(a.post_id);return{id:a.post_id,name:o.title,provider:o.author,duration:"帖子",rating:0,url:`/post/${a.post_id}`,matchPoints:o.content.substring(0,100)+(o.content.length>100?"...":""),type:"社区帖子",interaction:{liked:!1,saved:!0,likesCount:o.likeCount},likedUsers:[],favoritedUsers:["当前用户"],likeCount:o.likeCount,favoriteCount:o.favoriteCount,postDetails:{id:a.post_id,author:o.author,content:o.content,createdAt:o.createdAt,viewCount:o.viewCount,commentCount:o.commentCount}}});v.value=await Promise.all(e),k.value=await Promise.all(D),console.log("✅ 本地存储点赞帖子加载完成，数量:",v.value.length),console.log("✅ 本地存储收藏帖子加载完成，数量:",k.value.length),console.log("📋 点赞帖子详情:",v.value.map(a=>({id:a.id,title:a.name,author:a.provider}))),console.log("📋 收藏帖子详情:",k.value.map(a=>({id:a.id,title:a.name,author:a.provider})))}}catch(i){console.error("加载用户点赞收藏数据失败:",i),v.value=[],k.value=[]}finally{E.value=!1}},V=i=>{H.push(`/post/${i}`)},L=i=>{A.value=i};return et(()=>{R()}),(i,t)=>{const m=ot("router-link");return g(),p("div",at,[n("div",rt,[n("h1",it,[S(N(O),{class:"h-8 w-8 mr-3 text-red-500"}),t[2]||(t[2]=F(" 点赞收藏 ",-1))]),t[3]||(t[3]=n("p",{class:"text-gray-600 dark:text-gray-400 mt-2"},"查看你点赞和收藏的学习资源",-1))]),n("div",lt,[n("div",ct,[n("button",{onClick:t[0]||(t[0]=s=>L("liked")),class:Z(`flex-1 py-4 px-6 flex items-center justify-center transition-colors ${A.value==="liked"?"bg-blue-600 text-white":"hover:bg-gray-100 dark:hover:bg-gray-700"}`)},[S(N(B),{class:"h-5 w-5 mr-2"}),t[4]||(t[4]=n("span",{class:"font-medium"},"我的点赞",-1))],2),n("button",{onClick:t[1]||(t[1]=s=>L("favorites")),class:Z(`flex-1 py-4 px-6 flex items-center justify-center transition-colors ${A.value==="favorites"?"bg-red-500 text-white":"hover:bg-gray-100 dark:hover:bg-gray-700"}`)},[S(N(O),{class:"h-5 w-5 mr-2"}),t[5]||(t[5]=n("span",{class:"font-medium"},"我的收藏",-1))],2)])]),E.value?(g(),p("div",ut,[...t[6]||(t[6]=[n("div",{class:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"},null,-1),n("span",{class:"ml-3 text-lg text-gray-600 dark:text-gray-300"},"正在加载点赞收藏数据...",-1)])])):(g(),p("div",{key:A.value,class:"space-y-6"},[A.value==="liked"?(g(),p(P,{key:0},[v.value.length===0?(g(),p("div",dt,[n("div",mt,[S(N(B),{class:"h-8 w-8 text-gray-400"})]),t[8]||(t[8]=n("h3",{class:"text-lg font-medium mb-2"},"暂无点赞内容",-1)),t[9]||(t[9]=n("p",{class:"text-gray-500 dark:text-gray-400 mb-6"},"浏览社区帖子并点赞，这里将显示你喜欢的内容",-1)),S(m,{to:"/community",class:"px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-block"},{default:X(()=>[...t[7]||(t[7]=[F(" 去社区看看 ",-1)])]),_:1})])):$("",!0),(g(!0),p(P,null,G(v.value,s=>{var c;return g(),p("div",{key:s.id,class:"bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-150 hover:shadow-md cursor-pointer",onClick:u=>V(s.id)},[n("div",pt,[n("h3",_t,x(s.name),1),n("div",vt,[n("span",kt,"作者："+x(s.provider),1),n("span",null,"发布时间："+x(z(((c=s.postDetails)==null?void 0:c.createdAt)||s.created_at)),1)]),n("div",ft,[t[10]||(t[10]=n("span",{class:"text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full"}," 点赞帖子 ",-1)),s.type?(g(),p("span",yt,x(s.type),1)):$("",!0)])])],8,gt)}),128))],64)):(g(),p(P,{key:1},[k.value.length===0?(g(),p("div",ht,[n("div",bt,[S(N(O),{class:"h-8 w-8 text-gray-400"})]),t[12]||(t[12]=n("h3",{class:"text-lg font-medium mb-2"},"暂无收藏内容",-1)),t[13]||(t[13]=n("p",{class:"text-gray-500 dark:text-gray-400 mb-6"},"浏览社区帖子并收藏，这里将显示你保存的内容",-1)),S(m,{to:"/community",class:"px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-block"},{default:X(()=>[...t[11]||(t[11]=[F(" 去社区看看 ",-1)])]),_:1})])):$("",!0),(g(!0),p(P,null,G(k.value,s=>{var c;return g(),p("div",{key:s.id,class:"bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-150 hover:shadow-md cursor-pointer",onClick:u=>V(s.id)},[n("div",wt,[n("h3",Ct,x(s.name),1),n("div",It,[n("span",St,"作者："+x(s.provider),1),n("span",null,"发布时间："+x(z(((c=s.postDetails)==null?void 0:c.createdAt)||s.created_at)),1)]),n("div",At,[t[14]||(t[14]=n("span",{class:"text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded-full"}," 收藏帖子 ",-1)),s.type?(g(),p("span",Dt,x(s.type),1)):$("",!0)])])],8,xt)}),128))],64))]))])}}}),Et=st(Nt,[["__file","E:/前端初级课程/program/EduMatch/src/views/LikedFavoritesPage.vue"]]);export{Et as default};
