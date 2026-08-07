import axios, { AxiosError, AxiosInstance } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem('refreshToken')
            const response = await axios.post(`${API_URL}/auth/refresh`, {
              refreshToken,
            })

            const { accessToken, refreshToken: newRefreshToken } = response.data
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', newRefreshToken)

            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return this.client(originalRequest)
          } catch (refreshError) {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password })
    return response.data
  }

  async register(email: string, password: string, name: string) {
    const response = await this.client.post('/auth/register', { email, password, name })
    return response.data
  }

  async logout() {
    await this.client.post('/auth/logout')
  }

  async refreshToken(refreshToken: string) {
    const response = await this.client.post('/auth/refresh', { refreshToken })
    return response.data
  }

  async getProfile() {
    const response = await this.client.get('/auth/profile')
    return response.data
  }

  // Courses
  async getCourses(params?: any) {
    const response = await this.client.get('/courses', { params })
    return response.data
  }

  async getCourse(id: string) {
    const response = await this.client.get(`/courses/${id}`)
    return response.data
  }

  async enrollCourse(courseId: string) {
    const response = await this.client.post('/enrollments', { courseId })
    return response.data
  }

  async getMyEnrollments() {
    const response = await this.client.get('/enrollments/my')
    return response.data
  }

  // Lessons
  async getLessonProgress(courseId: string) {
    const response = await this.client.get(`/lessons/progress/${courseId}`)
    return response.data
  }

  async updateLessonProgress(lessonId: string, completed: boolean) {
    const response = await this.client.put(`/lessons/${lessonId}/progress`, { completed })
    return response.data
  }

  // Assignments
  async getAssignments(courseId?: string) {
    const response = await this.client.get('/assignments', { params: { courseId } })
    return response.data
  }

  async submitAssignment(assignmentId: string, data: any) {
    const response = await this.client.post(`/assignments/${assignmentId}/submit`, data)
    return response.data
  }

  // Quizzes
  async getQuizzes(courseId?: string) {
    const response = await this.client.get('/quizzes', { params: { courseId } })
    return response.data
  }

  async submitQuiz(quizId: string, answers: any) {
    const response = await this.client.post(`/quizzes/${quizId}/submit`, { answers })
    return response.data
  }

  // Live Classes
  async getLiveClasses() {
    const response = await this.client.get('/live-classes')
    return response.data
  }

  async joinLiveClass(classId: string) {
    const response = await this.client.post(`/live-classes/${classId}/join`)
    return response.data
  }

  // Payments
  async createPayment(orderData: any) {
    const response = await this.client.post('/payments/create', orderData)
    return response.data
  }

  async verifyPayment(paymentId: string, orderId: string, signature: string) {
    const response = await this.client.post('/payments/verify', {
      paymentId,
      orderId,
      signature,
    })
    return response.data
  }

  // Wallet
  async getWalletBalance() {
    const response = await this.client.get('/wallet/balance')
    return response.data
  }

  async getWalletTransactions() {
    const response = await this.client.get('/wallet/transactions')
    return response.data
  }

  // Referrals
  async getReferralCode() {
    const response = await this.client.get('/referrals/my-code')
    return response.data
  }

  async getReferralStats() {
    const response = await this.client.get('/referrals/stats')
    return response.data
  }

  // Certificates
  async getCertificates() {
    const response = await this.client.get('/certificates/my')
    return response.data
  }

  async downloadCertificate(certificateId: string) {
    const response = await this.client.get(`/certificates/${certificateId}/download`, {
      responseType: 'blob',
    })
    return response.data
  }

  // Admin
  async getAdminStats() {
    const response = await this.client.get('/admin/stats')
    return response.data
  }

  async getAdminUsers(params?: any) {
    const response = await this.client.get('/admin/users', { params })
    return response.data
  }

  async getAdminCourses(params?: any) {
    const response = await this.client.get('/admin/courses', { params })
    return response.data
  }

  async getAdminPayments(params?: any) {
    const response = await this.client.get('/admin/payments', { params })
    return response.data
  }

  // Instructor
  async getInstructorStats() {
    const response = await this.client.get('/instructor/stats')
    return response.data
  }

  async getInstructorCourses() {
    const response = await this.client.get('/instructor/courses')
    return response.data
  }

  async createCourse(data: any) {
    const response = await this.client.post('/instructor/courses', data)
    return response.data
  }

  async updateCourse(id: string, data: any) {
    const response = await this.client.put(`/instructor/courses/${id}`, data)
    return response.data
  }
}

export const api = new ApiClient()
