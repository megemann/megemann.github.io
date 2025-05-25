/**
 * Parse a date string in the format MM/YYYY into a Date object
 * @param {string} dateStr - Date string in MM/YYYY format
 * @returns {Date} - JavaScript Date object
 */
export const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    
    const [month, year] = dateStr.split('/');
    
    // Convert to numbers and adjust month (JavaScript months are 0-indexed)
    const monthNum = parseInt(month, 10) - 1;
    const yearNum = parseInt(year, 10);
    
    return new Date(yearNum, monthNum);
};

/**
 * Format a date object into a more readable string
 * @param {string} dateStr - Date string in MM/YYYY format
 * @returns {string} - Formatted date string (e.g., "January 2024")
 */
export const formatDate = (dateStr) => {
    if (!dateStr) return '';
    
    const date = parseDate(dateStr);
    
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Get the time elapsed since a given date
 * @param {string} dateStr - Date string in MM/YYYY format
 * @returns {string} - Time elapsed (e.g., "2 years ago")
 */
export const getTimeElapsed = (dateStr) => {
    if (!dateStr) return '';
    
    const date = parseDate(dateStr);
    const now = new Date();
    
    const yearDiff = now.getFullYear() - date.getFullYear();
    const monthDiff = now.getMonth() - date.getMonth();
    
    const totalMonths = yearDiff * 12 + monthDiff;
    
    if (totalMonths < 1) return 'This month';
    if (totalMonths === 1) return '1 month ago';
    if (totalMonths < 12) return `${totalMonths} months ago`;
    if (totalMonths === 12) return '1 year ago';
    
    const years = Math.floor(totalMonths / 12);
    return `${years} years ago`;
}; 