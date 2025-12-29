/**
 * Creates a fetch proxy that intercepts requests matching a URL pattern
 * and applies custom modifications to the response JSON.
 * 
 * @param {string} urlPattern - Pattern to match in request URLs
 * @param {Function} substitutionFn - Function that takes (clonedJson) and modifies it in place
 * @returns {Proxy} The fetch proxy to be applied to window.fetch
 */
export function createStoryProxy(urlPattern, substitutionFn) {
  const originalFetch = window.fetch;

  const storyFetchProxy = new Proxy(
    originalFetch, 
    {
      apply(target, thisArg, args) {
        const url = args[0];
        if (
          typeof url === 'string' &&
          url.includes(urlPattern)
        ) {

          return originalFetch.apply(thisArg, args).then(async (res) => {
            const originalJson = await res.clone().json();
            const modifiedJson = structuredClone(originalJson);
            
            substitutionFn(modifiedJson);

            return new Response(JSON.stringify(modifiedJson), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });

          });
        } else {
          return Reflect.apply(target, thisArg, args);
        }      

      }
    }
  );

  return storyFetchProxy;
}