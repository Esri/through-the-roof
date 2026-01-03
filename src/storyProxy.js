/**
 * Creates a fetch proxy that intercepts requests matching URL patterns
 * and applies custom modifications to the response JSON.
 * 
 * @param {Array} handlers - Array of {url, subsitutionFn} objects
 * @returns {Proxy} The fetch proxy to be applied to window.fetch
 */
export function createStoryProxy(handlers) {
  const originalFetch = window.fetch;

  const storyFetchProxy = new Proxy(
    originalFetch, 
    {
      apply(target, thisArg, args) {
        const requestUrl = args[0];
        
        if (typeof requestUrl === 'string') {
          // Find matching pattern and its handler
          for (const handler of handlers) {
            if (requestUrl.includes(handler.url)) {
              return originalFetch.apply(thisArg, args).then(async (res) => {
                const originalJson = await res.clone().json();
                const modifiedJson = structuredClone(originalJson);
                
                handler.subsitutionFn(modifiedJson);

                return new Response(JSON.stringify(modifiedJson), {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' }
                });
              });
            }
          }
        }

        // No match found, pass through
        return Reflect.apply(target, thisArg, args);
      }
    }
  );

  return storyFetchProxy;
}