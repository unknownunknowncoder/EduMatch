// 测试帖子收藏功能
// 在浏览器控制台中执行此脚本测试收藏功能

async function testFavoriteFunctionality() {
    console.log('🔍 开始测试帖子收藏功能...')
    
    // 检查用户是否已登录
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
        console.log('❌ 请先登录后再测试收藏功能')
        return
    }
    
    try {
        const user = JSON.parse(currentUser)
        console.log('👤 当前用户:', user.username || user.email)
        
        // 获取数据库客户端
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
        
        // 从环境变量或配置中获取Supabase URL和Key
        const supabaseUrl = 'YOUR_SUPABASE_URL'
        const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
        
        if (!supabaseUrl || !supabaseKey) {
            console.log('⚠️ 请在环境变量中配置Supabase URL和Key')
            return
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey)
        
        // 测试1: 获取帖子列表
        console.log('📄 测试1: 获取帖子列表...')
        const { data: posts, error: postsError } = await supabase
            .from('community_posts')
            .select('*')
            .limit(3)
            
        if (postsError) {
            console.error('❌ 获取帖子失败:', postsError)
            return
        }
        
        console.log('✅ 获取到帖子数量:', posts.length)
        
        if (posts.length === 0) {
            console.log('⚠️ 没有找到帖子，请先创建一些测试帖子')
            return
        }
        
        const testPost = posts[0]
        console.log('📝 测试帖子:', testPost.title)
        
        // 测试2: 检查当前收藏状态
        console.log('⭐ 测试2: 检查当前收藏状态...')
        const { data: currentFavorites, error: favoritesError } = await supabase
            .from('post_favorites')
            .select('*')
            .eq('user_id', user.id)
            .eq('post_id', testPost.id)
            
        if (favoritesError) {
            console.error('❌ 检查收藏状态失败:', favoritesError)
            return
        }
        
        const isCurrentlyFavorited = currentFavorites.length > 0
        console.log('📊 当前收藏状态:', isCurrentlyFavorited ? '已收藏' : '未收藏')
        
        // 测试3: 切换收藏状态
        console.log('🔄 测试3: 切换收藏状态...')
        
        if (isCurrentlyFavorited) {
            // 取消收藏
            const { error: deleteError } = await supabase
                .from('post_favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('post_id', testPost.id)
                
            if (deleteError) {
                console.error('❌ 取消收藏失败:', deleteError)
            } else {
                console.log('✅ 取消收藏成功')
            }
        } else {
            // 添加收藏
            const { error: insertError } = await supabase
                .from('post_favorites')
                .insert({
                    user_id: user.id,
                    post_id: testPost.id
                })
                
            if (insertError) {
                console.error('❌ 添加收藏失败:', insertError)
            } else {
                console.log('✅ 添加收藏成功')
            }
        }
        
        // 等待一段时间让触发器生效
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 测试4: 验证收藏计数更新
        console.log('📊 测试4: 验证收藏计数更新...')
        const { data: updatedPost, error: postUpdateError } = await supabase
            .from('community_posts')
            .select('favorite_count')
            .eq('id', testPost.id)
            .single()
            
        if (postUpdateError) {
            console.error('❌ 获取更新后帖子失败:', postUpdateError)
        } else {
            console.log('✅ 帖子收藏计数:', updatedPost.favorite_count)
        }
        
        console.log('🎉 收藏功能测试完成!')
        
    } catch (error) {
        console.error('❌ 测试过程中出现错误:', error)
    }
}

// 创建测试按钮
function createTestButton() {
    const button = document.createElement('button')
    button.innerHTML = '🔍 测试收藏功能'
    button.style.position = 'fixed'
    button.style.top = '20px'
    button.style.right = '20px'
    button.style.zIndex = '10000'
    button.style.padding = '10px 15px'
    button.style.backgroundColor = '#007bff'
    button.style.color = 'white'
    button.style.border = 'none'
    button.style.borderRadius = '5px'
    button.style.cursor = 'pointer'
    button.style.fontSize = '14px'
    
    button.onclick = testFavoriteFunctionality
    
    document.body.appendChild(button)
    console.log('✅ 测试按钮已添加到页面右上角')
}

// 在页面加载完成后添加测试按钮
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createTestButton)
} else {
    createTestButton()
}

console.log('📋 收藏功能测试脚本已加载')
console.log('💡 使用方法: 在社区页面点击右上角的"测试收藏功能"按钮')
console.log('💡 或者直接调用: testFavoriteFunctionality()')