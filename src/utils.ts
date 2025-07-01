export function debounce(func: () => void, delay: number) {
    let timeoutId: number | undefined; // Use number instead of NodeJS.Timeout
  
    const debounced = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(func, delay);
    };
  
    debounced.cancel = () => {
      window.clearTimeout(timeoutId);
    };
  
    return debounced;
  }