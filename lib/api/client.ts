import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
} from 'axios'
import { getSession } from 'next-auth/react'

// Lấy base URL từ biến môi trường, với giá trị mặc định cho môi trường dev
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5100/api'

// Định nghĩa cấu hình chung cho Axios
const axiosConfig: AxiosRequestConfig = {
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
}

// Tạo một instance của Axios với cấu hình đã định nghĩa
const httpsAPI: AxiosInstance = axios.create(axiosConfig)

// Thêm interceptor cho request
httpsAPI.interceptors.request.use(
	async config => {
		// Lấy session và access token từ NextAuth.js
		const session = await getSession()
		
		if (session?.accessToken) {
			config.headers.Authorization = `Bearer ${session.accessToken}`
		}
		
		return config
	},
	error => {
		// Xử lý lỗi request
		return Promise.reject(error)
	},
)

// Thêm interceptor cho response
httpsAPI.interceptors.response.use(
	(response: AxiosResponse) => {
		// Bất kỳ status code nào trong khoảng 2xx sẽ đi vào đây
		// Trả về response object để có thể truy cập vào response.data
		return response
	},
	error => {
		// Bất kỳ status code nào ngoài khoảng 2xx sẽ đi vào đây
		// Ví dụ: xử lý lỗi 401 Unauthorized để redirect về trang login
		if (error.response?.status === 401) {
			// Chỉ log 401 nếu không phải là endpoint me (để tránh spam logs khi chưa đăng nhập)
			if (!error.config?.url?.includes('/users/me')) {
				console.error('Unauthorized, redirecting to login...')
			}
		}

		// Xử lý lỗi 403 Forbidden - Access Denied
		if (error.response?.status === 403) {
			console.error('Access Denied: Insufficient permissions for', error.config?.url)
			
			// Redirect to access denied page or home
			if (typeof window !== 'undefined') {
				// Check if we're not already on an error page to avoid redirect loops
				if (!window.location.pathname.includes('/access-denied') && 
				    !window.location.pathname.includes('/auth')) {
					window.location.href = '/access-denied'
				}
			}
		}

		// Xử lý các lỗi khác
		let errorMessage = 'Đã có lỗi xảy ra'

		if (error.response?.data) {
			// Handle structured error responses
			if (
				typeof error.response.data === 'object' &&
				error.response.data.message
			) {
				errorMessage = error.response.data.message

				// Include details if available
				if (error.response.data.details) {
					console.error('Error details:', error.response.data.details)
				}
			}
			// Handle string error responses
			else if (typeof error.response.data === 'string') {
				errorMessage = error.response.data
			}
		} else if (error.message) {
			errorMessage = error.message
		}

		// Log detailed information for debugging (chỉ log nếu không phải 401 từ user endpoints)
		if (!(error.response?.status === 401 && error.config?.url?.includes('/users/me'))) {
			console.error(
				`API call failed: ${errorMessage}`,
				{
					url: error.config?.url,
					method: error.config?.method,
					status: error.response?.status,
					statusText: error.response?.statusText,
					data: error.response?.data,
				},
			)
		}

		return Promise.reject(error)
	},
)

export default httpsAPI
