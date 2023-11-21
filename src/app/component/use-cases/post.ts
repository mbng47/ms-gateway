export default function createPost({
  makeInputObj,
  setCache,
  makeFetch,
  logger,
}) {
  return Object.freeze({ post });
  
  async function post({
    params,
    cacheConfig,
    JWTSecret,
    path,
    errorMsgs
  }){
    try {

      if (path.includes('registration')) {
        const destinationPath = 'http://localhost:3011/api/v1/user'

        const results = await makeFetch({ params, path: destinationPath, method: 'post'})

        return results.json();
      }

      if (path.includes('auth')) {
        const authPath = 'http://localhost:3011/api/v1/user/auth'
        const authResults = await makeFetch({ params, path: authPath, method: 'post'})

        const results = await authResults.json()

      
        const token = results.data[0].email;

        const tokenPath = 'http://localhost:3010/api/v1/token'
        const tokenResult = await makeFetch({ params: { token }, path: tokenPath, method: 'post'})
        
        const tokenRes = await tokenResult.json()

        setCache({ data: results.data[0], cacheKey: tokenRes.data, cacheConfig })
        
        return ({
          error: 0,
          data: {
            ...results.data[0],
            token: tokenRes.data
          }
        })
      }
    } catch(err) { 
      throw err
    }
    
  }
}
