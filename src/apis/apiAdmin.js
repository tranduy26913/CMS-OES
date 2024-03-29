import { axiosClient,axiosClientWithToken } from "./axiosClient";

 const apiAdmin = {

    getAllCourses: async (params) => {
        const res = await axiosClientWithToken.get('/admin/list-course',)
        return res.data;
    },
    getAllBill: async (params) => {
        const res = await axiosClientWithToken.get('/statistic/list-bills')
        return res.data;
    },
    getAllTransaction: async (params) => {
        const res = await axiosClientWithToken.get('/admin/view-transaction-history')
        return res.data;
    },
    getAllExam: async (params) => {
        const res = await axiosClientWithToken.get('/statistic/all-bills')
        return res.data;
    },
    getAllAssignment: async (params) => {
        const res = await axiosClientWithToken.get('/statistic/all-bills')
        return res.data;
    },
    getAllUsers: async (params) => {
        const res = await axiosClientWithToken.get('/admin/list-user')
        return res.data;
    },
    getAllTakeExam: async (params) => {
        const res = await axiosClientWithToken.get('/statistic/take-exam-detail')
        return res.data;
    },
    deleteUser: async (params) => {
        const res = await axiosClientWithToken.get('/statistic/all-bills')
        return res.data;
    },
    lockUser: async (params) => {
        const res = await axiosClientWithToken.get('/statistic/all-bills')
        return res.data;
    },
    unlockUser: async (params) => {
        const res = await axiosClientWithToken.get('/statistic/all-bills')
        return res.data;
    },
    upgradeUser: async (params) => {
        const res = await axiosClientWithToken.get('/statistic/all-bills')
        return res.data;
    },
    updateStatusUser: async (params) => {
        const res = await axiosClientWithToken.put('/admin/update-user-status',params)
        return res.data;
    },
    updateStatusTransaction: async (params) => {
        const res = await axiosClientWithToken.post('/admin/update-transaction-status',params)
        return res.data;
    },
    updateRoleUser: async (params) => {
        const res = await axiosClientWithToken.put('/admin/update-user-role',params)
        return res.data;
    },
    
    getNumberOfCourses: async () => {
        const res = await axiosClientWithToken.get('/statistic/number-of-courses')
        return res.data;
    },
    getNumberOfExams: async () => {
        const res = await axiosClientWithToken.get('/statistic/number-of-exams')
        return res.data;
    },
    getNumberOfUsers: async () => {
        const res = await axiosClientWithToken.get('/statistic/number-of-users')
        return res.data;
    },
    getNumberOfAssignments: async () => {
        const res = await axiosClientWithToken.get('/statistic/number-of-assignments')
        return res.data;
    },
    getCourseBySlug: async (slug) => {
        const res = await axiosClientWithToken.get('/courses', {params:{slug}})
        return res.data;
    },
    getCourseByCourseID: async (params) => {
        const res = await axiosClientWithToken.get('/course/by-courseid', {params})
        return res.data;
    },
    getListCourseByTeacher: async (params) => {
        const res = await axiosClientWithToken.get('/course/by-teacher')
        return res.data;
    },
    getListStudentToAdd: async (params) => {
        const res = await axiosClientWithToken.get('/course/search-student',{params})
        return res.data;
    },
    getListStudentOfCourse: async (params) => {
        const res = await axiosClientWithToken.get('/course/get-students',{params})
        return res.data;
    },
    getListExamOfCourse: async (params) => {
        const res = await axiosClientWithToken.get('/course/get-exams',{params})
        return res.data;
    },
    addStudentIntoCourse: async (params) => {
        const res = await axiosClientWithToken.post('/course/add-student',params)
        return res.data;
    },
    deleteStudentInCourse: async (params) => {
        const res = await axiosClientWithToken.delete('/course/delete-student',{params})
        return res.data;
    },
    
    createCourse: async (params) => {
        const res = await axiosClient.post('/course', params,{headers: {
            'Content-Type': 'multipart/form-data'
          }})
        return res.data;
    },
}
export default apiAdmin