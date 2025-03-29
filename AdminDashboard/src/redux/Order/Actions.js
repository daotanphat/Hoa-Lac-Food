import { api } from '../../config/Api';
import { toast } from "react-toastify";
import { GET_ORDER_BY_SHOP_FAILURE, GET_ORDER_BY_SHOP_REQUEST, GET_ORDER_BY_SHOP_SUCCESS, UPDATE_ORDER_STATUS_FAILURE, UPDATE_ORDER_STATUS_REQUEST, UPDATE_ORDER_STATUS_SUCCESS } from './ActionTypes';

/**
 * Get orders with OData filtering
 * @param {Object} filters - Filter options
 * @param {string} filters.search - Search term for order number or customer
 * @param {string} filters.status - Order status filter
 * @param {string} filters.date - Order date filter
 * @param {number} filters.skip - Number of records to skip (pagination)
 * @param {number} filters.top - Number of records to fetch (pagination)
 * @param {string} filters.orderby - Sort field and direction
 */
export const getOrdersByShop = (filters = {}) => async (dispatch) => {
    dispatch({ type: GET_ORDER_BY_SHOP_REQUEST });

    try {
        // Start building the OData query
        let query = "/odata/order/shop?";
        const queryParams = [];

        // Add $filter parameter if any filters are provided
        const filterConditions = [];

        // Add search filter (on customer.name)
        if (filters.search) {
            filterConditions.push(`contains(customer/email, '${filters.search}')`);
        }

        // Add status filter
        if (filters.status && filters.status !== 'All') {
            filterConditions.push(`status eq '${filters.status}'`);
        }

        // Add date filter (most compatible approach)
        if (filters.date) {
            const selectedDate = new Date(filters.date);
            // Get the date components
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1; // JavaScript months are 0-based
            const day = selectedDate.getDate();
            
            // Create a filter that matches the specified day
            filterConditions.push(`year(createAt) eq ${year} and month(createAt) eq ${month} and day(createAt) eq ${day}`);
        }

        // Combine filter conditions with 'and'
        if (filterConditions.length > 0) {
            queryParams.push(`$filter=${filterConditions.join(' and ')}`);
        }

        // Add sorting
        if (filters.orderby) {
            queryParams.push(`$orderBy=${filters.orderby}`);
        }

        // Add pagination
        if (filters.skip !== undefined) {
            queryParams.push(`$skip=${filters.skip}`);
        }

        if (filters.top !== undefined) {
            queryParams.push(`$top=${filters.top}`);
        } else {
            queryParams.push('$top=10'); // Default page size
        }

        // Combine all query parameters
        query += queryParams.join('&');

        // Make the API call
        const response = await api.get(query);

        dispatch({ type: GET_ORDER_BY_SHOP_SUCCESS, payload: response.data });
    } catch (error) {
        console.log(error);
        
        const errorMessage = error.response?.data?.message || "Failed to fetch orders.";
        dispatch({ type: GET_ORDER_BY_SHOP_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};

export const updateOrderStatus = (orderId, status) => async (dispatch) => {
    dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });

    try {
        const response = await api.put(`/api/order/${orderId}/update-status`, { status });
        dispatch({
            type: UPDATE_ORDER_STATUS_SUCCESS,
            payload: { orderId, status }
        });
        toast.success('Order status updated successfully.');
    } catch (error) {
        console.log(error);

        const errorMessage = error.response?.data?.message || "Failed to update order status.";
        dispatch({ type: UPDATE_ORDER_STATUS_FAILURE, payload: errorMessage });
        toast.error(errorMessage);
    }
};

/**
 * Export orders to Excel with the same OData filtering
 * @param {Object} filters - Filter options (same as getOrdersByShop)
 */
export const exportOrdersToExcel = (filters = {}) => async () => {
    try {
        // Build OData query parameters the same way as getOrdersByShop
        let query = "/odata/order/shop/export-excel?";
        const queryParams = [];
        const filterConditions = [];

        // Add search filter
        if (filters.search) {
            filterConditions.push(`contains(customer/email, '${filters.search}')`);
        }

        // Add status filter
        if (filters.status && filters.status !== 'All') {
            filterConditions.push(`status eq '${filters.status}'`);
        }

        // Add date filter
        if (filters.date) {
            const selectedDate = new Date(filters.date);
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1;
            const day = selectedDate.getDate();
            
            filterConditions.push(`year(createAt) eq ${year} and month(createAt) eq ${month} and day(createAt) eq ${day}`);
        }

        // Combine filter conditions
        if (filterConditions.length > 0) {
            queryParams.push(`$filter=${filterConditions.join(' and ')}`);
        }

        // Combine query parameters
        query += queryParams.join('&');
        
        // Make the API call with blob response type
        const response = await api.get(query, { 
            responseType: 'blob',
        });
        
        // Check if the response is actually an Excel file
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('application/json')) {
            // This is an error response, not an Excel file
            const reader = new FileReader();
            reader.onload = function() {
                try {
                    const errorData = JSON.parse(reader.result);
                    console.error("Export error:", errorData);
                    toast.error(errorData.message || 'Server error during export. Please try again.');
                } catch (e) {
                    toast.error('Server error during export. Please try again.');
                }
            };
            reader.readAsText(response.data);
            return;
        }
        
        // Create a download link and trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        // Generate filename with current date
        const date = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `Orders_${date}.xlsx`);
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success('Export successful!');
    } catch (error) {
        console.error("Export error:", error);
        
        // If we got a blob response with an error
        if (error.response?.data instanceof Blob) {
            const reader = new FileReader();
            reader.onload = function() {
                try {
                    const errorData = JSON.parse(reader.result);
                    toast.error(errorData.message || 'Server error during export. Please try again.');
                } catch (e) {
                    toast.error('Server error during export. Please try again.');
                }
            };
            reader.readAsText(error.response.data);
        } else {
            toast.error(error.response?.data?.message || 'Failed to export orders. Please try again.');
        }
    }
};