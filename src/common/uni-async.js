/**
 * uni方法异步化 Proxy代理异步
 */
const uniAsync=new Proxy({},{
	get(target,name){
		return(obj)=>new Promise((resolve,reject)=>{
			uni[name]({
				...obj,
				success:res=>{
					resolve(res)
				},
				fail:err=>{
					reject(err)
				}
			})
		})
	}
})
export default uniAsync